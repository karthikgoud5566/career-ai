
package com.careerai.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

@Service
public class OpenAIService {

    private final OpenAIClient client;
    private final String model;

    public OpenAIService(
            @Value("${openai.api.key:}") String apiKey,
            @Value("${openai.model:gpt-4.1-mini}") String model) {

        this.model = model;

        if (apiKey == null || apiKey.isBlank()) {
            this.client = null;
        } else {
            this.client = OpenAIOkHttpClient.builder()
                    .apiKey(apiKey)
                    .build();
        }
    }

    public String generateResponse(String prompt) {

        if (client == null) {
            throw new IllegalStateException(
                    "OpenAI API key is not configured. "
                    + "Configure it before using OpenAI.");
        }

        ResponseCreateParams params = ResponseCreateParams.builder()
                .model(model)
                .input(prompt)
                .build();

        Response response = client.responses().create(params);

        StringBuilder output = new StringBuilder();

        response.output().stream()
                .flatMap(item -> item.message().stream())
                .flatMap(message -> message.content().stream())
                .flatMap(content -> content.outputText().stream())
                .forEach(outputText ->
                        output.append(outputText.text()));

        if (output.isEmpty()) {
            throw new IllegalStateException(
                    "OpenAI returned an empty response.");
        }

        return output.toString();
    }
}
