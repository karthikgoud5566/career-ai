
package com.careerai.services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.careerai.dto.ResumeResponse;
import com.careerai.entity.Resume;
import com.careerai.entity.User;
import com.careerai.repository.ResumeRepository;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final FileStorageService fileStorageService;
    private final PdfTextExtractionService pdfTextExtractionService;

    public ResumeService(
            ResumeRepository resumeRepository,
            FileStorageService fileStorageService,
            PdfTextExtractionService pdfTextExtractionService) {
        this.resumeRepository = resumeRepository;
        this.fileStorageService = fileStorageService;
        this.pdfTextExtractionService = pdfTextExtractionService;
    }

    @Transactional
    public ResumeResponse uploadResume(MultipartFile file, User user)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a PDF file");
        }

        // Validate and extract text before storing the file.
        String extractedText = pdfTextExtractionService.extractText(file);

        // Store the PDF on the local disk.
        String storedFileName = fileStorageService.storePdf(file);

        try {
            Resume resume = new Resume();
            resume.setFileName(file.getOriginalFilename());
            resume.setFileUrl(storedFileName);
            resume.setExtractedText(extractedText);
            resume.setUploadedAt(LocalDateTime.now());
            resume.setUser(user);

            Resume savedResume = resumeRepository.save(resume);

            return new ResumeResponse(
                    savedResume.getId(),
                    savedResume.getFileName(),
                    savedResume.getFileUrl(),
                    savedResume.getUploadedAt()
            );

        } catch (RuntimeException exception) {
            // Avoid leaving an orphaned file if database persistence fails.
            fileStorageService.deleteFile(storedFileName);
            throw exception;
        }
    }

    public List<ResumeResponse> getMyResumes(User user) {
        return resumeRepository.findByUser(user)
                .stream()
                .map(resume -> new ResumeResponse(
                        resume.getId(),
                        resume.getFileName(),
                        resume.getFileUrl(),
                        resume.getUploadedAt()
                ))
                .toList();
    }
}
