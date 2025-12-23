#date time imports
from datetime import timedelta
from datetime import datetime, timedelta, timezone

#jwt imports
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

#models and database imports
from app.models.user import User
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field, constr
from fastapi import APIRouter, Depends, HTTPException
from app.db.database import SessionLocal
from starlette import status
from typing import Annotated

#password hashing imports
from passlib.context import CryptContext

#router setup
router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

#jwt configuration
SECRET_KEY = 'myTaskApplication'
ALGORITHM = 'HS256'
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

#password hashing configuration
bcrypt_context = CryptContext(schemes=["argon2"], deprecated='auto')


class CreateUserRequest(BaseModel):
    email: str
    name: str
    password: str
    is_active: bool = True

class Token(BaseModel):
        access_token: str
        token_type: str

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., example="khushi@gmail.com")
    password: constr(min_length=6) = Field(..., example="StrongPassword123") 

#database session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#database dependency
db_dependency = Annotated[Session, Depends(get_db)]

#check user credentials
def authenticate_user(email: str, password: str, db):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user



#creating jwt token
def create_access_token(email: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': email, 'id': user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)



#dependency to get current user
async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get('sub')
        user_id: int = payload.get('id')
        if email is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate user.')
        return {'email': email, 'id': user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate user.')


# create new user (sign up)
@router.post("/",status_code=status.HTTP_201_CREATED)
async def create_new_user(db:db_dependency, create_user_request: CreateUserRequest):
    create_user = User(
        email = create_user_request.email,
        name = create_user_request.name,
        hashed_password = bcrypt_context.hash(create_user_request.password),
        is_active = create_user_request.is_active,
        )

    db.add(create_user)
    db.commit()


#login user and generate token
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: LoginRequest,
                                 db: db_dependency):
    user = authenticate_user(form_data.email, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate user.')
    token = create_access_token(user.email, user.id, timedelta(minutes=30))

    return {'access_token': token, 'token_type': 'bearer'}


# @router.get("/", status_code=status.HTTP_200_OK)
# async def read_all( db: db_dependency):
#     return db.query(User).all()