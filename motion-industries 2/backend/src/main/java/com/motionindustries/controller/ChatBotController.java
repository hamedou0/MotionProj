package com.motionindustries.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatBotController {

    @Value("${grok.model}")
    private String grokModel;
    @Value("${groq.api.key}")
    private String groqApiKey;
    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/message")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> body) {
        String message = (String) body.getOrDefault("message", "");

        try{
            //Attempt real LLM call 
            String reply = callGroq(message);
            return ResponseEntity.ok(Map.of("reply", reply));
        } catch (Exception e) {
           // Groq is down, ley is wrong, or rate limtied - fall back to simple rule-based replies
           String reply = generateReply(message.toLowerCase());
           return ResponseEntity.ok(Map.of("reply", reply));
        }
    }

    private String callGroq(String userMassage){
        // build the message list - system prompt set the assistant's role
        Map<String, String> systemMsg = Map.of(
            "role", "system",
            "content" , "You are a helpful assistant for Motion Industries, " +
                   "an industrial parts supplier. Answer questions about " +
                   "products, pricing, stock availability, and exports. " +
                   "Be concise — 2 to 3 sentences max."
        );

        Map<String, String> userMsg = Map.of(
            "role", "user",
            "content", userMassage
        );

        //Build the request body
        Map<String, Object> requestBody = new java.util.HashMap<>();
        requestBody.put("model", grokModel);
        requestBody.put("messages", List.of(systemMsg, userMsg));
        requestBody.put("max_tokens", 300);

        // Groq uses Bearer token auth 
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + groqApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
            "https://api.groq.com/openai/v1/chat/completions",
             request,
              Map.class);

              List<Map<String, Object>> choices = 
              (List<Map<String,Object>>)
              response.getBody().get("choices");  
              Map<String, Object> messageObj = 
              (Map<String, Object>) choices.get(0).get("message");
              return (String) messageObj.get("content");
              }

    private String generateReply(String message) {
        if (message.contains("price") || message.contains("cost")) {
            return "Pricing varies by product. You can see the exact price on any product page. Need help finding a specific item?";
        }
        if (message.contains("stock") || message.contains("available") || message.contains("inventory")) {
            return "Stock availability is shown on each product page. If an item is out of stock, feel free to contact us for lead times.";
        }
        if (message.contains("pdf") || message.contains("download") || message.contains("export")) {
            return "You can download product info as a PDF or CSV directly from any product page using the export buttons at the bottom.";
        }
        if (message.contains("search") || message.contains("find") || message.contains("looking")) {
            return "Use the search bar at the top of the page to find products by name, part number, or category.";
        }
        if (message.contains("bearing") || message.contains("belt") || message.contains("motor") || message.contains("chain")) {
            return "We carry a wide range of industrial components. Try searching for your specific part number or browse by category on the search page.";
        }
        if (message.contains("hello") || message.contains("hi") || message.contains("hey")) {
            return "Hey! I'm the Motion Industries assistant. I can help you find products, answer questions about pricing, availability, or exports. What do you need?";
        }
        return "I'm here to help with product questions, pricing, and availability. Could you give me more details about what you're looking for?";
    }
}
