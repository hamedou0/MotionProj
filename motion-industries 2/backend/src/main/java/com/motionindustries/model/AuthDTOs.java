package com.motionindustries.model;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// DTO classes for auth requests and responses

public class AuthDTOs {

    public static class SignUpRequest {
        @Email(message="Must be a valid email address.") @NotBlank(message="Email is required")
        private String email;
        @NotBlank @Size(min=8, message="Password must be at least 8 characters")
        private String password;
        @NotBlank(message="First name is required")
        private String firstName;
        @NotBlank(message="Last name is required")
        private String lastName;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
    }

    public static class SignInRequest {
        @Email(message="Must be a valid email address.") @NotBlank(message="Email is required")
        private String email;
        @NotBlank(message="Password is required")
        private String password;
        

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private String message;

        public AuthResponse(String token, String email, String firstName, String lastName, String role) {
            this.token = token;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.role = role;
        }

        public AuthResponse(String message) {
            this.message = message;
        }

        public String getToken() { return token; }
        public String getEmail() { return email; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getRole() { return role; }
        public String getMessage() { return message; }
    }
}
