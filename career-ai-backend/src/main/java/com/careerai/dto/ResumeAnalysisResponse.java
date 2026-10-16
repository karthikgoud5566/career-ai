
package com.careerai.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResumeAnalysisResponse {

    private Long id;
    private Long resumeId;
    private String summary;
    private String skills;
    private String experienceSummary;
    private String projectSummary;
    private LocalDateTime createdAt;

    public ResumeAnalysisResponse(
            Long id,
            Long resumeId,
            String summary,
            String skills,
            String experienceSummary,
            String projectSummary,
            LocalDateTime createdAt) {

        this.id = id;
        this.resumeId = resumeId;
        this.summary = summary;
        this.skills = skills;
        this.experienceSummary = experienceSummary;
        this.projectSummary = projectSummary;
        this.createdAt = createdAt;
    }
}
