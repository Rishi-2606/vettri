from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import date

from app.database import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.models.profile import Profile
from app.models.scheme import Scheme
from app.schemas.scheme import SchemeIn, SchemeOut


router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


# ============================================================
# SCHEMES
# ============================================================

@router.get("/schemes", response_model=list[SchemeOut])
def admin_list_schemes(
    q: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    query = db.query(Scheme)
    if q:
        like = f"%{q.lower()}%"
        query = query.filter(
            (Scheme.short_name.ilike(like)) | (Scheme.slug.ilike(like))
        )
    if category:
        query = query.filter(Scheme.category == category)
    if status:
        query = query.filter(Scheme.status == status)
    return query.order_by(Scheme.id.desc()).all()


@router.post("/schemes", response_model=SchemeOut, status_code=201)
def admin_create_scheme(
    payload: SchemeIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    existing = db.query(Scheme).filter(Scheme.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already in use")

    data = payload.model_dump()
    if not data.get("verified_by"):
        data["verified_by"] = admin.name
    if not data.get("last_verified"):
        data["last_verified"] = date.today()

    scheme = Scheme(**data)
    db.add(scheme)
    db.commit()
    db.refresh(scheme)
    return scheme


@router.put("/schemes/{scheme_id}", response_model=SchemeOut)
def admin_update_scheme(
    scheme_id: int,
    payload: SchemeIn,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    if payload.slug != scheme.slug:
        conflict = db.query(Scheme).filter(Scheme.slug == payload.slug).first()
        if conflict:
            raise HTTPException(status_code=400, detail="Slug already in use")

    data = payload.model_dump()
    data["verified_by"] = admin.name
    data["last_verified"] = date.today()

    for field, value in data.items():
        setattr(scheme, field, value)

    db.commit()
    db.refresh(scheme)
    return scheme


@router.delete("/schemes/{scheme_id}", status_code=204)
def admin_delete_scheme(
    scheme_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    db.delete(scheme)
    db.commit()
    return None


# ============================================================
# USERS
# ============================================================

@router.get("/users")
def admin_list_users(
    limit: int = Query(50, le=200),
    offset: int = 0,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    total = db.query(User).count()
    users = (
        db.query(User)
        .order_by(User.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "items": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "language": u.language,
                "is_admin": u.is_admin,
                "created_at": u.created_at,
                "has_profile": u.profile is not None,
            }
            for u in users
        ],
    }


# ============================================================
# ANALYTICS
# ============================================================

@router.get("/analytics/overview")
def admin_analytics_overview(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    total_users = db.query(User).count()
    total_admins = db.query(User).filter(User.is_admin.is_(True)).count()
    total_profiles = db.query(Profile).count()
    total_schemes = db.query(Scheme).count()
    active_schemes = db.query(Scheme).filter(Scheme.status == "active").count()

    cat_rows = (
        db.query(Scheme.category, func.count(Scheme.id))
        .group_by(Scheme.category)
        .all()
    )
    by_category = [{"category": c, "count": n} for c, n in cat_rows]

    lang_rows = (
        db.query(User.language, func.count(User.id))
        .group_by(User.language)
        .all()
    )
    by_language = [{"language": l or "en", "count": n} for l, n in lang_rows]

    return {
        "totals": {
            "users": total_users,
            "admins": total_admins,
            "profiles": total_profiles,
            "schemes": total_schemes,
            "active_schemes": active_schemes,
            "profile_completion_rate": round(
                (total_profiles / total_users * 100) if total_users else 0, 1
            ),
        },
        "by_category": by_category,
        "by_language": by_language,
    }