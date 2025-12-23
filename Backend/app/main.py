from fastapi import FastAPI
from app.routers import auth

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"message": "Health Check!!"}


app.include_router(auth.router)