
package com.careerai.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record JobApplicationRequest(

        @NotBlank(message = "Job title is required")
        @Size(max = 150, message = "Job title must not exceed 150 characters")
        String jobTitle,

        @NotBlank(message = "Company name is required")
        @Size(max = 150, message = "Company name must not exceed 150 characters")
        String company,

        @Size(max = 2048, message = "Job URL must not exceed 2048 characters")
        @Pattern(
                regexp = "^(https?://.*)?$",
                message = "Job URL must start with http:// or https://"
        )
        String jobUrl,

        @NotBlank(message = "Application status is required")
        @Pattern(
        	    regexp = "^(APPLIED|ASSESSMENT|INTERVIEW|OFFER|REJECTED|WITHDRAWN)$",
        	    message = "Invalid application status"
        	)
        String status,

        @NotNull(message = "Application date is required")
        LocalDate applicationDate,

        @Size(max = 2000, message = "Notes must not exceed 2000 characters")
        String notes
) {
}
