package com.motionindustries.controller;

import com.motionindustries.model.AuthDTOs;
import com.motionindustries.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.motionindustries.config.JwtUtil;
import com.motionindustries.model.User;               
import com.motionindustries.repository.UserRepository; 
import java.util.Optional;      
import jakarta.validation.Valid; 


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private JwtUtil jwtUtil; // for validating token in /me endpoint
    @Autowired
    private UserRepository userRepository; // for fetching user details in /me endpoint

    /**
     * POST /api/auth/signup
     * Body: { email, password, firstName, lastName }
     * Returns: { token, email, firstName, lastName, role }
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody AuthDTOs.SignUpRequest request) {
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
    public ResponseEntity<?> signIn(@Valid @RequestBody AuthDTOs.SignInRequest request) {
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
    public ResponseEntity<?> getCurrentUser(@Valid @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new AuthDTOs.AuthResponse("Not Authenticated"));
        }
        String token = authHeader.substring(7);
        if(!jwtUtil.isTokenValid(token)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new AuthDTOs.AuthResponse("Invalid or expired token"));
        }
        String email = jwtUtil.extractEmail(token);
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new AuthDTOs.AuthResponse("User not found"));
        }
        User user = optionalUser.get();
        return ResponseEntity.ok(new AuthDTOs.AuthResponse(
            null,
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole()
        ));
    }

}
