from sqlalchemy import create_engine, text
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker
from ..app.db.database import Base
from ..app.main import app
from fastapi.testclient import TestClient
import pytest
from ..app.models import Task, Users
from ..app.routers.auth import bcrypt_context

SQLALCHEMY_DATABASE_URL = "postgresql://admin:khushipostgresql@localhost:5432/task_management"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass = StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def override_get_current_user():
    return {'username': 'codingwithrobytest', 'id': 1}

client = TestClient(app)

@pytest.fixture
def test_Task():
    Task = Task(
        title="Learn to code!",
        description="Need to learn everyday!",
        priority=5,
        complete=False,
        user_id=1,
    )

    db = TestingSessionLocal()
    db.add(Task)
    db.commit()
    yield Task
    with engine.connect() as connection:
        connection.execute(text("DELETE FROM Tasks;"))
        connection.commit()


@pytest.fixture
def test_user():
    user = Users(
        email="khushi@email.com",
        name="Khushi",
        hashed_password=bcrypt_context.hash("testpassword")
    )
    db = TestingSessionLocal()
    db.add(user)
    db.commit()
    yield user
    with engine.connect() as connection:
        connection.execute(text("DELETE FROM users;"))
        connection.commit()