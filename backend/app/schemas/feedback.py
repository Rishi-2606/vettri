from pydantic import BaseModel
from typing import Optional


class FeedbackIn(BaseModel):
    scheme_slug: str
    vote: str  # up | down
    comment: Optional[str] = None


class FeedbackOut(BaseModel):
    ok: bool
    scheme_slug: str
    vote: str