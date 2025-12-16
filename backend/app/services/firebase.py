"""Firebase Service - Handles Firestore and Storage operations."""
import os
from typing import Optional, Dict, Any
from datetime import datetime

# Firebase Admin SDK (initialize when credentials are available)
_db = None
_storage = None


def initialize_firebase():
    """Initialize Firebase Admin SDK."""
    global _db, _storage
    
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore, storage
        
        # Check if already initialized
        if firebase_admin._apps:
            _db = firestore.client()
            return
        
        # Initialize with credentials
        cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred, {
                'storageBucket': os.getenv("FIREBASE_STORAGE_BUCKET")
            })
            _db = firestore.client()
            _storage = storage.bucket()
            print("Firebase initialized successfully")
        else:
            print("Firebase credentials not found - running in mock mode")
            
    except Exception as e:
        print(f"Firebase initialization error: {e}")
        print("Running in mock mode")


async def save_rfq(rfq_session) -> str:
    """Save an RFQ session to Firestore."""
    global _db
    
    if _db is None:
        # Mock mode - just return the session ID
        print(f"[MOCK] Saving RFQ: {rfq_session.id}")
        return rfq_session.id
    
    try:
        doc_ref = _db.collection('rfq_sessions').document(rfq_session.id)
        doc_ref.set({
            'id': rfq_session.id,
            'items': [item.dict() for item in rfq_session.items],
            'status': rfq_session.status.value,
            'contact_email': rfq_session.contact_email,
            'design_files': rfq_session.design_files,
            'created_at': datetime.now(),
            'updated_at': datetime.now(),
        })
        return rfq_session.id
    except Exception as e:
        print(f"Error saving RFQ: {e}")
        return rfq_session.id


async def get_rfq(rfq_id: str) -> Optional[Dict[str, Any]]:
    """Get an RFQ by ID."""
    global _db
    
    if _db is None:
        # Mock mode
        return None
    
    try:
        doc_ref = _db.collection('rfq_sessions').document(rfq_id)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        return None
    except Exception as e:
        print(f"Error getting RFQ: {e}")
        return None


async def update_rfq_status(rfq_id: str, status) -> bool:
    """Update the status of an RFQ."""
    global _db
    
    if _db is None:
        # Mock mode
        print(f"[MOCK] Updating RFQ {rfq_id} status to {status}")
        return True
    
    try:
        doc_ref = _db.collection('rfq_sessions').document(rfq_id)
        doc_ref.update({
            'status': status.value,
            'updated_at': datetime.now(),
        })
        return True
    except Exception as e:
        print(f"Error updating RFQ status: {e}")
        return False


async def get_suppliers(capabilities: list = None) -> list:
    """Get suppliers, optionally filtered by capabilities."""
    global _db
    
    if _db is None:
        # Mock mode - return sample suppliers
        return [
            {
                'id': 'sup_001',
                'name': 'Supplier A',
                'email': 'supplier-a@example.com',
                'capabilities': ['tungsten', 'molybdenum', 'rhenium'],
                'certifications': ['ISO9001', 'EN9100'],
                'avg_lead_time': 14,
                'price_tier': 'standard',
            },
            {
                'id': 'sup_002',
                'name': 'Supplier B',
                'email': 'supplier-b@example.com',
                'capabilities': ['titanium', 'nickel', 'tantalum'],
                'certifications': ['ISO9001'],
                'avg_lead_time': 21,
                'price_tier': 'budget',
            },
        ]
    
    try:
        query = _db.collection('suppliers').where('active', '==', True)
        docs = query.stream()
        suppliers = [doc.to_dict() for doc in docs]
        
        if capabilities:
            # Filter by capabilities
            suppliers = [
                s for s in suppliers 
                if any(cap in s.get('capabilities', []) for cap in capabilities)
            ]
        
        return suppliers
    except Exception as e:
        print(f"Error getting suppliers: {e}")
        return []


async def save_supplier_quote(quote_data: dict) -> str:
    """Save a supplier quote."""
    global _db
    
    if _db is None:
        print(f"[MOCK] Saving quote: {quote_data}")
        return "quote_mock_id"
    
    try:
        doc_ref = _db.collection('quotes').add(quote_data)
        return doc_ref[1].id
    except Exception as e:
        print(f"Error saving quote: {e}")
        return ""

