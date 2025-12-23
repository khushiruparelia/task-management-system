# 📋 Task Management System

A full-stack task management application built with FastAPI and React, featuring JWT authentication, PostgreSQL database, and Redux state management.

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)
![React](https://img.shields.io/badge/React-18.2+-61dafb.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-316192.svg)

---


## ✨ Features

- 🔐 **Secure Authentication** - JWT-based authentication with access tokens
- ✅ **Task Management** - Create, read, update, and delete tasks
- 👤 **User Profiles** - Manage user information and preferences
- 🎨 **Modern UI** - Responsive React interface with Redux state management
- 🔄 **Real-time Updates** - Seamless synchronization between frontend and backend
- 📱 **Mobile Responsive** - Works perfectly on all device sizes
- 🧪 **Tested** - Comprehensive test coverage with Pytest
- 🚀 **Production Ready** - Dockerized and deployment-ready

---

## 🧱 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance async web framework |
| **PostgreSQL** | Relational database for data persistence |
| **SQLAlchemy** | ORM for database operations |
| **Alembic** | Database migration management |
| **JWT** | Secure authentication tokens |
| **Pytest** | Unit and integration testing |
| **Pydantic** | Data validation and serialization |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library for building components |
| **Redux Toolkit** | State management |
| **React Router** | Client-side routing |
| **Axios** | HTTP client for API requests |
| **CSS Modules** | Scoped styling |

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄───────►│  FastAPI Backend│◄───────►│   PostgreSQL    │
│   (Port 3000)   │   HTTP  │   (Port 8000)   │   SQL   │    Database     │
│                 │  + JWT  │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/downloads)

### Clone the Repository

```bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
```

---

## ⚙️ Backend Setup (FastAPI)

### 1️⃣ Create Virtual Environment

```bash
cd backend
python -m venv venv

# Activate virtual environment
source venv/bin/activate      # macOS / Linux
venv\Scripts\activate         # Windows
```

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/task_manager

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment
ENVIRONMENT=development
DEBUG=True
```

> 🔒 **Security Note**: Never commit `.env` files to version control. Use strong, randomly generated secret keys in production.

### 4️⃣ Initialize Database

```bash
# Create database (if not exists)
createdb task_manager

# Run migrations
alembic upgrade head
```

### 5️⃣ Start FastAPI Server

```bash
uvicorn app.main:app --reload
```

✅ Backend is now running at:
- **API**: http://localhost:8000
- **Interactive API Docs (Swagger)**: http://localhost:8000/docs
- **Alternative API Docs (ReDoc)**: http://localhost:8000/redoc

---

## 🎨 Frontend Setup (React)

### 1️⃣ Navigate to Frontend Directory

```bash
cd frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment (Optional)

Create a `.env` file in the `frontend/` directory if you need custom configuration:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

### 4️⃣ Start Development Server

```bash
npm start
# or
npm run dev
```

✅ Frontend is now running at:
- **Application**: http://localhost:3000

### How It Works

1. **User Login**: User submits email and password from React frontend
2. **Token Generation**: FastAPI validates credentials and returns a JWT token
3. **Token Storage**: Token is stored in Redux store (memory) or localStorage
4. **Protected Requests**: Token is sent in `Authorization` header for all subsequent requests
5. **Token Validation**: Backend verifies token before processing protected routes
6. **Token Refresh**: Tokens expire after configured time (default: 30 minutes)

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

## ✅ Best Practices

### Backend
- ✨ **Modular Structure**: Organized by feature (auth, tasks, users)
- 🔒 **Security**: Password hashing with bcrypt, JWT tokens
- 📝 **Type Safety**: Pydantic schemas for validation
- 🧪 **Testing**: Comprehensive test coverage
- 📚 **Documentation**: Auto-generated API docs with Swagger
- 🔄 **Migrations**: Version-controlled database schema

### Frontend
- 🎯 **Component-Based**: Reusable, modular components
- 🗃️ **State Management**: Centralized Redux store
- 🔐 **Auth Handling**: Secure token storage and refresh
- 📱 **Responsive Design**: Mobile-first approach
- ♿ **Accessibility**: ARIA labels and semantic HTML
- 🎨 **Styling**: Scoped CSS modules

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Coding Standards

- Follow PEP 8 for Python code
- Use ESLint for JavaScript code
- Write tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- FastAPI documentation and community
- React and Redux maintainers
- PostgreSQL team
- All contributors to this project

---

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/task-management-system/issues)
- **Email**: your.email@example.com
- **Documentation**: [Wiki](https://github.com/yourusername/task-management-system/wiki)

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>
