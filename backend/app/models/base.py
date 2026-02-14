from pydantic import BaseModel


class ServiceResponse(BaseModel):
    """Standard response returned by service endpoints."""

    message: str


class HealthResponse(BaseModel):
    """Response model for the health check endpoint."""

    status: str
    environment: str
    service: str


class PulseTranscriptionResponse(BaseModel):
    """Response from Pulse batch transcription."""

    transcription: str


class PulseTranscriptionLatexResponse(BaseModel):
    """Response from Pulse transcription with LaTeX formatting."""

    latex: str


class ParseRequest(BaseModel):
    """Request body for parse endpoint."""

    text: str


class ParseResponse(BaseModel):
    """Response from parse endpoint."""

    formatted: str


class SlideAnalysisRequest(BaseModel):
    """Request to analyze slides."""
    images: list[str]  # List of base64 encoded images


class SlideContext(BaseModel):
    """Visual explanation and text content of a single slide."""
    slide_number: int
    description: str
    text_content: str


class SlideChatRequest(BaseModel):
    """Request to chat with slides."""
    query: str
    context: list[SlideContext]
    current_slide: int
    history: list[dict] = [] # list of {"role": "user"|"model", "content": "..."}


class SlideChatResponse(BaseModel):
    """Response from slide chat."""
    answer: str
    suggested_slide: int | None = None
