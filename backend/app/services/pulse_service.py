from app.models.base import ServiceResponse


async def stream_pulse(payload: dict) -> ServiceResponse:
    """Process a pulse streaming request."""
    return ServiceResponse(message="Pulse endpoint ready")
