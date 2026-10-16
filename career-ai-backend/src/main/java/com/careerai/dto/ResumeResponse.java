package com.careerai.dto;

import java.time.LocalDateTime;

public class ResumeResponse {

    private Long id;
    private String fileName;
    private String fileUrl;
    private LocalDateTime uploadedAt;

    public ResumeResponse() {
    }

    public ResumeResponse(Long id, String fileName, String fileUrl, LocalDateTime uploadedAt) {
        this.id = id;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
