
package com.careerai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careerai.entity.JobDescription;

public interface JobDescriptionRepository
        extends JpaRepository<JobDescription, Long> {

    List<JobDescription> findAllByUser_IdOrderByCreatedAtDesc(Long userId);
}
