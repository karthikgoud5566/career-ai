
package com.careerai.services;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final Path uploadDirectory;

    public FileStorageService(
            @Value("${careerai.file.upload-dir}") String uploadDir) {
        this.uploadDirectory = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();
    }


public void deleteFile(String storedFileName) {
    try {
        Path filePath = uploadDirectory.resolve(storedFileName).normalize();

        if (!filePath.startsWith(uploadDirectory)) {
            throw new IllegalArgumentException("Invalid file path");
        }

        Files.deleteIfExists(filePath);

    } catch (IOException exception) {
        throw new IllegalStateException(
                "Could not clean up stored resume file", exception);
    }
}


    public String storePdf(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a PDF file");
        }
     // Reject resumes larger than 5 MB
        long maxFileSize = 5L * 1024 * 1024;

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException(
                    "Resume file must not exceed 5 MB"
            );
        }

        if (file.getOriginalFilename() == null
                || !file.getOriginalFilename()
                        .toLowerCase(java.util.Locale.ROOT)
                        .endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        Files.createDirectories(uploadDirectory);

        String storedFileName = UUID.randomUUID() + ".pdf";
        Path destination = uploadDirectory.resolve(storedFileName)
                .normalize();

        if (!destination.startsWith(uploadDirectory)) {
            throw new IllegalArgumentException("Invalid file path");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(
                    inputStream,
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );
        }

        return storedFileName;
    }
}
