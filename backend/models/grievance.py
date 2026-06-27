from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from database.database import Base
import datetime

class Grievance(Base):
    __tablename__ = "grievances"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(8), ForeignKey("users.id"))
    text = Column(Text, nullable=False)
    image_path = Column(String(500))
    category = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="pending")
    priority = Column(String(50), nullable=False)
    department = Column(String(50), nullable=False)
    confidence_score = Column(Float, nullable=True)
    address = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.now)
    

    
