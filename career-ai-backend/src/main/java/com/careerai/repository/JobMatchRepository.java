
package com.careerai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careerai.entity.JobMatch;

public interface JobMatchRepository
        extends JpaRepository<JobMatch, Long> {

    List<JobMatch> findAllByResume_IdOrderByCreatedAtDesc(Long resumeId);
}
