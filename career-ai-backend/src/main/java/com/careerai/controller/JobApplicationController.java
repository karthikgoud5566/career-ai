
package com.careerai.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.careerai.dto.JobApplicationRequest;
import com.careerai.dto.JobApplicationResponse;
import com.careerai.entity.User;
import com.careerai.services.JobApplicationService;
import com.careerai.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/job-applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;
    private final UserRepository userRepository;

    public JobApplicationController(
            JobApplicationService jobApplicationService,
            UserRepository userRepository) {
        this.jobApplicationService = jobApplicationService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Authenticated user not found"));
    }

    @GetMapping
    public List<JobApplicationResponse> getMyApplications(
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return jobApplicationService.getMyApplications(user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplicationResponse createApplication(
    		@Valid  @RequestBody JobApplicationRequest request,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return jobApplicationService.createApplication(request, user);
    }

    @PutMapping("/{id}")
    public JobApplicationResponse updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationRequest request,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return jobApplicationService.updateApplication(id, request, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteApplication(
            @PathVariable Long id,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        jobApplicationService.deleteApplication(id, user);
    }
}
