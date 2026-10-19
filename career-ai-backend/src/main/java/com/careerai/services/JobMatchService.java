
package com.careerai.services;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careerai.entity.JobDescription;
import com.careerai.entity.JobMatch;
import com.careerai.entity.Resume;
import com.careerai.repository.JobDescriptionRepository;
import com.careerai.repository.JobMatchRepository;
import com.careerai.repository.ResumeRepository;

import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Service
public class JobMatchService {

    private final ResumeRepository resumeRepository;
    private final JobDescriptionRepository jobDescriptionRepository;
    private final JobMatchRepository jobMatchRepository;
    private final OllamaService ollamaService;
    private final ObjectMapper objectMapper;

    public JobMatchService(
            ResumeRepository resumeRepository,
            JobDescriptionRepository jobDescriptionRepository,
            JobMatchRepository jobMatchRepository,
            OllamaService ollamaService,
            ObjectMapper objectMapper) {

        this.resumeRepository = resumeRepository;
        this.jobDescriptionRepository = jobDescriptionRepository;
        this.jobMatchRepository = jobMatchRepository;
        this.ollamaService = ollamaService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public JobMatch matchResumeToJob(
            Long resumeId,
            Long jobDescriptionId,
            String email) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Resume not found"));

        if (!resume.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException(
                    "You are not allowed to access this resume");
        }

        JobDescription job = jobDescriptionRepository
                .findById(jobDescriptionId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Job description not found"));

        if (!job.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException(
                    "You are not allowed to access this job description");
        }

        String resumeText = resume.getExtractedText();

        if (resumeText == null || resumeText.isBlank()) {
            throw new IllegalArgumentException(
                    "No extracted text found for this resume");
        }

        List<String> requirements =
                extractRequirements(job.getDescription());

        Set<String> matched = new LinkedHashSet<>();
        Set<String> missing = new LinkedHashSet<>();

        for (String requirement : requirements) {
            if (isRequirementPresent(resumeText, requirement)) {
                matched.add(requirement);
            } else {
                missing.add(requirement);
            }
        }

        double score = requirements.isEmpty()
                ? 0.0
                : Math.round(
                        matched.size() * 10000.0 / requirements.size()
                  ) / 100.0;

        List<String> recommendations = new ArrayList<>();

        if (requirements.isEmpty()) {
            recommendations.add(
                    "No requirements could be extracted from this job description. "
                    + "Review the description and try again.");
        } else if (missing.isEmpty()) {
            recommendations.add(
                    "All extracted requirements have matching text in the resume. "
                    + "Review the resume to ensure each requirement is supported "
                    + "by meaningful evidence.");
        } else {
            recommendations.add(
                    "Review these requirements: "
                    + String.join(", ", missing)
                    + ". Include relevant evidence only where it accurately "
                    + "reflects your skills and experience.");
        }

        JobMatch match = new JobMatch();
        match.setResume(resume);
        match.setJobDescription(job);
        match.setMatchScore(score);
        match.setMatchedRequirements(String.join(", ", matched));
        match.setMissingRequirements(String.join(", ", missing));
        match.setRecommendations(String.join("\n", recommendations));

        return jobMatchRepository.save(match);
    }

    private boolean isRequirementPresent(
            String resumeText,
            String requirement) {

        String normalizedResume = normalize(resumeText);
        String normalizedRequirement = normalize(requirement);

        if (normalizedRequirement.isBlank()) {
            return false;
        }

        // First check for an exact phrase, ignoring punctuation and case.
        if (containsPhrase(normalizedResume, normalizedRequirement)) {
            return true;
        }

        // Then check explicitly defined equivalent wording.
        for (String alternative : getAlternatives(normalizedRequirement)) {
            if (containsPhrase(normalizedResume, normalize(alternative))) {
                return true;
            }
        }

        // Finally, check whether all meaningful requirement words occur
        // in the resume, even if the wording or order differs.
        List<String> words = meaningfulWords(normalizedRequirement);

        if (words.size() < 2) {
            return false;
        }

        long matchedWords = words.stream()
                .filter(word -> containsWordOrVariant(normalizedResume, word))
                .count();

        return matchedWords == words.size();
    }

    private List<String> getAlternatives(String requirement) {

        return switch (requirement) {
            case "cleaning data", "data cleaning", "clean data" ->
                    List.of("cleaning data", "data cleaning", "clean data");

            case "identifying trends", "identify trends",
                    "trend identification" ->
                    List.of("identifying trends", "identify trends",
                            "trend identification");

            case "communicating insights to business stakeholders",
                    "communicate insights to business stakeholders",
                    "stakeholder communication" ->
                    List.of("communicating insights to business stakeholders",
                            "communicate insights to business stakeholders",
                            "communication with business stakeholders");

            case "data visualisation", "data visualization" ->
                    List.of("data visualisation", "data visualization");

            case "rest api", "rest apis", "restful api", "restful apis" ->
                    List.of("rest api", "rest apis", "restful api",
                            "restful apis");

            case "power bi" ->
                    List.of("power bi", "powerbi");

            default -> List.of();
        };
    }

    private boolean containsWordOrVariant(String text, String word) {

        if (containsPhrase(text, word)) {
            return true;
        }

        // Basic singular/plural handling for common English words.
        if (word.endsWith("ies") && word.length() > 4) {
            return containsPhrase(text,
                    word.substring(0, word.length() - 3) + "y");
        }

        if (word.endsWith("s") && word.length() > 3) {
            return containsPhrase(text,
                    word.substring(0, word.length() - 1));
        }

        if (word.endsWith("ing") && word.length() > 5) {
            String base = word.substring(0, word.length() - 3);

            if (containsPhrase(text, base)) {
                return true;
            }

            return containsPhrase(text, base + "e");
        }

        return false;
    }

    private List<String> meaningfulWords(String phrase) {

        Set<String> stopWords = Set.of(
                "a", "an", "and", "or", "the", "to", "of",
                "in", "on", "for", "with", "by", "from",
                "as", "is", "are", "be", "have", "has"
        );

        return List.of(phrase.split("\\s+"))
                .stream()
                .filter(word -> !word.isBlank())
                .filter(word -> !stopWords.contains(word))
                .distinct()
                .toList();
    }

    private String normalize(String text) {
        return text.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", " ")
                .trim()
                .replaceAll("\\s+", " ");
    }

    private boolean containsPhrase(String text, String phrase) {
        String regex = "(?<![a-z0-9])"
                + Pattern.quote(phrase)
                + "(?![a-z0-9])";

        return Pattern.compile(regex).matcher(text).find();
    }

    @Transactional(readOnly = true)
    public List<JobMatch> getMatchesForResume(
            Long resumeId,
            String email) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Resume not found"));

        if (!resume.getUser().getEmail().equals(email)) {
            throw new AccessDeniedException(
                    "You are not allowed to access this resume");
        }

        return jobMatchRepository
                .findAllByResume_IdOrderByCreatedAtDesc(resumeId);
    }

    private List<String> extractRequirements(String jobDescription) {

        String prompt = """
                You are a job-description requirements extractor.

                Extract distinct, explicit requirements from the job description.
                It may describe any profession, including technology, finance,
                HR, healthcare, education, sales, marketing, and operations.

                Include skills, tools, qualifications, certifications,
                experience requirements, and relevant responsibilities.

                Return exactly one valid JSON object:
                {"requirements":["Requirement one","Requirement two"]}

                Rules:
                - Extract only requirements supported by the description.
                - Do not invent requirements.
                - Keep each requirement concise and independently matchable.
                - Avoid combining unrelated skills into one requirement.
                - Avoid duplicate requirements.
                - Return valid JSON only, without Markdown.

                JOB DESCRIPTION:
                <job>
                %s
                </job>
                """.formatted(jobDescription);

        String response = ollamaService.generateResponse(prompt);

        try {
            Map<String, List<String>> result = objectMapper.readValue(
                    response,
                    new TypeReference<Map<String, List<String>>>() {}
            );

            List<String> requirements = result.get("requirements");

            if (requirements == null) {
                throw new IllegalStateException(
                        "AI response does not contain requirements");
            }

            return requirements.stream()
                    .filter(item -> item != null && !item.isBlank())
                    .map(String::trim)
                    .filter(item -> !item.isBlank())
                    .distinct()
                    .toList();

        } catch (JacksonException ex) {
            throw new IllegalStateException(
                    "Could not parse extracted job requirements", ex);
        }
    }
}
