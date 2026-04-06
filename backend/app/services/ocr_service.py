import io

import pytesseract
from pdf2image import convert_from_bytes

from app.core.config import settings


def extract_text_with_ocr(pdf_bytes: bytes) -> list[tuple[int, str]]:
    images = convert_from_bytes(pdf_bytes)
    page_texts: list[tuple[int, str]] = []

    for page_number, image in enumerate(images, start=1):
        text = pytesseract.image_to_string(image, lang="eng", config="--psm 6")
        page_texts.append((page_number, text or ""))

    return page_texts


def should_use_ocr(page_texts):
    combined = " ".join(text for _, text in page_texts).strip()

    # 1. Length check
    if len(combined) < settings.ocr_min_text_length:
        return True

    # 2. Alphabet ratio check
    alpha_chars = sum(c.isalpha() for c in combined)
    ratio = alpha_chars / max(len(combined), 1)

    if ratio < 0.5:
        return True

    return False