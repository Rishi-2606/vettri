from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class SchemeIn(BaseModel):
    slug: str
    short_name: str
    category: str
    status: str = "active"
    name: dict
    department: dict
    description: dict
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    max_income: Optional[int] = None
    eligible_categories: Optional[List[str]] = None
    eligible_genders: Optional[List[str]] = None
    eligible_business_status: Optional[List[str]] = None
    education: Optional[str] = None
    max_loan: Optional[int] = None
    interest_rate: Optional[str] = None
    subsidy_percent: int = 0
    moratorium: Optional[str] = None
    repayment_years: Optional[str] = None
    documents: List[str] = []
    source_url: Optional[str] = None
    last_verified: Optional[date] = None
    verified_by: Optional[str] = None


class SchemeOut(SchemeIn):
    id: int

    class Config:
        from_attributes = True