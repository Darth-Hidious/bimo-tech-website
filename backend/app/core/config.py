from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    FIREBASE_CREDENTIALS_PATH: str = "service-account-key.json"
    PROJECT_NAME: str = "BimoTech Backend"

    class Config:
        env_file = ".env"

settings = Settings()
