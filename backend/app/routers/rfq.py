"""RFQ Router - Handles Request for Quote operations."""
from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List, Optional
from app.models.rfq import RFQSubmitRequest, RFQSubmitResponse, RFQSession, RFQStatus
from app.services.firebase import save_rfq, get_rfq, update_rfq_status
from app.services.matching import match_suppliers_for_rfq
from app.services.email import send_rfq_to_suppliers, send_confirmation_to_customer

router = APIRouter()


@router.post("/submit", response_model=RFQSubmitResponse)
async def submit_rfq(request: RFQSubmitRequest):
    """
    Submit an RFQ for processing.
    
    This will:
    1. Save the RFQ to the database
    2. Match with appropriate suppliers
    3. Send anonymized RFQ emails to suppliers
    4. Send confirmation to customer
    """
    try:
        # Create RFQ session
        rfq_session = RFQSession(
            id=request.session_id,
            items=request.items,
            status=RFQStatus.SUBMITTED,
            contact_email=request.contact_email,
            design_files=request.design_files,
        )
        
        # Save to Firebase
        rfq_id = await save_rfq(rfq_session)
        
        # Match suppliers
        matches = await match_suppliers_for_rfq(rfq_session)
        
        # Send emails to matched suppliers (anonymized)
        await send_rfq_to_suppliers(rfq_session, matches)
        
        # Send confirmation to customer
        await send_confirmation_to_customer(
            email=request.contact_email,
            rfq_id=rfq_id,
            item_count=len(request.items)
        )
        
        return RFQSubmitResponse(
            success=True,
            rfq_id=rfq_id,
            message="Your RFQ has been submitted successfully. We will contact you within 24-48 hours.",
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{rfq_id}")
async def get_rfq_status(rfq_id: str):
    """Get the status and details of an RFQ."""
    rfq = await get_rfq(rfq_id)
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    return rfq


@router.post("/{rfq_id}/status")
async def update_status(rfq_id: str, status: RFQStatus):
    """Update the status of an RFQ (internal use)."""
    success = await update_rfq_status(rfq_id, status)
    if not success:
        raise HTTPException(status_code=404, detail="RFQ not found")
    return {"success": True, "status": status}


@router.post("/upload-design")
async def upload_design_file(file: UploadFile = File(...)):
    """
    Upload a design file (PDF, STEP, DXF, DWG).
    Returns a reference to use in the RFQ submission.
    """
    # Validate file type
    allowed_types = [
        "application/pdf",
        "application/step",
        "application/dxf",
        "application/dwg",
        "image/png",
        "image/jpeg",
    ]
    
    if file.content_type not in allowed_types and not file.filename.endswith(('.step', '.stp', '.dxf', '.dwg')):
        raise HTTPException(
            status_code=400, 
            detail="Invalid file type. Allowed: PDF, STEP, DXF, DWG, PNG, JPEG"
        )
    
    # TODO: Upload to Firebase Storage
    # For now, return a placeholder
    file_ref = f"designs/{file.filename}"
    
    return {
        "success": True,
        "file_ref": file_ref,
        "filename": file.filename,
    }

