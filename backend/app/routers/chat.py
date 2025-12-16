"""Chat Router - Handles conversational AI for material inquiries and RFQ."""
from fastapi import APIRouter, HTTPException
from app.models.chat import ChatRequest, ChatResponse, ChatResponseType
from app.services.llm import get_chat_response
from app.services.materials import search_materials, get_material_info

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process a chat message and return an AI response.
    
    The AI can:
    - Answer questions about materials
    - Provide product recommendations
    - Help build RFQ requests
    - Provide technical specifications
    """
    try:
        # Get the latest user message
        user_message = request.messages[-1].content if request.messages else ""
        
        # Check for material-related queries
        material_info = search_materials(user_message)
        
        # Get AI response
        response = await get_chat_response(
            messages=request.messages,
            context=request.context,
            material_context=material_info
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/materials/{material_id}")
async def get_material(material_id: str):
    """Get detailed information about a specific material."""
    material = get_material_info(material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material


@router.get("/search")
async def search(q: str):
    """Search for materials by name or keyword."""
    results = search_materials(q)
    return {"results": results, "count": len(results)}

