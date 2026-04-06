from openai import OpenAI

from app.core.config import settings

client = OpenAI(api_key=settings.openai_api_key)


def generate_grounded_answer(question: str, context_blocks: list[str]) -> str:
    context_text = "\n\n".join(context_blocks)

    system_prompt = (
        "You are CivicAI, a municipal by-law assistant. "
        "Answer the user's question using only the provided context. "
        "If the answer is not clearly supported by the context, say that you could not find enough information "
        "in the provided by-law documents. Do not make up laws, penalties, or requirements. "
        "Be clear, concise, and practical."
    )

    user_prompt = f"""
Question:
{question}

Context:
{context_text}

Instructions:
- Use only the context above.
- If the answer is not supported, say so clearly.
- Do not cite anything not present in the context.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content.strip()