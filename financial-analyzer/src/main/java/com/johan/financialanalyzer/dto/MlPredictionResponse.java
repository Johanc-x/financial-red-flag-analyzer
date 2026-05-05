package com.johan.financialanalyzer.dto;

public class MlPredictionResponse {

    private String risk_level;
    private double risk_confidence;
    private String explanation_type;
    private double explanation_confidence;
    private String human_summary;
    private String recommended_action;

    public String getRisk_level() { return risk_level; }
    public void setRisk_level(String risk_level) { this.risk_level = risk_level; }

    public double getRisk_confidence() { return risk_confidence; }
    public void setRisk_confidence(double risk_confidence) { this.risk_confidence = risk_confidence; }

    public String getExplanation_type() { return explanation_type; }
    public void setExplanation_type(String explanation_type) { this.explanation_type = explanation_type; }

    public double getExplanation_confidence() { return explanation_confidence; }
    public void setExplanation_confidence(double explanation_confidence) { this.explanation_confidence = explanation_confidence; }

    public String getHuman_summary() { return human_summary; }
    public void setHuman_summary(String human_summary) { this.human_summary = human_summary; }

    public String getRecommended_action() { return recommended_action; }
    public void setRecommended_action(String recommended_action) { this.recommended_action = recommended_action; }
}

