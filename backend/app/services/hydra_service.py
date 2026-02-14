from app.models.base import ServiceResponse


async def qa_hydra(payload: dict) -> ServiceResponse:
    """Process a Hydra question-answering request."""
    return ServiceResponse(message="Hydra endpoint ready")
