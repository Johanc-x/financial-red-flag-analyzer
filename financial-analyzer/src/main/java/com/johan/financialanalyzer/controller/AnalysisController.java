package com.johan.financialanalyzer.controller;

import com.johan.financialanalyzer.dto.AnalysisRequest;
import com.johan.financialanalyzer.dto.AnalysisResponse;
import com.johan.financialanalyzer.service.AnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.johan.financialanalyzer.dto.RedFlagResponse;
import jakarta.validation.Valid;
import com.johan.financialanalyzer.repository.AnalysisRepository;
import com.johan.financialanalyzer.model.AnalysisEntity;
        
        
@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    @Autowired
    private AnalysisService analysisService;
    
    @Autowired
    private AnalysisRepository analysisRepository;
    
    @PostMapping
    public AnalysisResponse analyze(@Valid @RequestBody AnalysisRequest request){
        return analysisService.analyze(request);
    }
    
    @PostMapping("/metrics")
    public AnalysisResponse getMetrics(@RequestBody AnalysisRequest request) {
        return analysisService.calculateMetricsOnly(request);
    }
    
    @PostMapping("/red-flags")
    public List<RedFlagResponse> getRedFlags(@RequestBody AnalysisRequest request) {
        return analysisService.getRedFlagsOnly(request);
    }      
    
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
    
    @PostMapping("/score")
    public int getRiskScore(@RequestBody AnalysisRequest request) {
    return analysisService.getRiskScoreOnly(request);
    }
    
    @GetMapping("/history")
    public List<AnalysisEntity> getHistory() {
        return analysisRepository.findAll();
    }
}
