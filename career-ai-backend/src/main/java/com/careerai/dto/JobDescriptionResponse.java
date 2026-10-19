
package com.careerai.dto;

import java.time.LocalDateTime;

public record JobDescriptionResponse(
        Long id,
        String title,
        String company,
        String description,
        LocalDateTime createdAt
) {
}
