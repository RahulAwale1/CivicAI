from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.city import City
from app.schemas.chat import ChatRequest, ChatResponse, CitationResponse
from app.services.embedding_service import get_text_embedding
from app.services.llm_service import generate_grounded_answer

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/ask", response_model=ChatResponse, status_code=status.HTTP_200_OK)
def ask_question(payload: ChatRequest, db: Session = Depends(get_db)):
    city = (
        db.query(City)
        .filter(City.id == payload.city_id, City.is_active == True)  # noqa: E712
        .first()
    )

    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active city not found"
        )

    question = payload.question.strip()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty"
        )

    question_embedding = get_text_embedding(question)

    sql = text("""
        SELECT
            c.id,
            c.document_id,
            c.city_id,
            c.page_number,
            c.chunk_index,
            c.text,
            d.title
        FROM chunks c
        JOIN documents d ON d.id = c.document_id
        WHERE
            c.city_id = :city_id
            AND d.status = 'processed'
            AND c.embedding IS NOT NULL
        ORDER BY c.embedding <=> :question_embedding
        LIMIT :top_k
    """)

    result = db.execute(
        sql,
        {
            "city_id": payload.city_id,
            "question_embedding": str(question_embedding),
            "top_k": payload.top_k,
        }
    )

    rows = result.fetchall()

    if not rows:
        return ChatResponse(
            answer="I could not find enough information in the available by-law documents for that city.",
            citations=[]
        )

    context_blocks = []
    citations = []

    for row in rows:
        context_blocks.append(
            f"[Document: {row.title} | Page: {row.page_number} | Chunk: {row.chunk_index}]\n{row.text}"
        )

        citations.append(
            CitationResponse(
                document_id=row.document_id,
                title=row.title,
                page_number=row.page_number,
                chunk_index=row.chunk_index,
            )
        )

    answer = generate_grounded_answer(
        question=question,
        context_blocks=context_blocks
    )

    return ChatResponse(
        answer=answer,
        citations=citations
    )