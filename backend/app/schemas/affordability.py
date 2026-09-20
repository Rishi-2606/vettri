from pydantic import BaseModel, Field
from typing import List, Dict, Any


class AffordabilityRequest(BaseModel):
    loan_amount: float = Field(..., gt=0)
    interest_rate: float = Field(..., ge=0, le=50)
    tenure_years: int = Field(..., ge=1, le=30)
    moratorium_months: int = Field(0, ge=0, le=24)
    monthly_income: float = Field(..., gt=0)
    monthly_expenses: float = Field(0, ge=0)
    existing_obligations: float = Field(0, ge=0)


class AffordabilityResponse(BaseModel):
    emi: float
    total_payment: float
    total_interest: float
    moratorium_interest: float
    net_monthly_income: float
    monthly_surplus: float
    dscr: float
    verdict: str  # comfortable | manageable | risky
    tenure_months: int
    total_months_with_moratorium: int
    reasons: List[Dict[str, Any]] = []