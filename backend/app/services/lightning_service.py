from app.models.base import ServiceResponse


async def speak_lightning(payload: dict) -> ServiceResponse:
    """Process a lightning speech request."""
    return ServiceResponse(message="Lightning endpoint ready")
