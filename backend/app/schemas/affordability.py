from pydantic import BaseModel, Field


class AffordabilityRequest(BaseModel):
    loan_amount: float = Field(..., gt=0, description="Loan amount in ₹")
    interest_rate: float = Field(..., ge=0, le=50, description="Annual interest rate %")
    tenure_years: int = Field(..., ge=1, le=30, description="Loan tenure in years")
    moratorium_months: int = Field(0, ge=0, le=24, description="Moratorium period in months")
    monthly_income: float = Field(..., gt=0, description="Monthly net income in ₹")
    monthly_expenses: float = Field(0, ge=0, description="Monthly household expenses in ₹")
    existing_obligations: float = Field(0, ge=0, description="Existing EMIs / loans in ₹")


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