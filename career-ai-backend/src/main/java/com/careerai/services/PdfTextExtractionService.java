
package com.careerai.services;

import java.io.IOException;
import java.io.InputStream;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PdfTextExtractionService {

    public String extractText(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("PDF file is empty");
        }

        try (InputStream inputStream = file.getInputStream();
             PDDocument document = Loader.loadPDF(
                     inputStream.readAllBytes())) {

            if (document.isEncrypted()) {
                throw new IllegalArgumentException(
                        "Encrypted PDFs are not supported");
            }

            PDFTextStripper pdfTextStripper = new PDFTextStripper();
            String extractedText = pdfTextStripper.getText(document).trim();

            if (extractedText.isBlank()) {
                throw new IllegalArgumentException(
                        "No readable text found in PDF");
            }

            return extractedText;
        }
    }
}
