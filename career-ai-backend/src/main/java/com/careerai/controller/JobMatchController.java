
package com.careerai.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.careerai.dto.JobMatchResponse;
import com.careerai.entity.JobMatch;
import com.careerai.services.JobMatchService;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1/job-matches")
public class JobMatchController {

    private final JobMatchService jobMatchService;

    public JobMatchController(JobMatchService jobMatchService) {
        this.jobMatchService = jobMatchService;
    }

    @PostMapping("/resume/{resumeId}/job/{jobDescriptionId}")
    @ResponseStatus(HttpStatus.CREATED)
    public JobMatchResponse matchResumeToJob(
            @PathVariable Long resumeId,
            @PathVariable Long jobDescriptionId,
            Authentication authentication) {

        JobMatch match = jobMatchService.matchResumeToJob(
                resumeId,
                jobDescriptionId,
                authentication.getName()
        );

        return new JobMatchResponse(
                match.getId(),
                match.getResume().getId(),
                match.getJobDescription().getId(),
                match.getMatchScore(),
                match.getMatchedRequirements(),
                match.getMissingRequirements(),
                match.getRecommendations(),
                match.getCreatedAt()
        );
    }
    

@GetMapping("/resume/{resumeId}")
public List<JobMatchResponse> getMatchesForResume(
        @PathVariable Long resumeId,
        Authentication authentication) {

    return jobMatchService
            .getMatchesForResume(resumeId, authentication.getName())
            .stream()
            .map(match -> new JobMatchResponse(
                    match.getId(),
                    match.getResume().getId(),
                    match.getJobDescription().getId(),
                    match.getMatchScore(),
                    match.getMatchedRequirements(),
                    match.getMissingRequirements(),
                    match.getRecommendations(),
                    match.getCreatedAt()
            ))
            .toList();
}

}
