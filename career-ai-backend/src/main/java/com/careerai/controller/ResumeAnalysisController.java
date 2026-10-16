
package com.careerai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.careerai.dto.ResumeAnalysisResponse;
import com.careerai.entity.ResumeAnalysis;
import com.careerai.services.ResumeAnalysisService;

@RestController
@RequestMapping("/api/v1/resume-analyses")
public class ResumeAnalysisController {

    private final ResumeAnalysisService analysisService;

    public ResumeAnalysisController(
            ResumeAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping("/{resumeId}")

public ResponseEntity<ResumeAnalysisResponse> analyzeResume(

            @PathVariable Long resumeId,
            Authentication authentication) {
        ResumeAnalysisResponse analysis = analysisService.analyzeResume(
                resumeId, authentication.getName());
        return ResponseEntity.ok(analysis);
    }
}
