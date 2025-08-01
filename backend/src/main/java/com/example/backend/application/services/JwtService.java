package com.example.backend.application.services;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${JWT_ACCESS_SECRET}")
    private String accessSecretRaw;

    @Value("${JWT_REFRESH_SECRET}")
    private String refreshSecretRaw;

    @Value("${JWT_ACCESS_EXPIRATION_MS}")
    private long accessTokenExpirationMs;

    @Value("${JWT_REFRESH_EXPIRATION_MS}")
    private long refreshTokenExpirationMs;

    private Key accessKey;
    private Key refreshKey;

    @PostConstruct
    public void init() {
        accessKey = Keys.hmacShaKeyFor(accessSecretRaw.getBytes());
        refreshKey = Keys.hmacShaKeyFor(refreshSecretRaw.getBytes());
    }

    public String generateAccessToken(String username) {
        return generateToken(username, accessKey, accessTokenExpirationMs);
    }

    public String generateRefreshToken(String username) {
        return generateToken(username, refreshKey, refreshTokenExpirationMs);
    }

    private String generateToken(String subject, Key key, long expirationMs) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateAccessToken(String token) {
        return validateToken(token, accessKey);
    }

    public boolean validateRefreshToken(String token) {
        return validateToken(token, refreshKey);
    }

    public String extractUsernameFromAccessToken(String token) {
        return extractSubject(token, accessKey);
    }

    public String extractUsernameFromRefreshToken(String token) {
        return extractSubject(token, refreshKey);
    }

    private boolean validateToken(String token, Key key) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    private String extractSubject(String token, Key key) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
    }
}

