
package com.careerai.services;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careerai.dto.JobApplicationRequest;
import com.careerai.dto.JobApplicationResponse;
import com.careerai.entity.JobApplication;
import com.careerai.entity.User;
import com.careerai.repository.JobApplicationRepository;

import com.careerai.exception.ResourceNotFoundException;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;

    public JobApplicationService(JobApplicationRepository jobApplicationRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getMyApplications(User user) {
        return jobApplicationRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public JobApplicationResponse createApplication(
            JobApplicationRequest request, User user) {

        JobApplication application = new JobApplication();
        application.setUser(user);
        applyRequest(application, request);

        return toResponse(jobApplicationRepository.save(application));
    }

    @Transactional
    public JobApplicationResponse updateApplication(
            Long id, JobApplicationRequest request, User user) {

        JobApplication application = getOwnedApplication(id, user);
        applyRequest(application, request);

        return toResponse(jobApplicationRepository.save(application));
    }

    @Transactional
    public void deleteApplication(Long id, User user) {
        JobApplication application = getOwnedApplication(id, user);
        jobApplicationRepository.delete(application);
    }

    private JobApplication getOwnedApplication(Long id, User user) {
        JobApplication application = jobApplicationRepository.findById(id)
        		.orElseThrow(() ->
                new ResourceNotFoundException("Job application not found"));

        if (!application.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException(
                    "You cannot access another user's job application");
        }

        return application;
    }

    private void applyRequest(
            JobApplication application, JobApplicationRequest request) {

        if (request.jobTitle() == null || request.jobTitle().isBlank()) {
            throw new IllegalArgumentException("Job title is required");
        }

        if (request.company() == null || request.company().isBlank()) {
            throw new IllegalArgumentException("Company is required");
        }

        application.setJobTitle(request.jobTitle().trim());
        application.setCompany(request.company().trim());
        application.setJobUrl(request.jobUrl());
        application.setApplicationDate(request.applicationDate());
        application.setNotes(request.notes());

        String status = request.status();

        if (status == null || status.isBlank()) {
            status = application.getStatus() == null
                    ? "APPLIED" : application.getStatus();
        }

        status = status.trim().toUpperCase();

        List<String> allowedStatuses = List.of(
                "APPLIED", "ASSESSMENT", "INTERVIEW",
                "OFFER", "REJECTED", "WITHDRAWN");

        if (!allowedStatuses.contains(status)) {
            throw new IllegalArgumentException(
                    "Invalid status. Allowed: " + allowedStatuses);
        }

        application.setStatus(status);
    }

    private JobApplicationResponse toResponse(JobApplication application) {
        return new JobApplicationResponse(
                application.getId(),
                application.getJobTitle(),
                application.getCompany(),
                application.getJobUrl(),
                application.getStatus(),
                application.getApplicationDate(),
                application.getNotes(),
                application.getCreatedAt());
    }
}
