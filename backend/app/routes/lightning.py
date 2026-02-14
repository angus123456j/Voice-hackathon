from fastapi import APIRouter

from app.models.base import ServiceResponse
from app.services.lightning_service import speak_lightning

router = APIRouter(prefix="/lightning", tags=["Lightning"])


@router.post("/speak", response_model=ServiceResponse)
async def lightning_speak(payload: dict) -> ServiceResponse:
    """Generate speech through the Lightning pipeline."""
    return await speak_lightning(payload)
