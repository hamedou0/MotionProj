package com.motionindustries.config;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.motionindustries.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

// Handles creating and verifying JWT tokens
@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secretKey; // used to sign the token
    @Value("${jwt.expiry}")
    private long expiryMS; // how long token lasts 

    public String generateToken(User user){
        return Jwts.builder()
        .setSubject(user.getEmail())
        .claim("role", user.getRole())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + expiryMS))
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
    }

    // Extracts the email (subject) from a valid token 
    public String extractEmail(String token){
        return parseClaims(token).getSubject();
    }

    // Returns true if tokten is valid and not expire
    public boolean isTokenValid(String token){
        try{
            parseClaims(token);
            return true;
        }
        catch(ExpiredJwtException | MalformedJwtException e) {
            return false;
        }
    }

    // helper - parses the token using the secret key
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
    }
    
    // converts the secret string into a Key object jjwt can use
    private Key getSigningKey(){
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }


}
