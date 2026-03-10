package com.motionindustries.controller;

import com.motionindustries.model.AuthDTOs;
import com.motionindustries.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/signup
     * Body: { email, password, firstName, lastName }
     * Returns: { token, email, firstName, lastName, role }
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody AuthDTOs.SignUpRequest request) {
        try {
            AuthDTOs.AuthResponse response = authService.signUp(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AuthDTOs.AuthResponse(e.getMessage()));
        }
    }

    /**
     * POST /api/auth/signin
     * Body: { email, password }
     * Returns: { token, email, firstName, lastName, role }
     */
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody AuthDTOs.SignInRequest request) {
        try {
            AuthDTOs.AuthResponse response = authService.signIn(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthDTOs.AuthResponse(e.getMessage()));
        }
    }

    /**
     * GET /api/auth/me
     * Returns current user from token (stub - wire up JWT later)
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || token.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthDTOs.AuthResponse("Not authenticated"));
        }
        // TODO: Validate JWT and return user — for now returns placeholder
        return ResponseEntity.ok(new AuthDTOs.AuthResponse("valid-token", "user@example.com", "Test", "User", "USER"));
    }
}
