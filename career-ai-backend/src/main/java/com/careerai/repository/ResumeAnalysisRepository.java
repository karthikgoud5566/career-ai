
package com.careerai.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careerai.entity.ResumeAnalysis;

public interface ResumeAnalysisRepository
        extends JpaRepository<ResumeAnalysis, Long> {

}
