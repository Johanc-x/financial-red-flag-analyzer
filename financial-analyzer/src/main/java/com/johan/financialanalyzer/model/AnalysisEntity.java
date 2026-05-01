package com.johan.financialanalyzer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_history")
public class AnalysisEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double revenue;
    private Double costs;
    private Double ebitda;
    private Double cashFlow;
    private Double debt;
    private Double equity;

    private Double ebitdaMargin;
    private Double debtToEquity;
    private Double cashConversion;

    private Integer riskScore;

    @Column(length = 1000)
    private String summary;

    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getRevenue() { return revenue; }
    public void setRevenue(Double revenue) { this.revenue = revenue; }

    public Double getCosts() { return costs; }
    public void setCosts(Double costs) { this.costs = costs; }

    public Double getEbitda() { return ebitda; }
    public void setEbitda(Double ebitda) { this.ebitda = ebitda; }

    public Double getCashFlow() { return cashFlow; }
    public void setCashFlow(Double cashFlow) { this.cashFlow = cashFlow; }

    public Double getDebt() { return debt; }
    public void setDebt(Double debt) { this.debt = debt; }

    public Double getEquity() { return equity; }
    public void setEquity(Double equity) { this.equity = equity; }

    public Double getEbitdaMargin() { return ebitdaMargin; }
    public void setEbitdaMargin(Double ebitdaMargin) { this.ebitdaMargin = ebitdaMargin; }

    public Double getDebtToEquity() { return debtToEquity; }
    public void setDebtToEquity(Double debtToEquity) { this.debtToEquity = debtToEquity; }

    public Double getCashConversion() { return cashConversion; }
    public void setCashConversion(Double cashConversion) { this.cashConversion = cashConversion; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}