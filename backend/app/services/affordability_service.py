"""Loan affordability calculator.

Computes EMI, DSCR, and affordability verdict based on user-supplied
financial inputs and loan terms.
"""
from typing import Dict, Any
from app.schemas.affordability import AffordabilityRequest


def calculate_emi(principal: float, annual_rate_pct: float, tenure_months: int) -> float:
    """Standard reducing-balance EMI formula.

    EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    where r = monthly interest rate, n = months
    """
    if tenure_months <= 0:
        return 0.0
    if annual_rate_pct == 0:
        return principal / tenure_months

    r = annual_rate_pct / 12.0 / 100.0
    factor = (1 + r) ** tenure_months
    emi = principal * r * factor / (factor - 1)
    return emi


def calculate_affordability(payload: AffordabilityRequest) -> Dict[str, Any]:
    loan = float(payload.loan_amount)
    annual_rate = float(payload.interest_rate)
    tenure_months = int(payload.tenure_years) * 12
    moratorium_months = int(payload.moratorium_months or 0)

    monthly_income = float(payload.monthly_income)
    monthly_expenses = float(payload.monthly_expenses or 0)
    existing_obligations = float(payload.existing_obligations or 0)

    # --- EMI on the loan ---
    emi = calculate_emi(loan, annual_rate, tenure_months)

    # --- Interest totals ---
    total_payment = emi * tenure_months
    total_interest = total_payment - loan

    # --- Moratorium interest (simple interest during moratorium) ---
    if moratorium_months > 0:
        moratorium_interest = (
            loan * (annual_rate / 100.0) * (moratorium_months / 12.0)
        )
    else:
        moratorium_interest = 0.0

    # --- Net monthly income available for EMI ---
    net_income = monthly_income - monthly_expenses - existing_obligations
    monthly_surplus = net_income - emi

    # --- DSCR ---
    if emi > 0:
        dscr = net_income / emi
    else:
        dscr = 999.0  # no loan → infinite coverage

    # --- Verdict ---
    if dscr >= 1.5:
        verdict = "comfortable"
    elif dscr >= 1.2:
        verdict = "manageable"
    else:
        verdict = "risky"

    return {
        "emi": round(emi, 2),
        "total_payment": round(total_payment, 2),
        "total_interest": round(total_interest, 2),
        "moratorium_interest": round(moratorium_interest, 2),
        "net_monthly_income": round(net_income, 2),
        "monthly_surplus": round(monthly_surplus, 2),
        "dscr": round(dscr, 2),
        "verdict": verdict,
        "tenure_months": tenure_months,
        "total_months_with_moratorium": tenure_months + moratorium_months,
    }