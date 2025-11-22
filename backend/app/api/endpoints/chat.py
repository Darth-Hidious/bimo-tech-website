from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str
    suggested_actions: Optional[List[str]] = None

@router.post("/", response_model=ChatResponse, summary="Chat with AI Agent", description="Send a message to the AI agent and get a response. The agent has access to product and investor data.")
async def chat_endpoint(request: ChatRequest):
    # Placeholder for actual AI logic (e.g., OpenAI API call or local LLM)
    # In a real scenario, this would use the context and previous messages to generate a response.
    
    user_message = request.messages[-1].content.lower()
    
    response_text = "I am the BimoTech AI Agent. How can I assist you today?"
    suggested_actions = []

    if "investor" in user_message:
        response_text = "For investor relations, please visit our secure Data Room. I can help you navigate there if you have the correct credentials."
        suggested_actions = ["Go to Data Room", "Contact Relations"]
    elif "product" in user_message or "buy" in user_message:
        response_text = "We have several advanced material products available. Would you like to see our catalog?"
        suggested_actions = ["View Catalog", "Search Products"]
    
    return ChatResponse(
        response=response_text,
        suggested_actions=suggested_actions
    )
