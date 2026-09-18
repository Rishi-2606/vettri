from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    category = Column(String(20), nullable=True)
    district = Column(String(60), nullable=True)
    annual_income = Column(Integer, nullable=True)
    education = Column(String(60), nullable=True)
    business_status = Column(String(20), nullable=True)
    business_idea = Column(Text, nullable=True)
    business_category = Column(String(60), nullable=True)
    project_cost = Column(Integer, nullable=True)
    funding_required = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = relationship("User", back_populates="profile")