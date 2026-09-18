from fastapi import APIRouter, Depends
from app.schemas.affordability import AffordabilityRequest, AffordabilityResponse
from app.services.affordability_service import calculate_affordability
from app.api.deps import get_current_user
from app.models.user import User


router = APIRouter(prefix="/api/v1/affordability", tags=["affordability"])


@router.post("", response_model=AffordabilityResponse)
def compute_affordability(
    payload: AffordabilityRequest,
    user: User = Depends(get_current_user),
):
    """Compute EMI, DSCR and affordability verdict.

    Requires login. Uses only the values passed in the request body —
    no server-side state.
    """
    return calculate_affordability(payload)