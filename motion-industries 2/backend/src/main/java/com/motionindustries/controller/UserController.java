package com.motionindustries.controller;

import com.motionindustries.model.AuthDTOs;
import com.motionindustries.model.User;
import com.motionindustries.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal User authUser,
            @Valid @RequestBody AuthDTOs.UpdateProfileRequest request
    ) {
        if (authUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthDTOs.MessageResponse("Authentication required."));
        }

        try {
            User updatedUser = userService.updateProfile(authUser, request);
            return ResponseEntity.ok(new AuthDTOs.AuthResponse(
                    null,
                    updatedUser.getEmail(),
                    updatedUser.getFirstName(),
                    updatedUser.getLastName(),
                    updatedUser.getRole(),
                    updatedUser.getAvatarUrl()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthDTOs.MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User authUser,
            @Valid @RequestBody AuthDTOs.ChangePasswordRequest request
    ) {
        if (authUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthDTOs.MessageResponse("Authentication required."));
        }

        try {
            userService.changePassword(authUser, request);
            return ResponseEntity.ok(new AuthDTOs.MessageResponse("Password updated successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthDTOs.MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal User authUser) {
        if (authUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthDTOs.MessageResponse("Authentication required."));
        }

        userService.deleteAccount(authUser);
        return ResponseEntity.ok(new AuthDTOs.MessageResponse("Account deleted successfully."));
    }
}
