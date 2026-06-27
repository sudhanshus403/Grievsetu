from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from database.database import Base
import datetime

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(8), ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    type = Column(String(50), nullable=False, default="info")  # success, warning, info, security, admin
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
