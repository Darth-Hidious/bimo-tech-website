from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter()

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

@router.post("/", summary="Submit Contact Form", description="Submit a contact form entry to the CRM.")
async def submit_contact(contact: ContactForm):
    # Placeholder for database insertion (Firestore)
    # db.collection("contacts").add(contact.dict())
    
    return {"message": "Contact form submitted successfully", "id": "mock_contact_id_123"}
