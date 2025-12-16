"""Email Service - Handles sending anonymized RFQ emails to suppliers."""
import os
from typing import List, Dict, Any
from datetime import datetime


def generate_rfq_reference() -> str:
    """Generate a unique RFQ reference number."""
    timestamp = datetime.now().strftime("%Y%m%d")
    import random
    suffix = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=4))
    return f"BT-{timestamp}-{suffix}"


async def send_rfq_to_suppliers(rfq, matches: Dict[str, List[Any]]):
    """
    Send anonymized RFQ emails to matched suppliers.
    
    The email does NOT include:
    - Customer name
    - Customer email
    - Customer company
    
    It ONLY includes:
    - RFQ reference number
    - Material specifications
    - Quantities
    - Required certifications
    """
    sendgrid_key = os.getenv("SENDGRID_API_KEY")
    
    # Group items by supplier
    supplier_items = {}
    for item in rfq.items:
        item_matches = matches.get(item.id, [])
        for match in item_matches:
            if match.supplier_id not in supplier_items:
                supplier_items[match.supplier_id] = []
            supplier_items[match.supplier_id].append(item)
    
    rfq_ref = generate_rfq_reference()
    
    for supplier_id, items in supplier_items.items():
        email_content = _build_supplier_email(rfq_ref, items)
        
        if sendgrid_key:
            await _send_via_sendgrid(supplier_id, email_content, rfq_ref)
        else:
            # Log in development mode
            print(f"[EMAIL] To: Supplier {supplier_id}")
            print(f"[EMAIL] Subject: RFQ {rfq_ref}")
            print(f"[EMAIL] Content:\n{email_content}")
            print("-" * 50)


def _build_supplier_email(rfq_ref: str, items: List[Any]) -> str:
    """Build the email content for a supplier."""
    lines = [
        f"Request for Quote: {rfq_ref}",
        "",
        "You have received a new quote request through Bimo Tech.",
        "",
        "ITEMS REQUESTED:",
        "-" * 40,
    ]
    
    for i, item in enumerate(items, 1):
        lines.extend([
            f"{i}. {item.material}",
            f"   Form: {item.form or 'To be specified'}",
            f"   Specification: {item.specification or 'To be specified'}",
            f"   Quantity: {item.quantity}",
            f"   Notes: {item.notes or 'None'}",
            "",
        ])
    
    lines.extend([
        "-" * 40,
        "",
        "Please reply with:",
        "• Unit price (EUR)",
        "• Lead time (days)",
        "• Minimum order quantity",
        "• Validity period",
        "",
        f"Reference this RFQ number in your response: {rfq_ref}",
        "",
        "Reply to: quotes@bimotech.pl",
        "",
        "---",
        "This is an automated message from Bimo Tech Sp. z o.o.",
    ])
    
    return "\n".join(lines)


async def _send_via_sendgrid(supplier_id: str, content: str, rfq_ref: str):
    """Send email using SendGrid."""
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail
        
        # In production, look up supplier email from database
        # For now, log the attempt
        print(f"[SENDGRID] Would send to supplier {supplier_id}: {rfq_ref}")
        
        # sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        # message = Mail(
        #     from_email='quotes@bimotech.pl',
        #     to_emails=supplier_email,
        #     subject=f'RFQ {rfq_ref} - Quote Request',
        #     plain_text_content=content
        # )
        # response = sg.send(message)
        
    except Exception as e:
        print(f"SendGrid error: {e}")


async def send_confirmation_to_customer(email: str, rfq_id: str, item_count: int):
    """Send confirmation email to customer after RFQ submission."""
    sendgrid_key = os.getenv("SENDGRID_API_KEY")
    
    content = f"""
Thank you for your quote request.

Reference Number: {rfq_id.upper()}
Items: {item_count}

What happens next:
1. Our team reviews your request
2. We contact our supplier network
3. You receive a consolidated quote within 24-48 hours

If you have questions, reply to this email or contact us at info@bimotech.pl.

---
Bimo Tech Sp. z o.o.
ul. Pawińskiego 5B
02-106 Warsaw, Poland
"""
    
    if sendgrid_key:
        try:
            from sendgrid import SendGridAPIClient
            from sendgrid.helpers.mail import Mail
            
            sg = SendGridAPIClient(sendgrid_key)
            message = Mail(
                from_email='quotes@bimotech.pl',
                to_emails=email,
                subject=f'Quote Request Received - {rfq_id.upper()}',
                plain_text_content=content
            )
            response = sg.send(message)
            print(f"Confirmation sent to {email}: {response.status_code}")
            
        except Exception as e:
            print(f"SendGrid error: {e}")
    else:
        print(f"[EMAIL] Confirmation to: {email}")
        print(f"[EMAIL] Content:\n{content}")

