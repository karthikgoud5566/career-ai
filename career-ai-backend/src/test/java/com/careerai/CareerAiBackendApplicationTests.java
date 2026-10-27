
package com.careerai;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.careerai.dto.JobApplicationRequest;
import com.careerai.dto.JobApplicationResponse;
import com.careerai.entity.JobApplication;
import com.careerai.entity.User;
import com.careerai.repository.JobApplicationRepository;
import com.careerai.services.JobApplicationService;

@ExtendWith(MockitoExtension.class)
class CareerAiBackendApplicationTests {

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @InjectMocks
    private JobApplicationService jobApplicationService;

    @Test
    void createApplicationShouldSaveAndReturnApplication() {
        User user = new User();
        user.setId(1L);

        JobApplicationRequest request = new JobApplicationRequest(
                "Backend Developer",
                "Test Company",
                "https://example.com/job",
                "APPLIED",
                LocalDate.of(2026, 10, 19),
                "Unit test"
        );

        when(jobApplicationRepository.save(any(JobApplication.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

        JobApplicationResponse response =
                jobApplicationService.createApplication(request, user);

        assertNotNull(response);
        assertEquals("Backend Developer", response.jobTitle());
        assertEquals("Test Company", response.company());
        assertEquals("APPLIED", response.status());

        verify(jobApplicationRepository).save(any(JobApplication.class));
    }
}
