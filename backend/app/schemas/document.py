from pydantic import BaseModel
from typing import List


class DocumentItem(BaseModel):
    document_name: str
    has_it: bool


class ChecklistResponse(BaseModel):
    scheme_id: int
    scheme_slug: str
    scheme_short_name: str
    scheme_name: dict
    items: List[DocumentItem]
    total: int
    have_count: int


class ChecklistUpdateRequest(BaseModel):
    items: List[DocumentItem]