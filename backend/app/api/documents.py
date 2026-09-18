from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.scheme import Scheme
from app.models.user_document import UserDocument
from app.schemas.document import (
    ChecklistResponse,
    ChecklistUpdateRequest,
    DocumentItem,
)
from app.api.deps import get_current_user


router = APIRouter(prefix="/api/v1/documents", tags=["documents"])


@router.get("/schemes/{slug}", response_model=ChecklistResponse)
def get_checklist(
    slug: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    scheme = db.query(Scheme).filter(Scheme.slug == slug).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    doc_names = scheme.documents or []

    saved = {
        d.document_name: d.has_it
        for d in db.query(UserDocument)
        .filter(
            UserDocument.user_id == user.id,
            UserDocument.scheme_id == scheme.id,
        )
        .all()
    }

    items = [
        DocumentItem(document_name=name, has_it=saved.get(name, False))
        for name in doc_names
    ]

    have_count = sum(1 for i in items if i.has_it)

    return ChecklistResponse(
        scheme_id=scheme.id,
        scheme_slug=scheme.slug,
        scheme_short_name=scheme.short_name,
        scheme_name=scheme.name,
        items=items,
        total=len(items),
        have_count=have_count,
    )


@router.put("/schemes/{slug}")
def update_checklist(
    slug: str,
    payload: ChecklistUpdateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    scheme = db.query(Scheme).filter(Scheme.slug == slug).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    for item in payload.items:
        existing = (
            db.query(UserDocument)
            .filter(
                UserDocument.user_id == user.id,
                UserDocument.scheme_id == scheme.id,
                UserDocument.document_name == item.document_name,
            )
            .first()
        )

        if existing:
            existing.has_it = item.has_it
        else:
            db.add(
                UserDocument(
                    user_id=user.id,
                    scheme_id=scheme.id,
                    document_name=item.document_name,
                    has_it=item.has_it,
                )
            )

    db.commit()
    return {"ok": True}