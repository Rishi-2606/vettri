from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.profile import Profile
from app.schemas.profile import ProfileIn, ProfileOut
from app.api.deps import get_current_user


router = APIRouter(prefix="/api/v1/users", tags=["users"])


@router.get("/profile", response_model=ProfileOut | None)
def get_profile(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return db.query(Profile).filter(Profile.user_id == user.id).first()


@router.put("/profile", response_model=ProfileOut)
def upsert_profile(
    payload: ProfileIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(user_id=user.id)
        db.add(profile)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile