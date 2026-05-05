import random
from typing import Dict

import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field


MODEL_PATH = "financial_analyzer_models.joblib"

bundle = joblib.load(MODEL_PATH)
risk_model = bundle["risk_model"]
explanation_model = bundle["explanation_model"]
features = bundle["features"]
explanation_lookup = bundle["explanation_lookup"]

app = FastAPI(
    title="Financial Analyzer ML Service",
    description="Microservice for supervised financial risk classification and analyst-style explanations.",
    version="1.0.0",
)


class FinancialInput(BaseModel):
    revenue: float = Field(..., gt=0)
    costs: float = Field(..., ge=0)
    ebitda: float
    cash_flow: float
    debt: float = Field(..., ge=0)
    equity: float = Field(..., gt=0)


def safe_divide(numerator: float, denominator: float, multiplier: float = 1.0) -> float:
    if denominator == 0:
        return 0.0
    return numerator / denominator * multiplier


def calculate_financial_metrics(payload: FinancialInput) -> Dict[str, float]:
    metrics = {
        "revenue": payload.revenue,
        "costs": payload.costs,
        "ebitda": payload.ebitda,
        "cash_flow": payload.cash_flow,
        "debt": payload.debt,
        "equity": payload.equity,
        "ebitda_margin": safe_divide(payload.ebitda, payload.revenue, 100),
        "debt_to_equity": safe_divide(payload.debt, payload.equity),
        "cash_conversion": safe_divide(payload.cash_flow, payload.ebitda, 100),
        "cost_ratio": safe_divide(payload.costs, payload.revenue, 100),
        "cash_flow_margin": safe_divide(payload.cash_flow, payload.revenue, 100),
    }

    return {key: round(value, 4) for key, value in metrics.items()}


def get_prediction_confidence(model, input_df: pd.DataFrame, predicted_class: str) -> float:
    probabilities = model.predict_proba(input_df)[0]
    class_index = list(model.classes_).index(predicted_class)
    return round(float(probabilities[class_index]), 4)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "financial-analyzer-ml-service",
        "model_loaded": True,
    }


@app.post("/predict")
def predict(payload: FinancialInput):
    financial_metrics = calculate_financial_metrics(payload)
    input_df = pd.DataFrame([financial_metrics])[features]

    risk_level = risk_model.predict(input_df)[0]
    explanation_type = explanation_model.predict(input_df)[0]

    risk_confidence = get_prediction_confidence(risk_model, input_df, risk_level)
    explanation_confidence = get_prediction_confidence(
        explanation_model, input_df, explanation_type
    )

    explanation_options = explanation_lookup.get(explanation_type, [])
    selected_explanation = random.choice(explanation_options) if explanation_options else {
        "human_summary": "The model identified a financial pattern, but no analyst summary is available for this class.",
        "recommended_action": "Review the input metrics manually and update the explanation lookup dataset.",
    }

    return {
        "risk_level": risk_level,
        "risk_confidence": risk_confidence,
        "explanation_type": explanation_type,
        "explanation_confidence": explanation_confidence,
        "financial_metrics": financial_metrics,
        "human_summary": selected_explanation["human_summary"],
        "recommended_action": selected_explanation["recommended_action"],
    }
