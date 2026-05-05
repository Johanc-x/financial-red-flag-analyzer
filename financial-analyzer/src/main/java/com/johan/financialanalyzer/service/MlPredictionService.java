package com.johan.financialanalyzer.service;

import com.johan.financialanalyzer.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

@Service
public class MlPredictionService {

    private final String ML_URL = System.getenv().getOrDefault(
        "ML_SERVICE_URL",
        "http://localhost:8000/predict"
    );

    public MlPredictionResponse predict(AnalysisRequest request) {

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> body = new HashMap<>();
        body.put("revenue", request.getRevenue());
        body.put("costs", request.getCosts());
        body.put("ebitda", request.getEbitda());
        body.put("cash_flow", request.getCashFlow());
        body.put("debt", request.getDebt());
        body.put("equity", request.getEquity());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<MlPredictionResponse> response =
                restTemplate.postForEntity(ML_URL, entity, MlPredictionResponse.class);

        return response.getBody();
    }
}