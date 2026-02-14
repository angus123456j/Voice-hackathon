from fastapi import APIRouter

from app.models.base import ServiceResponse
from app.services.electron_service import format_electron

router = APIRouter(prefix="/electron", tags=["Electron"])


@router.post("/format", response_model=ServiceResponse)
async def electron_format(payload: dict) -> ServiceResponse:
    """Format content through the Electron pipeline."""
    return await format_electron(payload)

