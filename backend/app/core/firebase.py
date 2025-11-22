import firebase_admin
from firebase_admin import credentials
from app.core.config import settings
import os

def initialize_firebase():
    try:
        if not firebase_admin._apps:
            if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                firebase_admin.initialize_app(cred)
                print("Firebase Admin initialized with credentials.")
            else:
                print(f"Warning: Firebase credentials not found at {settings.FIREBASE_CREDENTIALS_PATH}. Skipping Admin SDK init.")
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
