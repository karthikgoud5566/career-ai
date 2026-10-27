
package com.careerai.services;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careerai.dto.DashboardResponse;
import com.careerai.entity.JobApplication;
import com.careerai.entity.User;
import com.careerai.repository.JobApplicationRepository;
import com.careerai.repository.ResumeRepository;

@Service
public class DashboardService {

    private final JobApplicationRepository jobApplicationRepository;
    private final ResumeRepository resumeRepository;

    public DashboardService(
            JobApplicationRepository jobApplicationRepository,
            ResumeRepository resumeRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.resumeRepository = resumeRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(User user) {

        List<JobApplication> applications =
                jobApplicationRepository
                        .findByUserIdOrderByCreatedAtDesc(user.getId());

        Map<String, Long> applicationsByStatus = applications.stream()
                .collect(Collectors.groupingBy(
                        JobApplication::getStatus,
                        LinkedHashMap::new,
                        Collectors.counting()));

        long interviews = applications.stream()
                .filter(app -> "INTERVIEW".equals(app.getStatus()))
                .count();

        long offers = applications.stream()
                .filter(app -> "OFFER".equals(app.getStatus()))
                .count();

        long rejected = applications.stream()
                .filter(app -> "REJECTED".equals(app.getStatus()))
                .count();

        long assessments = applications.stream()
                .filter(app -> "ASSESSMENT".equals(app.getStatus()))
                .count();

        long resumesUploaded =
                resumeRepository.findByUser(user).size();

        return new DashboardResponse(
                applications.size(),
                interviews,
                offers,
                rejected,
                assessments,
                resumesUploaded,
                applicationsByStatus);
    }
}
