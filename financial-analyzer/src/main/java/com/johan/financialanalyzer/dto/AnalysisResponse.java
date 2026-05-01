package com.johan.financialanalyzer.dto;

import java.util.List;

public class AnalysisResponse {

    private double ebitdaMargin;
    private double debtToEquity;
    private double cashConversion;
    private int riskScore;
    private List<RedFlagResponse> redFlags;
    private String summary;

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
}
