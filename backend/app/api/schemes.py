from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.scheme import Scheme
from app.models.user import User
from app.models.profile import Profile
from app.schemas.scheme import SchemeOut
from app.api.deps import get_current_user
from app.services.matching_service import rank_schemes
from app.services.explanation_service import generate_explanations


router = APIRouter(prefix="/api/v1/schemes", tags=["schemes"])


@router.get("", response_model=list[SchemeOut])
def list_schemes(
    category: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Scheme).filter(Scheme.status == "active")
    if category:
        query = query.filter(Scheme.category == category)
    if q:
        like = f"%{q.lower()}%"
        query = query.filter(Scheme.short_name.ilike(like))
    return query.order_by(Scheme.short_name).all()


@router.get("/{slug}", response_model=SchemeOut)
def get_scheme(slug: str, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.slug == slug).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme


@router.post("/recommendations")
def recommendations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Return ranked, explained, and enriched recommendations.

    Each result includes:
    - scheme summary (id, slug, name, category, department)
    - status: eligible | need_info | not_eligible
    - score (0–100) + confidence (0..1) + confidence_label
    - reasons, issues, missing
    - factor_breakdown (weighted factor contributions)
    - narrative_key (template key for localized prose)
    - comparisons (top-2 similar schemes)
    """
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile or not profile.age:
        raise HTTPException(status_code=400, detail="Profile incomplete")

    profile_dict = {
        "age": profile.age,
        "gender": profile.gender,
        "category": profile.category,
        "district": profile.district,
        "annual_income": profile.annual_income,
        "education": profile.education,
        "business_status": profile.business_status,
        "business_idea": profile.business_idea,
        "business_category": profile.business_category,
        "project_cost": profile.project_cost,
        "funding_required": profile.funding_required,
    }

    schemes = db.query(Scheme).filter(Scheme.status == "active").all()
    ranked = rank_schemes(schemes, profile_dict, diversity=True)
    enriched = generate_explanations(ranked)

    return [
        {
            "scheme": {
                "id": r["scheme"].id,
                "slug": r["scheme"].slug,
                "short_name": r["scheme"].short_name,
                "name": r["scheme"].name,
                "category": r["scheme"].category,
                "department": r["scheme"].department,
                "max_loan": r["scheme"].max_loan,
                "subsidy_percent": r["scheme"].subsidy_percent,
            },
            "status": r["status"],
            "score": r["score"],
            "confidence": r["confidence"],
            "confidence_label": r["confidence_label"],
            "reasons": r["reasons"],
            "issues": r["issues"],
            "missing": r["missing"],
            "factor_breakdown": r["factor_breakdown"],
            "narrative_key": r["narrative_key"],
            "comparisons": r["comparisons"],
        }
        for r in enriched
    ]