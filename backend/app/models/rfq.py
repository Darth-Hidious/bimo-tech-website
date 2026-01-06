"""RFQ Data Models"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from enum import Enum


class RFQStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    QUOTED = "quoted"
    ORDERED = "ordered"
    CANCELLED = "cancelled"


class RFQItem(BaseModel):
    """Single item in an RFQ."""
    id: str
    material: str
    form: Optional[str] = None
    specification: Optional[str] = None
    quantity: str
    notes: Optional[str] = None
    added_at: datetime = datetime.now()


class RFQSession(BaseModel):
    """Complete RFQ session."""
    id: str
    items: List[RFQItem]
    status: RFQStatus = RFQStatus.DRAFT
    contact_email: Optional[EmailStr] = None
    design_files: List[str] = []
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()


class RFQSubmitRequest(BaseModel):
    """Request to submit an RFQ."""
    session_id: str
    items: List[RFQItem]
    contact_email: EmailStr
    design_files: List[str] = []


class RFQSubmitResponse(BaseModel):
    """Response after submitting an RFQ."""
    success: bool
    rfq_id: str
    message: str
    estimated_response_time: str = "24-48 hours"


class SupplierMatch(BaseModel):
    """Matched supplier for an RFQ item."""
    supplier_id: str
    capability_score: float
    estimated_lead_time: Optional[int] = None  # days
    price_tier: Optional[str] = None


