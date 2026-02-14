from fastapi import APIRouter, HTTPException
from app.models.base import SlideAnalysisRequest, SlideContext, SlideChatRequest, SlideChatResponse
from app.services.slide_service import analyze_slides, chat_with_slides

router = APIRouter(prefix="/slides", tags=["Slides"])

@router.post("/analyze", response_model=list[SlideContext])
async def analyze_endpoint(payload: SlideAnalysisRequest):
    """
    Analyze uploaded slides using Gemini Vision.
    """
    if not payload.images:
        raise HTTPException(status_code=400, detail="No images provided")
    
    import httpx
    try:
        results = await analyze_slides(payload.images)
        return results
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 429:
            raise HTTPException(
                status_code=429,
                detail="Gemini API rate limit exceeded. Your PDF might be too large or you're sending too many requests."
            )
        raise HTTPException(status_code=502, detail=f"Gemini API error: {e.response.status_code}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat", response_model=SlideChatResponse)
async def chat_endpoint(payload: SlideChatRequest):
    """
    Chat with the slide context.
    """
    try:
        result = await chat_with_slides(
            payload.query, 
            payload.context, 
            payload.current_slide,
            payload.history
        )
        return SlideChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
