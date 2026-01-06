"""Supplier Data Models"""
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from enum import Enum


class PriceTier(str, Enum):
    BUDGET = "budget"
    STANDARD = "standard"
    PREMIUM = "premium"


class Supplier(BaseModel):
    """Supplier profile."""
    id: str
    name: str
    email: EmailStr
    capabilities: List[str]  # Materials they can supply
    certifications: List[str] = []
    avg_lead_time: Optional[int] = None  # Average lead time in days
    price_tier: PriceTier = PriceTier.STANDARD
    reliability_score: float = 0.8  # 0-1 score
    active: bool = True
    notes: Optional[str] = None


class SupplierQuote(BaseModel):
    """Quote from a supplier."""
    supplier_id: str
    rfq_id: str
    item_id: str
    unit_price: Optional[float] = None
    currency: str = "EUR"
    lead_time_days: Optional[int] = None
    moq: Optional[str] = None
    notes: Optional[str] = None
    valid_until: Optional[str] = None


