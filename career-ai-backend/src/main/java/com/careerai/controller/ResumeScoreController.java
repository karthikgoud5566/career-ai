
package com.careerai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careerai.dto.ResumeScoreResponse;
import com.careerai.services.ResumeScoreService;

@RestController
@RequestMapping("/api/v1/resume-scores")
public class ResumeScoreController {

    private final ResumeScoreService resumeScoreService;

    public ResumeScoreController(ResumeScoreService resumeScoreService) {
        this.resumeScoreService = resumeScoreService;
    }

    @PostMapping("/{resumeId}")
    public ResponseEntity<ResumeScoreResponse> scoreResume(
            @PathVariable Long resumeId,
            Authentication authentication) {

        ResumeScoreResponse result = resumeScoreService.calculateScore(
                resumeId,
                authentication.getName()
        );

        return ResponseEntity.ok(result);
    }
}
