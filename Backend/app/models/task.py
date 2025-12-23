from app.db.database import Base
from sqlalchemy import Column, Integer, String, Text

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    status = Column(String, default="pending")
    user_id = Column(Integer, index=True)  