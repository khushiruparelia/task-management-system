from app.db.database import Base
from sqlalchemy import Column, Integer, String, Text, Boolean

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(Text)
    is_active = Column(Boolean, default=True)