
package com.careerai.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;

import jakarta.validation.Valid;

import com.careerai.dto.JobDescriptionRequest;
import com.careerai.dto.JobDescriptionResponse;
import com.careerai.entity.JobDescription;
import com.careerai.services.JobDescriptionService;

@RestController
@RequestMapping("/api/v1/job-descriptions")
public class JobDescriptionController {

    private final JobDescriptionService jobDescriptionService;

    public JobDescriptionController(
            JobDescriptionService jobDescriptionService) {
        this.jobDescriptionService = jobDescriptionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobDescriptionResponse createJobDescription(
            @Valid @RequestBody JobDescriptionRequest request,
            Authentication authentication) {

        JobDescription saved = jobDescriptionService.createJobDescription(
                authentication.getName(),
                request.getTitle(),
                request.getCompany(),
                request.getDescription()
        );

        return toResponse(saved);
    }

    @GetMapping
    public List<JobDescriptionResponse> getMyJobDescriptions(
            Authentication authentication) {

        return jobDescriptionService
                .getMyJobDescriptions(authentication.getName())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private JobDescriptionResponse toResponse(JobDescription jobDescription) {
        return new JobDescriptionResponse(
                jobDescription.getId(),
                jobDescription.getTitle(),
                jobDescription.getCompany(),
                jobDescription.getDescription(),
                jobDescription.getCreatedAt()
        );
    }
}
