from sqlalchemy import Column, Integer, String, DateTime
from database.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(8), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(250), nullable=False)
    role = Column(String(20), default="citizen")
    phone = Column(String(15), default="")
    address = Column(String(500), default="")
    profile_pic = Column(String(500), default="")
    token_version = Column(Integer, default=0)
    delete_scheduled_at = Column(DateTime, nullable=True, default=None)