from fastapi import APIRouter

from app.models.base import ServiceResponse
from app.services.pulse_service import stream_pulse

router = APIRouter(prefix="/pulse", tags=["Pulse"])


@router.post("/stream", response_model=ServiceResponse)
async def pulse_stream(payload: dict) -> ServiceResponse:
    """Stream audio through the Pulse pipeline."""
    return await stream_pulse(payload)
