
package com.careerai.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record JobApplicationResponse(
        Long id,
        String jobTitle,
        String company,
        String jobUrl,
        String status,
        LocalDate applicationDate,
        String notes,
        LocalDateTime createdAt
) {
}
