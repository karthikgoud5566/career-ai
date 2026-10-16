
package com.careerai.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careerai.entity.Resume;
import com.careerai.entity.ResumeAnalysis;
import com.careerai.repository.ResumeAnalysisRepository;
import com.careerai.repository.ResumeRepository;
import com.careerai.dto.ResumeAnalysisResponse;

@Service
public class ResumeAnalysisService {

    private final ResumeRepository resumeRepository;
    private final ResumeAnalysisRepository analysisRepository;

    public ResumeAnalysisService(
            ResumeRepository resumeRepository,
            ResumeAnalysisRepository analysisRepository) {
        this.resumeRepository = resumeRepository;
        this.analysisRepository = analysisRepository;
    }

    @Transactional

public ResumeAnalysisResponse analyzeResume(Long resumeId, String email) {


        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Resume not found"));

        if (!resume.getUser().getEmail().equals(email)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to analyze this resume");
        }

        String text = resume.getExtractedText();

        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException(
                    "No extracted text found for this resume");
        }

        String normalizedText = text.toLowerCase(Locale.ROOT);

        List<String> knownSkills = List.of(
                "java", "spring boot", "spring security",
                "hibernate", "sql", "postgresql", "mysql",
                "react", "javascript", "python", "docker",
                "kubernetes", "aws", "git", "rest api"
        );

        List<String> foundSkills = knownSkills.stream()
                .filter(normalizedText::contains)
                .toList();

        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setResume(resume);
        analysis.setSummary(
                "Resume text contains approximately "
                + text.trim().split("\\s+").length
                + " words. This is a preliminary rule-based analysis.");
        analysis.setSkills(String.join(", ", foundSkills));
        analysis.setExperienceSummary(
                "Experience keywords require further analysis.");
        analysis.setProjectSummary(
                "Project details require further analysis.");
        analysis.setCreatedAt(LocalDateTime.now());


ResumeAnalysis savedAnalysis = analysisRepository.save(analysis);

return new ResumeAnalysisResponse(
        savedAnalysis.getId(),
        savedAnalysis.getResume().getId(),
        savedAnalysis.getSummary(),
        savedAnalysis.getSkills(),
        savedAnalysis.getExperienceSummary(),
        savedAnalysis.getProjectSummary(),
        savedAnalysis.getCreatedAt()
);

    }
}
