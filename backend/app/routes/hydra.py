from fastapi import APIRouter

from app.models.base import ServiceResponse
from app.services.hydra_service import qa_hydra

router = APIRouter(prefix="/hydra", tags=["Hydra"])


@router.post("/qa", response_model=ServiceResponse)
async def hydra_qa(payload: dict) -> ServiceResponse:
    """Answer questions through the Hydra pipeline."""
    return await qa_hydra(payload)
