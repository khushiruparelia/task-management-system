# task-management-system

🧱 Tech Stack
Backend

FastAPI

PostgreSQL

SQLAlchemy

Alembic (migrations)

JWT Authentication

Pytest

Frontend

React

Redux Toolkit

React Router

Axios / Fetch API

⚙️ Backend Setup (FastAPI)
1️⃣ Create virtual environment
cd backend
python -m venv venv
source venv/bin/activate   # macOS / Linux
venv\Scripts\activate      # Windows

2️⃣ Install dependencies
pip install -r requirements.txt

3️⃣ Environment variables

Create a .env file in backend/:

DATABASE_URL= (Present in the env file of the fastapi)
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

4️⃣ Run database migrations
alembic upgrade head

5️⃣ Start FastAPI server
uvicorn app.main:app --reload


Backend will be available at:

http://localhost:8000


Swagger API docs:

http://localhost:8000/docs

🎨 Frontend Setup (React)
1️⃣ Install dependencies
cd frontend
npm install

2️⃣ Start development server
npm run dev


Frontend runs at:

http://localhost:3000

🔐 Authentication Overview

User logs in from React

FastAPI returns a JWT token

Token is stored on the frontend (Redux / memory)

Token is sent in requests via Authorization header

Protected routes are secured on both frontend and backend

🌐 CORS Configuration (FastAPI)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

🧪 Running Tests
cd backend
pytest

🗄️ Database

PostgreSQL is used as the main database

SQLAlchemy handles ORM

Alembic manages schema migrations

🚀 Deployment (High Level)

Backend: Docker + Uvicorn/Gunicorn

Frontend: React build served via Nginx

Database: Managed PostgreSQL (AWS RDS, Supabase, etc.)

✅ Best Practices

Modular backend structure

Environment-based configuration

Global state management with Redux

Secure authentication with JWT

Automated testing with Pytest
