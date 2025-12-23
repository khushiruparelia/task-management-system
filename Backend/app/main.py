#import FastAPI
from fastapi import FastAPI

#import routers
from app.routers import auth
from app.routers import users
from app.routers import tasks

#import CORS middleware
from fastapi.middleware.cors import CORSMiddleware


origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
]

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"], 
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"],
)

#health check route
@app.get("/health")
async def health_check():
    return {"message": "Health Check!!"}

#router inclusion
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tasks.router)