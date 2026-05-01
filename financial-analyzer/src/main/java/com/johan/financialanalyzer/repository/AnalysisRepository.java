package com.johan.financialanalyzer.repository;

import com.johan.financialanalyzer.model.AnalysisEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalysisRepository extends JpaRepository<AnalysisEntity, Long> {
}
