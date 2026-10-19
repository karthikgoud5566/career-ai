
package com.careerai.services;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careerai.entity.JobDescription;
import com.careerai.entity.User;
import com.careerai.repository.JobDescriptionRepository;
import com.careerai.repository.UserRepository;

@Service
public class JobDescriptionService {

    private final JobDescriptionRepository jobDescriptionRepository;
    private final UserRepository userRepository;

    public JobDescriptionService(
            JobDescriptionRepository jobDescriptionRepository,
            UserRepository userRepository) {
        this.jobDescriptionRepository = jobDescriptionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public JobDescription createJobDescription(
            String email,
            String title,
            String company,
            String description) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        JobDescription jobDescription = new JobDescription();
        jobDescription.setUser(user);
        jobDescription.setTitle(title);
        jobDescription.setCompany(company);
        jobDescription.setDescription(description);

        return jobDescriptionRepository.save(jobDescription);
    }

    @Transactional(readOnly = true)
    public List<JobDescription> getMyJobDescriptions(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return jobDescriptionRepository
                .findAllByUser_IdOrderByCreatedAtDesc(user.getId());
    }
}
