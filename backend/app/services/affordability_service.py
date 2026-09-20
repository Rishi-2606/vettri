"""Loan affordability calculator with detailed reasoning."""
from typing import Dict, Any, List
from app.schemas.affordability import AffordabilityRequest


def calculate_emi(principal: float, annual_rate_pct: float, tenure_months: int) -> float:
    if tenure_months <= 0:
        return 0.0
    if annual_rate_pct == 0:
        return principal / tenure_months
    r = annual_rate_pct / 12.0 / 100.0
    factor = (1 + r) ** tenure_months
    return principal * r * factor / (factor - 1)


def _build_reasons(
    verdict: str,
    dscr: float,
    emi: float,
    net_income: float,
    monthly_surplus: float,
) -> List[Dict[str, Any]]:
    """Return list of reason dicts: { key, value? } — translated in frontend."""
    reasons = []
    emi_ratio = (emi / net_income * 100) if net_income > 0 else 100.0

    if verdict == "risky":
        if emi_ratio > 60:
            reasons.append({"key": "reason_emi_ratio_high", "value": round(emi_ratio, 1)})
        if monthly_surplus < 0:
            reasons.append({"key": "reason_negative_surplus", "value": round(abs(monthly_surplus), 0)})
        elif monthly_surplus < emi * 0.15:
            reasons.append({"key": "reason_low_surplus", "value": round(monthly_surplus, 0)})
        reasons.append({"key": "reason_dscr_below_1_2", "value": round(dscr, 2)})
        reasons.append({"key": "reason_consider_smaller"})

    elif verdict == "manageable":
        reasons.append({"key": "reason_emi_ratio_ok", "value": round(emi_ratio, 1)})
        reasons.append({"key": "reason_surplus_ok", "value": round(monthly_surplus, 0)})
        reasons.append({"key": "reason_dscr_1_2_to_1_5", "value": round(dscr, 2)})

    else:  # comfortable
        reasons.append({"key": "reason_emi_ratio_low", "value": round(emi_ratio, 1)})
        reasons.append({"key": "reason_surplus_strong", "value": round(monthly_surplus, 0)})
        reasons.append({"key": "reason_dscr_above_1_5", "value": round(dscr, 2)})
        reasons.append({"key": "reason_comfortable_msg"})

    return reasons


def calculate_affordability(payload: AffordabilityRequest) -> Dict[str, Any]:
    loan = float(payload.loan_amount)
    annual_rate = float(payload.interest_rate)
    tenure_months = int(payload.tenure_years) * 12
    moratorium_months = int(payload.moratorium_months or 0)

    monthly_income = float(payload.monthly_income)
    monthly_expenses = float(payload.monthly_expenses or 0)
    existing_obligations = float(payload.existing_obligations or 0)

    emi = calculate_emi(loan, annual_rate, tenure_months)
    total_payment = emi * tenure_months
    total_interest = total_payment - loan

    if moratorium_months > 0:
        moratorium_interest = loan * (annual_rate / 100.0) * (moratorium_months / 12.0)
    else:
        moratorium_interest = 0.0

    net_income = monthly_income - monthly_expenses - existing_obligations
    monthly_surplus = net_income - emi

    dscr = (net_income / emi) if emi > 0 else 999.0

    # Verdict — three tiers
    if dscr >= 1.5 and monthly_surplus >= 0:
        verdict = "comfortable"
    elif dscr >= 1.2 and monthly_surplus >= 0:
        verdict = "manageable"
    else:
        verdict = "risky"

    reasons = _build_reasons(verdict, dscr, emi, net_income, monthly_surplus)

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
        "reasons": reasons,
    }