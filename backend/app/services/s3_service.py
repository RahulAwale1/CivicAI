import io
import os
import uuid

import boto3

from app.core.config import settings


class S3Service:
    def __init__(self):
        self.client = boto3.client(
            "s3",
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
            region_name=settings.aws_region,
        )
        self.bucket_name = settings.s3_bucket_name

    def generate_s3_key(self, city_slug: str, original_filename: str) -> str:
        file_ext = os.path.splitext(original_filename)[1].lower()
        unique_id = uuid.uuid4().hex
        safe_city_slug = city_slug.strip().lower()

        return f"cities/{safe_city_slug}/raw/{unique_id}{file_ext}"

    def upload_fileobj(self, file_obj, s3_key: str, content_type: str | None = None) -> str:
        extra_args = {}
        if content_type:
            extra_args["ContentType"] = content_type

        self.client.upload_fileobj(
            Fileobj=file_obj,
            Bucket=self.bucket_name,
            Key=s3_key,
            ExtraArgs=extra_args if extra_args else None,
        )

        return s3_key

    def download_file_bytes(self, s3_key: str) -> bytes:
        buffer = io.BytesIO()
        self.client.download_fileobj(self.bucket_name, s3_key, buffer)
        buffer.seek(0)
        return buffer.read()
    
    def generate_presigned_url(self, s3_key: str, expires_in: int = 3600) -> str:
        return self.client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": self.bucket_name,
                "Key": s3_key,
            },
            ExpiresIn=expires_in,
    )


s3_service = S3Service()