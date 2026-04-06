from pydantic import BaseModel


class ChatRequest(BaseModel):
    city_id: int
    question: str
    top_k: int = 5


class CitationResponse(BaseModel):
    document_id: int
    title: str
    page_number: int | None
    chunk_index: int


class ChatResponse(BaseModel):
    answer: str
    citations: list[CitationResponse]