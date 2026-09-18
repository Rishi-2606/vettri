from sqlalchemy import Column, Integer, String, Date, JSON, DateTime
from datetime import datetime
from app.database import Base

class Scheme(Base):
    __tablename__ = "schemes"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(80), unique=True, index=True, nullable=False)
    short_name = Column(String(40), nullable=False)
    category = Column(String(40), nullable=False, index=True)
    status = Column(String(20), default="active", index=True)
    name = Column(JSON, nullable=False)
    department = Column(JSON, nullable=False)
    description = Column(JSON, nullable=False)
    min_age = Column(Integer, nullable=True)
    max_age = Column(Integer, nullable=True)
    max_income = Column(Integer, nullable=True)
    eligible_categories = Column(JSON, nullable=True)
    eligible_genders = Column(JSON, nullable=True)
    eligible_business_status = Column(JSON, nullable=True)
    education = Column(String(80), nullable=True)
    max_loan = Column(Integer, nullable=True)
    interest_rate = Column(String(80), nullable=True)
    subsidy_percent = Column(Integer, default=0)
    moratorium = Column(String(80), nullable=True)
    repayment_years = Column(String(80), nullable=True)
    documents = Column(JSON, nullable=False)
    source_url = Column(String(500), nullable=True)
    last_verified = Column(Date, nullable=True)
    verified_by = Column(String(120), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)