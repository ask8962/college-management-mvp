package com.collegeos.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiSummaryService {

    @Value("${google.ai.api-key}")
    private String apiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

    private static final String PROMPT_TEMPLATE = """
            You are an assistant for Indian college students.
            Summarize the following college notice in 3–5 bullet points.
            Focus on:
            - Important dates
            - Required actions
            - Eligibility or target students
            Use simple and clear language.

            NOTICE TEXT:
            %s
            """;

    private static final String CHAT_PROMPT_TEMPLATE = """
            You are a helpful AI assistant for Indian college students in a group chat.
            Your name is "College AI".
            Be friendly, helpful, and concise.
            Answer in a chat-style format (short paragraphs, use emojis occasionally).
            If asked about college-related topics, provide helpful information.

            User's question: %s
            """;

    public String extractTextFromPdf(MultipartFile file) {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (IOException e) {
            throw new RuntimeException("Failed to extract text from PDF", e);
        }
    }

    public String generateSummary(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "No text content available for summarization.";
        }

        // Truncate text if too long (Gemini has token limits)
        String truncatedText = text.length() > 10000 ? text.substring(0, 10000) : text;
        String prompt = String.format(PROMPT_TEMPLATE, truncatedText);

        return callGeminiApi(prompt);
    }

    public String generateChatResponse(String userMessage) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return "Hey! 👋 How can I help you today?";
        }

        String prompt = String.format(CHAT_PROMPT_TEMPLATE, userMessage);
        return callGeminiApi(prompt);
    }

    private String callGeminiApi(String prompt) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> content = new HashMap<>();
        Map<String, Object> parts = new HashMap<>();
        parts.put("text", prompt);
        content.put("parts", List.of(parts));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            String url = GEMINI_API_URL + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            if (response.getBody() != null) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> contentResponse = (Map<String, Object>) candidate.get("content");
                    List<Map<String, Object>> partsList = (List<Map<String, Object>>) contentResponse.get("parts");
                    if (partsList != null && !partsList.isEmpty()) {
                        return (String) partsList.get(0).get("text");
                    }
                }
            }
            return "I couldn't process that. Try asking differently! 🤔";
        } catch (Exception e) {
            return "AI is taking a quick break. Try again later! ⏳";
        }
    }
}
