"""
Bimo Tech RFQ Backend
FastAPI application for handling chat, RFQ processing, and supplier matching.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routers import chat, rfq
from app.services.firebase import initialize_firebase


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup."""
    # Initialize Firebase
    initialize_firebase()
    yield
    # Cleanup on shutdown
    pass


app = FastAPI(
    title="Bimo Tech RFQ API",
    description="Backend API for chat-based RFQ system and supplier matching",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://bimotech.pl",
        "https://www.bimotech.pl",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(rfq.router, prefix="/api/v1/rfq", tags=["rfq"])


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "healthy", "service": "Bimo Tech RFQ API"}


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "services": {
            "firebase": "connected",
            "llm": "available",
        }
    }

