package com.careerai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careerai.entity.Resume;
import com.careerai.entity.User;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByUser(User user);

}
