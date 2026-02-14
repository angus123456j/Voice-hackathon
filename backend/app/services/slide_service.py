import json
import httpx
from app.config import get_settings
from app.models.base import SlideContext

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

async def analyze_slides(images_b64: list[str]) -> list[SlideContext]:
    """
    Sends slide images to Gemini Vision to extract text and descriptions.
    Batches requests aggressively to avoid 429 errors.
    """
    settings = get_settings()
    all_results = []
    # Vision models have much tighter TPM limits.
    # Reducing batch size to 4 slides per request.
    batch_size = 4 
    
    for i in range(0, len(images_b64), batch_size):
        batch = images_b64[i : i + batch_size]
        parts = []
        for j, img in enumerate(batch):
            slide_idx = i + j + 1
            if "base64," in img:
                img = img.split("base64,")[1]
                
            parts.append({"text": f"--- Slide {slide_idx} ---"})
            parts.append({
                "inline_data": {
                    "mime_type": "image/jpeg",
                    "data": img
                }
            })
        
        prompt = """
        Analyze these lecture slides sequentially. For EACH slide, provide:
        1. A detailed visual description (diagrams, charts, images).
        2. All text content extracted verbatim.
        
        Output strictly in JSON format as a list of objects:
        [
            {"slide_number": X, "description": "...", "text_content": "..."},
            ...
        ]
        Do not use markdown code blocks. Just valid JSON.
        """
        parts.append({"text": prompt})

        async with httpx.AsyncClient(timeout=150.0) as client:
            response = await client.post(
                f"{GEMINI_URL}?key={settings.GEMINI_API_KEY}",
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [{"parts": parts}],
                    "generationConfig": {"response_mime_type": "application/json"} 
                },
            )
            
            # Explicitly catch 429
            if response.status_code == 429:
                raise httpx.HTTPStatusError("Rate limit exceeded", request=response.request, response=response)
                
            response.raise_for_status()
            data = response.json()
            
        try:
            candidates = data.get("candidates", [])
            if not candidates:
                raise ValueError("No candidates returned from Gemini")
                
            text_response = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            
            # JSON cleanup
            clean_json = text_response.strip()
            if clean_json.startswith("```"):
                lines = clean_json.split("\n")
                if lines[0].startswith("```"): lines = lines[1:]
                if lines[-1].startswith("```"): lines = lines[:-1]
                clean_json = "\n".join(lines).strip()

            slides_data = json.loads(clean_json)
            all_results.extend([SlideContext(**s) for s in slides_data])
            
            # Aggressive delay: Vision tokens count for a lot in RPM/TPM limits
            import asyncio
            if i + batch_size < len(images_b64):
                await asyncio.sleep(4.0) 
            
        except Exception as e:
            print(f"Error in batch {i}: {e}")
            raise ValueError(f"Batch analysis failed: {str(e)}")
            
    return all_results


async def chat_with_slides(query: str, context: list[SlideContext], current_slide: int, history: list[dict]) -> dict:
    """
    Chat with the slides context.
    Returns {"answer": str, "suggested_slide": int | None}
    """
    settings = get_settings()
    
    # Construct system prompt with context
    context_str = "\n".join([
        f"--- Slide {s.slide_number} ---\n[Visuals]: {s.description}\n[Text]: {s.text_content}"
        for s in context
    ])
    
    system_instruction = f"""
    You are a teaching assistant helping a student with their lecture slides.
    
    CONTEXT (Slides):
    {context_str}
    
    CURRENT SLIDE: {current_slide + 1}
    
    INSTRUCTIONS:

    1. Understand the student’s question and identify the key concept(s).

    2. Answer using the slide content as the primary source.
    - If the answer is clearly supported by the slides, base your answer on them.
    - If the question is relevant to the topic but not explicitly covered, answer using general knowledge, but connect it briefly to the slide material.
    - If the question is not relevant to the slide topic, respond: "This question is not relevant to the provided slides."

    3. Determine the MOST relevant slide:
    - Compare the question against all slides.
    - Select the single best matching slide.
    - Always return one slide number (even if it is the current slide).

    4. Keep the answer concise:
    - Maximum 2–4 sentences
    - No unnecessary explanation
    - Be clear and direct

    5. Do NOT include reasoning or explanations about how you chose the slide.

    OUTPUT FORMA:
    Return JSON:
    {{
        "answer": "Your answer here...",
        "suggested_slide": 5  // Optional: null if no change needed, or if strictly answering from current slide.
    }}

    """
    
    contents = []
    # Add history
    for msg in history:
        role = "user" if msg["role"] == "user" else "model"
        contents.append({"role": role, "parts": [{"text": msg["content"]}]})
        
    # Add current query
    contents.append({"role": "user", "parts": [{"text": query}]})

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{GEMINI_URL}?key={settings.GEMINI_API_KEY}",
            headers={"Content-Type": "application/json"},
            json={
                "systemInstruction": {"parts": [{"text": system_instruction}]},
                "contents": contents,
                "generationConfig": {"response_mime_type": "application/json"}
            },
        )
        response.raise_for_status()
        data = response.json()
        
    try:
        text_response = data["candidates"][0]["content"]["parts"][0]["text"]
        result = json.loads(text_response)
        return result
    except Exception as e:
        print(f"Error parsing chat response: {e}")
        return {"answer": "I'm sorry, I couldn't process that request.", "suggested_slide": None}
