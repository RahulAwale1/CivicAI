from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "CivicAI Backend"
    environment: str = "development"
    debug: bool = True
    database_url: str

    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str
    s3_bucket_name: str

    openai_api_key: str
    openai_embedding_model: str = "text-embedding-3-small"
    embedding_dimension: int = 1536

    ocr_enabled: bool = True
    ocr_min_text_length: int = 100

    redis_url: str
    celery_broker_url: str
    celery_result_backend: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )


settings = Settings()