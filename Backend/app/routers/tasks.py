#date imports
from typing import Annotated
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Path
from starlette import status
from ..models import Task
from app.db.database import SessionLocal
from .auth import get_current_user


#router setup
router = APIRouter(
    prefix='/task',
    tags=['task']
)


#database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#database and user dependencies
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


#todo request model
class TaskRequest(BaseModel):
    title: str = Field(min_length=3)
    description: str = Field(min_length=3, max_length=100)
    status: str = Field(default='pending')


#get all tasks of logged in user
@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    return db.query(Task).filter(Task.user_id == user.get('id')).all()


#get specific task of logged in user
@router.get("/{task_id}", status_code=status.HTTP_200_OK)
async def read_todo(user: user_dependency, db: db_dependency, task_id: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')

    todo_model = db.query(Task).filter(Task.id == task_id)\
        .filter(Task.user_id == user.get('id')).first()
    if todo_model is not None:
        return todo_model
    raise HTTPException(status_code=404, detail='Todo not found.')


#create task of logged in user
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_todo(user: user_dependency, db: db_dependency,
                      task_request: TaskRequest):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    todo_model = Task(**task_request.model_dump(), user_id=user.get('id'))

    db.add(todo_model)
    db.commit()


#update task of logged in user
@router.put("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_todo(user: user_dependency, db: db_dependency,
                      task_request: TaskRequest,
                      task_id: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')

    todo_model = db.query(Task).filter(Task.id == task_id)\
        .filter(Task.user_id == user.get('id')).first()
    if todo_model is None:
        raise HTTPException(status_code=404, detail='Todo not found.')

    todo_model.title = task_request.title
    todo_model.description = task_request.description

    db.add(todo_model)
    db.commit()


#delete task of logged in user
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(user: user_dependency, db: db_dependency, task_id: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')

    todo_model = db.query(Task).filter(Task.id == task_id)\
        .filter(Task.user_id == user.get('id')).first()
    if todo_model is None:
        raise HTTPException(status_code=404, detail='Todo not found.')
    db.query(Task).filter(Task.id == task_id).filter(Task.user_id == user.get('id')).delete()

    db.commit()