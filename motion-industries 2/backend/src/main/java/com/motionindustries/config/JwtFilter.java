package com.motionindustries.config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.motionindustries.model.User;
import com.motionindustries.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;


@Component
public class JwtFilter  extends OncePerRequestFilter{
    @Autowired JwtUtil jwtUtil;
    @Autowired UserRepository userRepository;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain) throws ServletException, IOException {
            String authHeader = request.getHeader("Authorization");
            // gate 1 - null check MUst come  before startsWith check 
            if(authHeader == null || !authHeader.startsWith("Bearer ")){
                filterChain.doFilter(request, response); // pass through, let Spring security handle it 
                return; // stops process here 
            }

            String token = authHeader.substring(7); // remove "Bearer " prefix

            //gate 2 wraps in a try catch so a bad token never crashes the filter
            try{
                if(jwtUtil.isTokenValid(token)){
                    String email = jwtUtil.extractEmail(token);
                    Optional<User> optionalUser = userRepository.findByEmail(email); // ifPresent returns void, so we have to assign to a variable first

                    if(optionalUser.isPresent()){
                        User user = optionalUser.get();
                        // assign to variable first and then pass to setAuthentication to avoid multiple calls to the database
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null, List.of());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            } catch (Exception e) {
                // token was bad - clear any partial auth state
                SecurityContextHolder.clearContext();
            }
            filterChain.doFilter(request, response); // continue processing the request
        }
}
