"""Explanation generator — builds narrative keys and comparison data.

Frontend uses these keys + params to render localized narratives.
"""
from typing import List, Dict, Any


def pick_narrative_key(status: str, confidence_label: str, score: int) -> str:
    """Pick a template key that frontend will translate."""
    if status == "eligible" and score >= 85 and confidence_label == "high":
        return "narrative_strong_match"
    if status == "eligible" and score >= 70:
        return "narrative_good_match"
    if status == "eligible":
        return "narrative_eligible"
    if status == "need_info":
        return "narrative_need_info"
    return "narrative_not_eligible"


def build_comparison(target: Dict[str, Any], ranked: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Return top-2 schemes with similar scores for "why this over that" comparison."""
    target_score = target["score"]
    target_slug = target["scheme"].slug

    others = [r for r in ranked if r["scheme"].slug != target_slug]
    # Only compare with same status
    same_status = [r for r in others if r["status"] == target["status"]]

    comparisons = []
    for r in same_status[:2]:
        diff = target_score - r["score"]
        if abs(diff) < 3:
            continue
        comparisons.append({
            "slug": r["scheme"].slug,
            "short_name": r["scheme"].short_name,
            "name": r["scheme"].name,
            "score": r["score"],
            "difference": diff,
            "reason": _diff_reason(target, r),
        })
    return comparisons


def _diff_reason(target: Dict[str, Any], other: Dict[str, Any]) -> str:
    """Pick the factor where target outperforms other."""
    t_factors = {f["factor"]: f["value"] for f in target["factor_breakdown"]}
    o_factors = {f["factor"]: f["value"] for f in other["factor_breakdown"]}

    best_factor = None
    best_delta = 0
    for name in t_factors:
        delta = t_factors[name] - o_factors.get(name, 0)
        if delta > best_delta:
            best_delta = delta
            best_factor = name

    mapping = {
        "category": "category_fit",
        "income": "income_fit",
        "age": "age_fit",
        "status": "business_status_fit",
        "subsidy": "subsidy_higher",
        "cost_fit": "cost_match",
        "semantic": "semantic_match",
        "district_fit": "district_match",
    }
    return mapping.get(best_factor, "overall_fit")


def generate_explanations(ranked: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Attach narrative keys and comparison data to each ranked result."""
    out = []
    for r in ranked:
        r = dict(r)
        r["narrative_key"] = pick_narrative_key(
            r["status"], r["confidence_label"], r["score"]
        )
        r["comparisons"] = build_comparison(r, ranked)
        out.append(r)
    return out