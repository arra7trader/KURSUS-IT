# Data Academy - Code Grading Router
# POST /api/grade/submit-code

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, Optional

from app.services.grading import (
    grade_code_submission,
    get_improvement_suggestions,
    GradingResult,
)

router = APIRouter()


# ============================================
# REQUEST/RESPONSE MODELS
# ============================================

class SubmitCodeRequest(BaseModel):
    """Request body for code submission"""
    code_snippet: str = Field(..., min_length=1, description="The code to be graded")
    challenge_id: str = Field(..., description="ID of the challenge")
    language: Literal["python", "sql"] = Field(..., description="Programming language")
    
    # Optional challenge context (can be fetched from DB in production)
    challenge_title: Optional[str] = None
    challenge_description: Optional[str] = None
    expected_behavior: Optional[str] = None
    test_cases: Optional[list[dict]] = None
    difficulty: Optional[int] = Field(default=1, ge=1, le=5)
    passing_score: Optional[int] = Field(default=70, ge=0, le=100)

    class Config:
        json_schema_extra = {
            "example": {
                "code_snippet": "def calculate_average(numbers):\n    return sum(numbers) / len(numbers)",
                "challenge_id": "ch_python_basics_001",
                "language": "python",
                "challenge_title": "Calculate Average",
                "challenge_description": "Write a function that calculates the average of a list of numbers",
                "difficulty": 2,
                "passing_score": 70
            }
        }


class SubmitCodeResponse(BaseModel):
    """Response for code submission grading"""
    score: int = Field(..., ge=0, le=100)
    feedback_text: str
    criteria: dict
    strengths: list[str]
    improvements: list[str]
    passed: bool
    suggestions: Optional[list[str]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "score": 85,
                "feedback_text": "Great job! Your code correctly calculates the average...",
                "criteria": {
                    "correctness": 38,
                    "efficiency": 22,
                    "style": 12,
                    "business_insight": 13
                },
                "strengths": ["Clean function structure", "Handles basic cases well"],
                "improvements": ["Add error handling for empty lists", "Consider edge cases"],
                "passed": True,
                "suggestions": ["Add type hints", "Include docstring"]
            }
        }


# ============================================
# ENDPOINTS
# ============================================

@router.post("/submit-code", response_model=SubmitCodeResponse)
async def submit_code(request: SubmitCodeRequest):
    """
    Submit code for AI grading.
    
    Evaluates the code based on 4 criteria:
    - **Correctness** (0-40): Does it work correctly?
    - **Efficiency** (0-25): Is it optimized?
    - **Style** (0-15): Is it readable and well-formatted?
    - **Business Insight** (0-20): Does it show understanding?
    
    Returns a score (0-100) and detailed feedback.
    """
    try:
        # Grade the submission
        grading_result: GradingResult = await grade_code_submission(
            code_snippet=request.code_snippet,
            challenge_id=request.challenge_id,
            language=request.language,
            challenge_title=request.challenge_title or "Coding Challenge",
            challenge_description=request.challenge_description or "",
            expected_behavior=request.expected_behavior or "",
            test_cases=request.test_cases,
            difficulty=request.difficulty or 1,
            passing_score=request.passing_score or 70,
        )
        
        # Get additional improvement suggestions if score is below 90
        suggestions = None
        if grading_result.score < 90:
            suggestions = await get_improvement_suggestions(
                code_snippet=request.code_snippet,
                language=request.language,
                grading_result=grading_result,
            )
        
        return SubmitCodeResponse(
            score=grading_result.score,
            feedback_text=grading_result.feedback_text,
            criteria=grading_result.criteria.model_dump(),
            strengths=grading_result.strengths,
            improvements=grading_result.improvements,
            passed=grading_result.passed,
            suggestions=suggestions,
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Grading service error: {str(e)}"
        )


@router.post("/quick-check")
async def quick_check(
    code: str,
    language: Literal["python", "sql"] = "python"
):
    """
    Quick syntax check without full grading.
    Useful for real-time feedback in the code editor.
    """
    # This would integrate with a code execution service
    # For now, return a placeholder
    return {
        "valid": True,
        "message": "Syntax check passed",
        "language": language,
    }
