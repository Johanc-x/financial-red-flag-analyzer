package com.johan.financialanalyzer.service;


import com.johan.financialanalyzer.repository.AnalysisRepository;
import com.johan.financialanalyzer.model.AnalysisEntity;
import java.time.LocalDateTime;
import com.johan.financialanalyzer.dto.*;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AnalysisService {
    
    @Autowired
    private AnalysisRepository analysisRepository;
    @Autowired
    private MlPredictionService mlPredictionService;
    
    public AnalysisResponse analyze(AnalysisRequest request) {

        AnalysisResponse response = new AnalysisResponse();

        
        double ebitdaMargin = safeDiv(request.getEbitda(), request.getRevenue()) * 100;
        double debtToEquity = safeDiv(request.getDebt(), request.getEquity());
        double cashConversion = safeDiv(request.getCashFlow(), request.getEbitda()) * 100;

        response.setEbitdaMargin(ebitdaMargin);
        response.setDebtToEquity(debtToEquity);
        response.setCashConversion(cashConversion);

        
        List<RedFlagResponse> flags = new ArrayList<>();

        if (request.getEbitda() > 0 && request.getCashFlow() < 0) {
            flags.add(new RedFlagResponse(
                    "Positive EBITDA but negative cash flow",
                    "The company shows accounting profits but no real cash generation.",
                    "HIGH"
            ));
        }

        if (debtToEquity > 2) {
            flags.add(new RedFlagResponse(
                    "High leverage",
                    "Debt levels are high relative to equity.",
                    debtToEquity > 4 ? "HIGH" : "MEDIUM"
            ));
        }

        if (cashConversion < 30 && request.getEbitda() > 0) {
            flags.add(new RedFlagResponse(
                    "Low cash conversion",
                    "Earnings are not converting into cash efficiently.",
                    "MEDIUM"
            ));
        }

        if (request.getCosts() > request.getRevenue()) {
            flags.add(new RedFlagResponse(
                    "Costs exceed revenue",
                    "The company is operating at a loss.",
                    "HIGH"
            ));
        }

        response.setRedFlags(flags);

        
        int score = 0;
        for (RedFlagResponse f : flags) {
            if (f.getSeverity().equals("HIGH")) score += 25;
            else if (f.getSeverity().equals("MEDIUM")) score += 15;
            else score += 5;
        }

        response.setRiskScore(Math.min(score, 100));

       
        if (flags.isEmpty()) {
            response.setSummary("No major financial inconsistencies detected.");
        } else {
            response.setSummary("Potential financial risks detected. Review recommended.");
        }

        
        AnalysisEntity entity = new AnalysisEntity();

        entity.setRevenue(request.getRevenue());
        entity.setCosts(request.getCosts());
        entity.setEbitda(request.getEbitda());
        entity.setCashFlow(request.getCashFlow());
        entity.setDebt(request.getDebt());
        entity.setEquity(request.getEquity());

        entity.setEbitdaMargin(response.getEbitdaMargin());
        entity.setDebtToEquity(response.getDebtToEquity());
        entity.setCashConversion(response.getCashConversion());

        entity.setRiskScore(response.getRiskScore());
        entity.setSummary(response.getSummary());

        entity.setCreatedAt(LocalDateTime.now());

        analysisRepository.save(entity);
        
        try {
            MlPredictionResponse ml = mlPredictionService.predict(request);

            response.setMlRiskLevel(ml.getRisk_level());
            response.setMlConfidence(ml.getRisk_confidence());
            response.setMlSummary(ml.getHuman_summary());
            response.setMlRecommendation(ml.getRecommended_action());

        } catch (Exception e) {
            System.out.println("ML service not available, using fallback logic.");
        }
        
        return response;
    }
    
    public AnalysisResponse calculateMetricsOnly(AnalysisRequest request) {
            AnalysisResponse response = new AnalysisResponse();

            double ebitdaMargin = safeDiv(request.getEbitda(), request.getRevenue()) * 100;
            double debtToEquity = safeDiv(request.getDebt(), request.getEquity());
            double cashConversion = safeDiv(request.getCashFlow(), request.getEbitda()) * 100;

            response.setEbitdaMargin(ebitdaMargin);
            response.setDebtToEquity(debtToEquity);
            response.setCashConversion(cashConversion);
            response.setRiskScore(0);
            response.setRedFlags(List.of());
            response.setSummary("Financial metrics calculated successfully.");

            return response;
}

    public List<RedFlagResponse> getRedFlagsOnly(AnalysisRequest request) {
        AnalysisResponse fullAnalysis = analyze(request);
        return fullAnalysis.getRedFlags();
    }
    
    public int getRiskScoreOnly(AnalysisRequest request) {
        AnalysisResponse full = analyze(request);
        return full.getRiskScore();
}

    private double safeDiv(double a, double b) {
        return b == 0 ? 0 : a / b;
    }
}
