
package com.careerai.dto;

import java.util.List;

public class ResumeScoreResponse {

    private Long resumeId;
    private int overallScore;
    private int contactScore;
    private int skillsScore;
    private int experienceScore;
    private int projectsScore;
    private int educationScore;
    private List<String> recommendations;

    public ResumeScoreResponse() {
    }

    public ResumeScoreResponse(
            Long resumeId,
            int overallScore,
            int contactScore,
            int skillsScore,
            int experienceScore,
            int projectsScore,
            int educationScore,
            List<String> recommendations) {

        this.resumeId = resumeId;
        this.overallScore = overallScore;
        this.contactScore = contactScore;
        this.skillsScore = skillsScore;
        this.experienceScore = experienceScore;
        this.projectsScore = projectsScore;
        this.educationScore = educationScore;
        this.recommendations = recommendations;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public int getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(int overallScore) {
        this.overallScore = overallScore;
    }

    public int getContactScore() {
        return contactScore;
    }

    public void setContactScore(int contactScore) {
        this.contactScore = contactScore;
    }

    public int getSkillsScore() {
        return skillsScore;
    }

    public void setSkillsScore(int skillsScore) {
        this.skillsScore = skillsScore;
    }

    public int getExperienceScore() {
        return experienceScore;
    }

    public void setExperienceScore(int experienceScore) {
        this.experienceScore = experienceScore;
    }

    public int getProjectsScore() {
        return projectsScore;
    }

    public void setProjectsScore(int projectsScore) {
        this.projectsScore = projectsScore;
    }

    public int getEducationScore() {
        return educationScore;
    }

    public void setEducationScore(int educationScore) {
        this.educationScore = educationScore;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }
}
