package com.motionindustries.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatBotController {

    /**
     * POST /api/chatbot/message
     * Body: { message: string, productId?: number }
     * Returns: { reply: string }
     *
     * TODO: Wire up to an LLM API (OpenAI, Anthropic, etc.)
     * For now returns rule-based responses based on keywords.
     */
    @PostMapping("/message")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> body) {
        String message = (String) body.getOrDefault("message", "");
        String reply = generateReply(message.toLowerCase());
        return ResponseEntity.ok(Map.of("reply", reply));
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
