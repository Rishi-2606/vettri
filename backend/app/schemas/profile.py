from pydantic import BaseModel
from typing import Optional

class ProfileIn(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    category: Optional[str] = None
    district: Optional[str] = None
    annual_income: Optional[int] = None
    education: Optional[str] = None
    business_status: Optional[str] = None
    business_idea: Optional[str] = None
    business_category: Optional[str] = None
    project_cost: Optional[int] = None
    funding_required: Optional[int] = None

class ProfileOut(ProfileIn):
    id: int
    user_id: int
    class Config:
        from_attributes = True