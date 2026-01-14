# Data Academy - AI Tutor Router
# Endpoints for interacting with AI tutors (Rendy & Abdul)

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, Optional

from app.services.ai_tutor import (
    get_ai_response,
    get_contextual_hint,
    TutorResponse,
)

router = APIRouter()


# ============================================
# REQUEST/RESPONSE MODELS
# ============================================

class ChatRequest(BaseModel):
    """Request body for tutor chat"""
    message: str = Field(..., min_length=1, max_length=2000)
    tutor_persona: Literal["RENDY", "ABDUL"] = Field(
        default="RENDY",
        description="RENDY for Data Analyst, ABDUL for Data Scientist"
    )
    context: Optional[str] = Field(
        default=None,
        description="Current lesson or challenge context"
    )
    chat_history: Optional[list[dict]] = Field(
        default=None,
        description="Previous messages for context"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "message": "How do I join two tables in SQL?",
                "tutor_persona": "RENDY",
                "context": "Level 2: SQL Fundamentals - Working with Multiple Tables",
                "chat_history": [
                    {"role": "user", "content": "What is a primary key?"},
                    {"role": "assistant", "content": "A primary key is..."}
                ]
            }
        }


class ChatResponse(BaseModel):
    """Response from tutor chat"""
    persona: str
    message: str
    suggestions: Optional[list[str]] = None


class HintRequest(BaseModel):
    """Request body for getting hints"""
    challenge_description: str = Field(..., description="The challenge description")
    user_code: str = Field(default="", description="Student's current code attempt")
    tutor_persona: Literal["RENDY", "ABDUL"] = Field(default="RENDY")
    hint_level: Literal[1, 2, 3] = Field(
        default=1,
        description="1=subtle, 2=moderate, 3=detailed"
    )


class HintResponse(BaseModel):
    """Response with hint"""
    hint: str
    hint_level: int
    persona: str


# ============================================
# ENDPOINTS
# ============================================

@router.post("/chat", response_model=ChatResponse)
async def chat_with_tutor(request: ChatRequest):
    """
    Chat with an AI tutor.
    
    - **RENDY**: Data Analyst tutor - practical, SQL/Excel focused
    - **ABDUL**: Data Scientist tutor - ML/Python focused, more theoretical
    """
    try:
        response: TutorResponse = await get_ai_response(
            user_message=request.message,
            context=request.context,
            tutor_persona=request.tutor_persona,
            chat_history=request.chat_history,
        )
        
        return ChatResponse(
            persona=response.persona,
            message=response.message,
            suggestions=response.suggestions,
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Tutor service error: {str(e)}"
        )


@router.post("/hint", response_model=HintResponse)
async def get_hint(request: HintRequest):
    """
    Get a hint for the current challenge.
    
    Hint levels:
    - **Level 1**: Subtle nudge in the right direction
    - **Level 2**: Explains the concept with a small example
    - **Level 3**: Detailed walkthrough (but doesn't give the answer)
    """
    try:
        hint = await get_contextual_hint(
            challenge_description=request.challenge_description,
            user_code=request.user_code,
            tutor_persona=request.tutor_persona,
            hint_level=request.hint_level,
        )
        
        return HintResponse(
            hint=hint,
            hint_level=request.hint_level,
            persona=request.tutor_persona,
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Hint service error: {str(e)}"
        )


@router.get("/personas")
async def get_personas():
    """
    Get information about available AI tutors.
    """
    return {
        "personas": [
            {
                "id": "RENDY",
                "name": "Rendy",
                "role": "Data Analyst Tutor",
                "specialties": ["SQL", "Excel", "Tableau", "Business Intelligence"],
                "teaching_style": "Practical, business-focused, encouraging",
                "avatar": "/avatars/rendy.png",
            },
            {
                "id": "ABDUL", 
                "name": "Abdul",
                "role": "Data Scientist Tutor",
                "specialties": ["Python", "Machine Learning", "Statistics", "Deep Learning"],
                "teaching_style": "Rigorous, research-oriented, challenging",
                "avatar": "/avatars/abdul.png",
            }
        ]
    }
