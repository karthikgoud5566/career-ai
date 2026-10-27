
package com.careerai.dto;

import java.util.Map;

public record DashboardResponse(
        long totalApplications,
        long interviews,
        long offers,
        long rejected,
        long assessments,
        long resumesUploaded,
        Map<String, Long> applicationsByStatus
) {
}
