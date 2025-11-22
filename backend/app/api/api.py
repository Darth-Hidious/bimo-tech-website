from fastapi import APIRouter
from app.api.endpoints import products, investors, chat, payments, contacts

api_router = APIRouter()
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(investors.router, prefix="/investors", tags=["investors"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["contacts"])
