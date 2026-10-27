
package com.careerai.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careerai.dto.ResumeScoreResponse;
import com.careerai.entity.Resume;
import com.careerai.repository.ResumeRepository;

@Service
public class ResumeScoreService {

    private final ResumeRepository resumeRepository;

    public ResumeScoreService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    @Transactional(readOnly = true)
    public ResumeScoreResponse calculateScore(
            Long resumeId,
            String email) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Resume not found"));

        if (resume.getUser() == null
                || resume.getUser().getEmail() == null
                || !resume.getUser().getEmail()
                        .equalsIgnoreCase(email)) {

            throw new AccessDeniedException(
                    "You are not allowed to score this resume");
        }

        String text = resume.getExtractedText();

        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException(
                    "No extracted text found for this resume");
        }

        String normalized = text.toLowerCase(Locale.ROOT);
        List<String> recommendations = new ArrayList<>();

        int contact = scoreContact(normalized, recommendations);
        int skills = scoreSkills(normalized, recommendations);
        int experience = scoreExperience(normalized, recommendations);
        int projects = scoreProjects(normalized, recommendations);
        int education = scoreEducation(normalized, recommendations);

        int overall = Math.round(
                contact * 0.15f
                + skills * 0.25f
                + experience * 0.20f
                + projects * 0.25f
                + education * 0.15f
        );

        return new ResumeScoreResponse(
                resume.getId(),
                overall,
                contact,
                skills,
                experience,
                projects,
                education,
                recommendations
        );
    }

    private int scoreContact(
            String text,
            List<String> recommendations) {

        int score = 0;

        if (Pattern.compile(
                "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b",
                Pattern.CASE_INSENSITIVE)
                .matcher(text).find()) {
            score += 50;
        } else {
            recommendations.add(
                    "Add a professional email address to your resume.");
        }

        if (Pattern.compile("(\\+?\\d[\\d\\s().-]{7,}\\d)")
                .matcher(text).find()) {
            score += 50;
        } else {
            recommendations.add(
                    "Include a contact phone number.");
        }

        return score;
    }

    private int scoreSkills(
            String text,
            List<String> recommendations) {

        List<String> skills = List.of(
                "java", "spring boot", "spring security",
                "sql", "postgresql", "mysql", "react",
                "javascript", "python", "git", "github",
                "rest api", "docker", "kubernetes",
                "aws", "hibernate", "maven"
        );

        long count = skills.stream()
                .filter(skill -> containsTerm(text, skill))
                .count();

        int score = (int) Math.min(100, count * 12);

        if (count < 5) {
            recommendations.add(
                    "Include a clearly organized technical skills section "
                    + "listing only technologies you genuinely know.");
        }

        return score;
    }

    private int scoreExperience(
            String text,
            List<String> recommendations) {

        int score = 0;

        if (containsAny(text, "experience", "developer", "engineer",
                "employment", "self-employed", "intern")) {
            score += 40;
        } else {
            recommendations.add(
                    "Make your employment or relevant experience section clear.");
        }

        if (Pattern.compile("\\b(19|20)\\d{2}\\b")
                .matcher(text).find()) {
            score += 25;
        } else {
            recommendations.add(
                    "Add dates to your experience or project entries where appropriate.");
        }

        if (containsAny(text, "achieved", "improved", "delivered",
                "developed", "implemented", "reduced",
                "increased", "built")) {
            score += 35;
        } else {
            recommendations.add(
                    "Describe your contributions and outcomes with specific evidence.");
        }

        return score;
    }

    private int scoreProjects(
            String text,
            List<String> recommendations) {

        int count = 0;

        for (String term : List.of(
                "project", "developed", "built", "implemented",
                "designed", "application", "platform")) {
            if (containsTerm(text, term)) {
                count++;
            }
        }

        int score = Math.min(100, count * 17);

        if (count < 3) {
            recommendations.add(
                    "Describe relevant projects, your contribution, "
                    + "and the technologies used.");
        }

        return score;
    }

    private int scoreEducation(
            String text,
            List<String> recommendations) {

        int score = 0;

        if (containsAny(text, "bachelor", "b.tech", "btech",
                "degree", "university", "college")) {
            score += 60;
        } else {
            recommendations.add(
                    "Add your highest relevant qualification and institution.");
        }

        if (Pattern.compile("\\b(19|20)\\d{2}\\b")
                .matcher(text).find()) {
            score += 40;
        } else {
            recommendations.add(
                    "Include your graduation year if relevant.");
        }

        return score;
    }

    private boolean containsAny(String text, String... terms) {
        for (String term : terms) {
            if (containsTerm(text, term)) {
                return true;
            }
        }
        return false;
    }

    private boolean containsTerm(String text, String term) {
        String regex = "(?<![a-z0-9])"
                + Pattern.quote(term)
                + "(?![a-z0-9])";

        return Pattern.compile(regex)
                .matcher(text)
                .find();
    }
}
