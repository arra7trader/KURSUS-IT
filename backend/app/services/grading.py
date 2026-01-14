# Data Academy - Code Grading Service
# AI-powered code evaluation menggunakan Groq API

import os
import json
from typing import Literal, Optional
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from pydantic import BaseModel, Field


# Type definitions
CodeLanguage = Literal["python", "sql"]

# Groq Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = "llama-3.1-70b-versatile"


class GradingCriteria(BaseModel):
    """Breakdown skor per kriteria"""
    correctness: int = Field(ge=0, le=40, description="Code menghasilkan output yang benar (0-40)")
    efficiency: int = Field(ge=0, le=25, description="Code efisien dan optimal (0-25)")
    style: int = Field(ge=0, le=15, description="Code rapi dan readable (0-15)")
    business_insight: int = Field(ge=0, le=20, description="Code menunjukkan pemahaman bisnis (0-20)")


class GradingResult(BaseModel):
    """Hasil grading lengkap dari AI"""
    score: int = Field(ge=0, le=100, description="Total skor 0-100")
    criteria: GradingCriteria
    feedback_text: str = Field(description="Feedback detail untuk murid")
    strengths: list[str] = Field(default_factory=list, description="Apa yang bagus dari code ini")
    improvements: list[str] = Field(default_factory=list, description="Area yang perlu diperbaiki")
    passed: bool = Field(description="Apakah submission lulus threshold minimum")


# ============================================
# GRADING PROMPTS (BAHASA INDONESIA)
# ============================================

GRADING_SYSTEM_PROMPT = """Kamu adalah code reviewer expert untuk platform edukasi Data Analytics dan Data Science.

Tugasmu adalah mengevaluasi code submission murid berdasarkan 4 kriteria:

1. CORRECTNESS / KEBENARAN (0-40 poin):
   - Apakah code menghasilkan output yang benar?
   - Apakah edge cases ditangani?
   - Apakah logikanya masuk akal?

2. EFFICIENCY / EFISIENSI (0-25 poin):
   - Apakah code sudah optimal?
   - Ada loop atau operasi yang tidak perlu?
   - Apakah penggunaan memory reasonable?

3. STYLE / GAYA PENULISAN (0-15 poin):
   - Apakah code readable dan rapi?
   - Apakah nama variabel meaningful?
   - Ada komentar yang appropriate?
   - Apakah mengikuti konvensi (PEP8 untuk Python, SQL standards)?

4. BUSINESS INSIGHT / PEMAHAMAN BISNIS (0-20 poin):
   - Apakah code menunjukkan pemahaman terhadap masalah bisnis?
   - Apakah hasilnya meaningful dan actionable?
   - Apakah solusi ini berguna di dunia nyata?

Kamu HARUS mengembalikan JSON object dengan struktur berikut:
{
    "score": <total_skor_0_sampai_100>,
    "criteria": {
        "correctness": <0-40>,
        "efficiency": <0-25>,
        "style": <0-15>,
        "business_insight": <0-20>
    },
    "feedback_text": "<feedback detail dalam bahasa Indonesia yang friendly/santai>",
    "strengths": ["<kelebihan1>", "<kelebihan2>"],
    "improvements": ["<saran_perbaikan1>", "<saran_perbaikan2>"],
    "passed": <true kalau score >= passing_threshold>
}

Berikan feedback yang encouraging tapi jujur. Pakai bahasa Indonesia yang santai dan friendly.
Untuk pemula, fokus lebih ke correctness dan kasih resource untuk belajar lebih lanjut.
"""

CHALLENGE_CONTEXT_TEMPLATE = """
INFO CHALLENGE:
- Judul: {challenge_title}
- Deskripsi: {challenge_description}
- Bahasa: {language}
- Difficulty: {difficulty}/5
- Skor Minimum untuk Lulus: {passing_score}

EXPECTED BEHAVIOR:
{expected_behavior}

TEST CASES:
{test_cases}

CODE YANG DISUBMIT MURID:
```{language}
{student_code}
```

Tolong evaluasi submission ini berdasarkan kriteria grading di atas.
"""


# ============================================
# GRADING SERVICE
# ============================================

def get_grading_llm() -> ChatGroq:
    """Initialize Groq LLM untuk grading dengan temperature rendah biar konsisten."""
    return ChatGroq(
        model=GROQ_MODEL,
        temperature=0.2,  # Temperature rendah biar grading konsisten
        api_key=GROQ_API_KEY,
    )


async def grade_code_submission(
    code_snippet: str,
    challenge_id: str,
    language: CodeLanguage,
    challenge_title: str = "Coding Challenge",
    challenge_description: str = "",
    expected_behavior: str = "",
    test_cases: Optional[list[dict]] = None,
    difficulty: int = 1,
    passing_score: int = 70,
) -> GradingResult:
    """
    Grade code submission menggunakan AI.
    
    Args:
        code_snippet: Code yang disubmit murid
        challenge_id: ID challenge yang di-grade
        language: 'python' atau 'sql'
        challenge_title: Judul challenge
        challenge_description: Deskripsi lengkap requirement challenge
        expected_behavior: Apa yang seharusnya dilakukan solusi yang benar
        test_cases: List test cases dengan input dan expected output
        difficulty: Level kesulitan 1-5
        passing_score: Skor minimum untuk lulus (default 70)
    
    Returns:
        GradingResult dengan skor, breakdown kriteria, dan feedback
    """
    
    # Format test cases untuk prompt
    test_cases_str = "Tidak ada test cases spesifik."
    if test_cases:
        test_cases_str = json.dumps(test_cases, indent=2)
    
    # Create the prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", GRADING_SYSTEM_PROMPT),
        ("human", CHALLENGE_CONTEXT_TEMPLATE),
    ])
    
    # Create the chain dengan JSON output parser
    llm = get_grading_llm()
    parser = JsonOutputParser(pydantic_object=GradingResult)
    chain = prompt | llm | parser
    
    # Get grading result
    result = await chain.ainvoke({
        "challenge_title": challenge_title,
        "challenge_description": challenge_description,
        "language": language,
        "difficulty": difficulty,
        "passing_score": passing_score,
        "expected_behavior": expected_behavior or "Selesaikan challenge sesuai deskripsi.",
        "test_cases": test_cases_str,
        "student_code": code_snippet,
    })
    
    # Pastikan passed dihitung dengan benar
    result["passed"] = result["score"] >= passing_score
    
    return GradingResult(**result)


async def get_improvement_suggestions(
    code_snippet: str,
    language: CodeLanguage,
    grading_result: GradingResult,
) -> list[str]:
    """
    Dapetin saran perbaikan spesifik setelah grading.
    
    Args:
        code_snippet: Code murid
        language: Bahasa pemrograman
        grading_result: Hasil grading dari grade_code_submission
    
    Returns:
        List saran perbaikan yang spesifik dan actionable
    """
    
    system_prompt = """Kamu adalah mentor coding yang helpful. Berdasarkan feedback grading,
    kasih 3-5 saran perbaikan yang spesifik dan actionable.
    Sertakan code snippet kalau membantu. Fokus ke improvement yang paling impactful dulu.
    Pakai bahasa Indonesia yang santai dan friendly."""
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", """
CODE MURID ({language}):
```{language}
{code}
```

FEEDBACK GRADING:
Skor: {score}/100
Feedback: {feedback}
Area yang perlu diperbaiki: {improvements}

Kasih saran spesifik untuk improve code ini.
"""),
    ])
    
    llm = ChatGroq(model=GROQ_MODEL, temperature=0.5, api_key=GROQ_API_KEY)
    chain = prompt | llm | StrOutputParser()
    
    response = await chain.ainvoke({
        "language": language,
        "code": code_snippet,
        "score": grading_result.score,
        "feedback": grading_result.feedback_text,
        "improvements": ", ".join(grading_result.improvements),
    })
    
    # Parse response jadi list suggestions
    suggestions = response.split("\n")
    suggestions = [s.strip() for s in suggestions if s.strip() and not s.strip().startswith("#")]
    
    return suggestions[:5]  # Return top 5 suggestions
