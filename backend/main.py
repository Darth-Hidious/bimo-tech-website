from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.firebase import initialize_firebase

from app.api.api import api_router

# Initialize Firebase Admin on startup
initialize_firebase()

app = FastAPI(
    title="BimoTech Backend",
    description="Backend API for BimoTech website handling products, sales, and investor data.",
    version="0.1.0",
)

# CORS Configuration
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to BimoTech Backend API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
