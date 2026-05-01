package com.johan.financialanalyzer.dto;

import jakarta.validation.constraints.NotNull;

public class AnalysisRequest {
    
    @NotNull
    private Double revenue;

    @NotNull
    private Double costs;

    @NotNull
    private Double ebitda;

    @NotNull
    private Double cashFlow;

    @NotNull
    private Double debt;

    @NotNull
    private Double equity;

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
}
