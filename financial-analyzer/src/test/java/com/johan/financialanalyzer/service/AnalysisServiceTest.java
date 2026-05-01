package com.johan.financialanalyzer.service;

import com.johan.financialanalyzer.dto.AnalysisRequest;
import com.johan.financialanalyzer.dto.AnalysisResponse;
import com.johan.financialanalyzer.repository.AnalysisRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;

class AnalysisServiceTest {

    @Test
    void shouldCalculateFinancialAnalysisCorrectly() {
        AnalysisRepository repositoryMock = Mockito.mock(AnalysisRepository.class);
        AnalysisService service = new AnalysisService();

        // Inyectamos el mock manualmente porque actualmente usamos @Autowired en campo
        try {
            var field = AnalysisService.class.getDeclaredField("analysisRepository");
            field.setAccessible(true);
            field.set(service, repositoryMock);
        } catch (Exception e) {
            fail("Could not inject repository mock");
        }

        AnalysisRequest request = new AnalysisRequest();
        request.setRevenue(1200000.0);
        request.setCosts(950000.0);
        request.setEbitda(180000.0);
        request.setCashFlow(-40000.0);
        request.setDebt(600000.0);
        request.setEquity(350000.0);

        AnalysisResponse response = service.analyze(request);

        assertEquals(15.0, response.getEbitdaMargin());
        assertEquals(1.7142857142857142, response.getDebtToEquity());
        assertEquals(-22.22222222222222, response.getCashConversion());
        assertEquals(40, response.getRiskScore());
        assertEquals(2, response.getRedFlags().size());
        assertNotNull(response.getSummary());

        Mockito.verify(repositoryMock, Mockito.times(1)).save(Mockito.any());
    }
}