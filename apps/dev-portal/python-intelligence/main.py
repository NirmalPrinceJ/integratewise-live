"""
Glowing Pancake - Python Intelligence Service
FastAPI backend for AI agent intelligence
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Glowing Pancake Intelligence API",
    description="ML/AI backend for approval-based agents",
    version="1.0.0"
)

# CORS - restrict to Glowing Pancake domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://glowingpancake.ai",
        "https://glowing-pancake.pages.dev",
        "https://n8n.glowingpancake.online"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ MODELS ============

class ChurnPredictionRequest(BaseModel):
    customer_id: str
    usage_data: Dict[str, Any]
    account_age_days: Optional[int] = None
    support_tickets: Optional[int] = 0
    feature_adoption_score: Optional[float] = 0.0

class ChurnPredictionResponse(BaseModel):
    customer_id: str
    churn_probability: float
    risk_level: str  # low, medium, high, critical
    risk_factors: list[str]
    recommended_actions: list[str]
    approval_required: bool = True

class HealthScoreRequest(BaseModel):
    account_id: str
    metrics: Dict[str, Any]

class HealthScoreResponse(BaseModel):
    account_id: str
    overall_score: float  # 0-100
    component_scores: Dict[str, float]
    health_status: str  # healthy, at_risk, critical
    playbook_triggers: list[str]
    recommendations: list[str]

class DataQualityRequest(BaseModel):
    dataset_id: str
    checks: Optional[list[str]] = None  # completeness, consistency, accuracy, timeliness

class DataQualityResponse(BaseModel):
    dataset_id: str
    overall_score: float
    quality_dimensions: Dict[str, float]
    anomalies_found: int
    issues: list[Dict[str, Any]]
    recommendations: list[str]

class ArchitectureRecommendationRequest(BaseModel):
    requirements: str
    current_stack: Optional[list[str]] = None
    constraints: Optional[list[str]] = None
    scale_expectation: Optional[str] = "medium"  # small, medium, large

class ArchitectureRecommendationResponse(BaseModel):
    recommendation_id: str
    architecture_options: list[Dict[str, Any]]
    recommended_option: int
    tradeoffs: Dict[str, Any]
    implementation_steps: list[str]
    estimated_effort: str
    best_practices: list[str]


class SignalPayload(BaseModel):
    signal_id: str
    spine_id: str
    workspace_id: str
    domain_schema: str
    hydration_bucket: str
    entity_snapshot: Dict[str, Any]
    recent_context: list[Dict[str, Any]]
    recent_knowledge: list[Dict[str, Any]]


class AnalysisResult(BaseModel):
    signal_id: str
    recommended_action: str
    confidence: float
    reasoning: list[str]
    requires_approval: bool
    auto_execute: bool

# ============ ENDPOINTS ============

@app.get("/")
async def root():
    return {
        "service": "Glowing Pancake Intelligence API",
        "version": "1.0.0",
        "status": "operational",
        "agents": ["ChurnShield", "SuccessPilot", "DataSentinel", "ArchitectIQ"]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.post("/api/v1/analyze/churn", response_model=ChurnPredictionResponse)
async def analyze_churn(request: ChurnPredictionRequest):
    """
    ChurnShield Agent: Predict churn risk for a customer
    
    All predictions are approval-based - AI proposes, human approves
    """
    # Placeholder ML logic - replace with actual model
    churn_prob = min(0.95, max(0.05, 
        (100 - request.feature_adoption_score) / 100 * 0.7 +
        (request.support_tickets / 10) * 0.3
    ))
    
    risk_level = "low"
    if churn_prob > 0.8:
        risk_level = "critical"
    elif churn_prob > 0.6:
        risk_level = "high"
    elif churn_prob > 0.3:
        risk_level = "medium"
    
    return ChurnPredictionResponse(
        customer_id=request.customer_id,
        churn_probability=round(churn_prob, 2),
        risk_level=risk_level,
        risk_factors=[
            "Low feature adoption" if request.feature_adoption_score < 50 else None,
            "High support tickets" if request.support_tickets > 5 else None
        ],
        recommended_actions=[
            "Schedule executive business review",
            "Provide advanced training",
            "Offer feature consultation"
        ],
        approval_required=True
    )

@app.post("/api/v1/analyze/health", response_model=HealthScoreResponse)
async def analyze_health(request: HealthScoreRequest):
    """
    SuccessPilot Agent: Calculate customer health score
    """
    # Placeholder logic
    overall = 75.0
    
    return HealthScoreResponse(
        account_id=request.account_id,
        overall_score=overall,
        component_scores={
            "engagement": 80.0,
            "adoption": 70.0,
            "support": 75.0,
            "satisfaction": 75.0
        },
        health_status="healthy" if overall > 70 else "at_risk",
        playbook_triggers=["quarterly_review"] if overall > 70 else ["intervention"],
        recommendations=["Continue current success plays"]
    )

@app.post("/api/v1/analyze/quality", response_model=DataQualityResponse)
async def analyze_data_quality(request: DataQualityRequest):
    """
    DataSentinel Agent: Check data quality
    """
    return DataQualityResponse(
        dataset_id=request.dataset_id,
        overall_score=85.0,
        quality_dimensions={
            "completeness": 90.0,
            "consistency": 80.0,
            "accuracy": 85.0,
            "timeliness": 85.0
        },
        anomalies_found=3,
        issues=[
            {"field": "email", "issue": "5% invalid format", "severity": "medium"}
        ],
        recommendations=["Validate email format on ingestion"]
    )

@app.post("/api/v1/analyze/architecture", response_model=ArchitectureRecommendationResponse)
async def recommend_architecture(request: ArchitectureRecommendationRequest):
    """
    ArchitectIQ Agent: Recommend integration architecture
    
    Follows "Normalize Once, Render Anywhere" principle
    """
    return ArchitectureRecommendationResponse(
        recommendation_id="arch-001",
        architecture_options=[
            {
                "id": 1,
                "name": "API-Led Connectivity",
                "description": "Experience, Process, System APIs with canonical models",
                "pros": ["Reusability", "Governance", "Scalability"],
                "cons": ["Initial complexity"]
            },
            {
                "id": 2,
                "name": "Event-Driven Architecture",
                "description": "Async messaging with event backbone",
                "pros": ["Loose coupling", "Real-time"],
                "cons": ["Complexity", "Debugging"]
            }
        ],
        recommended_option=1,
        tradeoffs={
            "complexity": "medium",
            "scalability": "high",
            "maintenance": "low"
        },
        implementation_steps=[
            "1. Design canonical data models",
            "2. Create System APIs",
            "3. Build Process APIs",
            "4. Deploy Experience APIs",
            "5. Implement monitoring"
        ],
        estimated_effort="6-8 weeks",
        best_practices=[
            "Use canonical data models",
            "Implement API versioning",
            "Add comprehensive logging",
            "Follow security best practices"
        ]
    )


@app.post("/analyze", response_model=AnalysisResult)
async def analyze_signal(payload: SignalPayload):
    """
    Signal-driven intelligence endpoint consumed by Sectorizer.
    """
    confidence = 0.9 if payload.hydration_bucket == "B7" else 0.7
    domain = (payload.domain_schema or "").lower()

    if domain in {"sales", "revops"}:
        recommended_action = "update_crm"
    elif domain in {"customer_success", "support"}:
        recommended_action = "create_followup_task"
    else:
        recommended_action = "notify_user"

    # Keep analysis deterministic and explainable for governance logs.
    reasoning = [
        f"Entity reached hydration bucket {payload.hydration_bucket}",
        "Confidence derived from hydration maturity",
    ]
    if payload.recent_context:
        reasoning.append("Recent context present")
    if payload.recent_knowledge:
        reasoning.append("Recent knowledge present")

    return AnalysisResult(
        signal_id=payload.signal_id,
        recommended_action=recommended_action,
        confidence=confidence,
        reasoning=reasoning,
        requires_approval=confidence < 0.8,
        auto_execute=confidence > 0.95,
    )

# ============ WEBHOOK HANDLERS ============

@app.post("/webhook/n8n/context-update")
async def handle_context_update(payload: Dict[str, Any]):
    """Receive context updates from n8n"""
    # Update context files, trigger notifications
    return {"status": "received", "action": "pending_approval"}

@app.post("/webhook/n8n/approval-request")
async def handle_approval_request(payload: Dict[str, Any]):
    """Handle approval requests from agents"""
    # Send to human for approval
    return {"status": "approval_requested", "id": "req-001"}

# ============ MAIN ============

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
