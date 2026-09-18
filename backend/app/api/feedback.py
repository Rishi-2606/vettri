from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.scheme import Scheme
from app.models.recommendation_feedback import RecommendationFeedback
from app.schemas.feedback import FeedbackIn, FeedbackOut
from app.api.deps import get_current_user


router = APIRouter(prefix="/api/v1/feedback", tags=["feedback"])


@router.post("/recommendation", response_model=FeedbackOut)
def submit_feedback(
    payload: FeedbackIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if payload.vote not in ("up", "down"):
        raise HTTPException(status_code=400, detail="Vote must be 'up' or 'down'")

    scheme = db.query(Scheme).filter(Scheme.slug == payload.scheme_slug).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    # Replace any prior feedback for same user+scheme
    existing = (
        db.query(RecommendationFeedback)
        .filter(
            RecommendationFeedback.user_id == user.id,
            RecommendationFeedback.scheme_id == scheme.id,
        )
        .first()
    )
    if existing:
        existing.vote = payload.vote
        existing.comment = payload.comment
    else:
        db.add(
            RecommendationFeedback(
                user_id=user.id,
                scheme_id=scheme.id,
                vote=payload.vote,
                comment=payload.comment,
            )
        )
    db.commit()
    return FeedbackOut(ok=True, scheme_slug=scheme.slug, vote=payload.vote)