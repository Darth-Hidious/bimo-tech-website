"""Chat Data Models"""
from typing import Optional, List, Any
from pydantic import BaseModel
from enum import Enum


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class Message(BaseModel):
    """Chat message."""
    role: MessageRole
    content: str


class ChatContext(BaseModel):
    """Context for chat request."""
    has_items_in_basket: bool = False
    basket_count: int = 0
    current_material: Optional[str] = None


class ChatRequest(BaseModel):
    """Request to chat endpoint."""
    messages: List[Message]
    context: Optional[ChatContext] = None


class ChatResponseType(str, Enum):
    TEXT = "text"
    PRODUCT_SUGGESTION = "product_suggestion"
    RFQ_CONFIRMATION = "rfq_confirmation"
    QUOTE_REQUEST = "quote_request"


class ChatResponse(BaseModel):
    """Response from chat endpoint."""
    response: str
    type: ChatResponseType = ChatResponseType.TEXT
    data: Optional[Any] = None
    suggested_actions: List[str] = []


