from pydantic import BaseModel


class ServiceResponse(BaseModel):
    """Standard response returned by service endpoints."""

    message: str


class HealthResponse(BaseModel):
    """Response model for the health check endpoint."""

    status: str
    environment: str
    service: str
