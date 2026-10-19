
package com.careerai.dto;

import java.time.LocalDateTime;

public record JobMatchResponse(
        Long id,
        Long resumeId,
        Long jobDescriptionId,
        double matchScore,
        String matchedRequirements,
        String missingRequirements,
        String recommendations,
        LocalDateTime createdAt
) {
}
