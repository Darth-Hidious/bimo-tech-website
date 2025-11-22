from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_products():
    # Placeholder for Firestore integration
    return [{"id": 1, "name": "Product A", "price": 100}, {"id": 2, "name": "Product B", "price": 200}]
