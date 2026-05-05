package com.johan.financialanalyzer.dto;

import java.util.List;

public class AnalysisResponse {

    private double ebitdaMargin;
    private double debtToEquity;
    private double cashConversion;
    private int riskScore;
    private List<RedFlagResponse> redFlags;
    private String summary;
    private String mlRiskLevel;
    private double mlConfidence;
    private String mlSummary;
    private String mlRecommendation;

    public double getEbitdaMargin() { return ebitdaMargin; }
    public void setEbitdaMargin(double ebitdaMargin) { this.ebitdaMargin = ebitdaMargin; }

    public double getDebtToEquity() { return debtToEquity; }
    public void setDebtToEquity(double debtToEquity) { this.debtToEquity = debtToEquity; }

    public double getCashConversion() { return cashConversion; }
    public void setCashConversion(double cashConversion) { this.cashConversion = cashConversion; }

    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

    public List<RedFlagResponse> getRedFlags() { return redFlags; }
    public void setRedFlags(List<RedFlagResponse> redFlags) { this.redFlags = redFlags; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    
    public String getMlRiskLevel() { return mlRiskLevel; }
    public void setMlRiskLevel(String mlRiskLevel) { this.mlRiskLevel = mlRiskLevel; }

    public double getMlConfidence() { return mlConfidence; }
    public void setMlConfidence(double mlConfidence) { this.mlConfidence = mlConfidence; }

    public String getMlSummary() { return mlSummary; }
    public void setMlSummary(String mlSummary) { this.mlSummary = mlSummary; }

    public String getMlRecommendation() { return mlRecommendation; }
    public void setMlRecommendation(String mlRecommendation) { this.mlRecommendation = mlRecommendation; }
}
