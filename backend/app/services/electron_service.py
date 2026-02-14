from app.models.base import ServiceResponse


async def format_electron(payload: dict) -> ServiceResponse:
    """Process an electron formatting request."""
    return ServiceResponse(message="Electron endpoint ready")
