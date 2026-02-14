from fastapi import APIRouter, Depends

from app.config import Settings, get_settings
from app.models.base import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check(settings: Settings = Depends(get_settings)) -> HealthResponse:
    """Return the current health status of the service."""
    return HealthResponse(
        status="ok",
        environment=settings.APP_ENV,
        service="AI Voice Learning Engine",
    )
