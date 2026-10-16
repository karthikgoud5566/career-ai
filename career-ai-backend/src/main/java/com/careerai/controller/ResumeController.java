
package com.careerai.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careerai.dto.ResumeRequest;
import com.careerai.dto.ResumeResponse;
import com.careerai.entity.User;
import com.careerai.repository.UserRepository;
import com.careerai.services.ResumeService;


import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/v1/resumes")
public class ResumeController {

    private final ResumeService resumeService;
    private final UserRepository userRepository;

    public ResumeController(
            ResumeService resumeService,
            UserRepository userRepository) {
        this.resumeService = resumeService;
        this.userRepository = userRepository;
    }



@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<ResumeResponse> uploadResume(
        @RequestParam("file") MultipartFile file,
        Authentication authentication) throws IOException {

    User user = getAuthenticatedUser(authentication);

    ResumeResponse response = resumeService.uploadResume(file, user);

    return ResponseEntity.ok(response);
}


    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getMyResumes(
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                resumeService.getMyResumes(user)
        );
    }

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new org.springframework.security.core.userdetails
                                .UsernameNotFoundException("User not found"));
    }
}
