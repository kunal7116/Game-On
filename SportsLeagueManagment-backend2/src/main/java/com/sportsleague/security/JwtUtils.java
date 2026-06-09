package com.sportsleague.security;

import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

/**
 * JWT utility — token generation, validation, and claims extraction.
 *
 * WHY JWT_SECRET IS AN ENVIRONMENT VARIABLE:
 * The secret key is what prevents attackers from forging tokens.
 * If it is hard-coded in source code or application.properties,
 * anyone with read access to the repository can sign their own
 * tokens and impersonate any user.
 *
 * In Docker / production the secret is injected via the JWT_SECRET
 * environment variable.  In local development (APP_ENV=local) it
 * falls back to the value in application.properties.
 *
 * The application REFUSES to start if JWT_SECRET is absent — this
 * prevents an insecure startup where no signing key exists.
 */
@Component
@Slf4j
public class JwtUtils {

    @Value("${EXP_TIMEOUT}")
    private int jwtExpirationMs;

    /**
     * JWT signing secret.
     * Spring Boot's relaxed binding maps the environment variable
     * JWT_SECRET to the property key JWT_SECRET.
     * The fallback value is used only when APP_ENV=local is set
     * (local development without Docker).
     */
    @Value("${JWT_SECRET}")
    private String jwtSecret;

    private Key key;

    /**
     * Called automatically after Spring injects all @Value fields.
     * Validates that the secret is present and builds the signing key.
     *
     * Requirement 5.6: throws a startup exception if JWT_SECRET is
     * absent or empty, preventing the application from starting in
     * an insecure state.
     */
    @PostConstruct
    public void init() {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException(
                "JWT_SECRET environment variable is required but is absent or empty. "
                + "Set JWT_SECRET in your .env file (Docker) or application.properties (local dev)."
            );
        }

        // Build a signing key from the secret string.
        // If the secret is already Base64-encoded, decode it first;
        // otherwise use the raw bytes.  Either way the key must be
        // at least 512 bits (64 bytes) for HS512.
        try {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
            key = Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            // Secret is not valid Base64 — use raw UTF-8 bytes.
            // For HS512 the secret should be >= 64 characters.
            byte[] keyBytes = jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            key = Keys.hmacShaKeyFor(keyBytes);
        }

        log.info("JwtUtils initialised successfully.");
    }

    /**
     * Generate a signed JWT token for the authenticated user.
     */
    public String generateJwtToken(Authentication authentication) {
        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + jwtExpirationMs))
                .claim("authorities", getAuthoritiesInString(userPrincipal.getAuthorities()))
                .claim("user_id", userPrincipal.getUserId())
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /** Extract the username (subject) from a validated claims object. */
    public String getUserNameFromJwtToken(Claims claims) {
        return claims.getSubject();
    }

    /**
     * Parse and validate a JWT token, returning its claims.
     * Throws an exception if the token is expired, malformed, or
     * has an invalid signature.
     */
    public Claims validateJwtToken(String jwtToken) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwtToken)
                    .getBody();
        } catch (Exception e) {
            log.error("JWT token validation failed: {}", e.getMessage());
            throw e;
        }
    }

    /** Convert a GrantedAuthority collection to a comma-separated string. */
    private String getAuthoritiesInString(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
    }

    /** Parse the comma-separated authority string from claims into a list. */
    public List<GrantedAuthority> getAuthoritiesFromClaims(Claims claims) {
        String authString = (String) claims.get("authorities");
        return AuthorityUtils.commaSeparatedStringToAuthorityList(authString);
    }

    /** Extract the user ID from claims. */
    public Long getUserIdFromJwtToken(Claims claims) {
        return Long.valueOf(claims.get("user_id").toString());
    }

    /** Build a full Spring Security Authentication object from a JWT string. */
    public Authentication populateAuthenticationTokenFromJWT(String jwt) {
        Claims claims = validateJwtToken(jwt);
        String username = getUserNameFromJwtToken(claims);
        List<GrantedAuthority> authorities = getAuthoritiesFromClaims(claims);
        Long userId = getUserIdFromJwtToken(claims);
        return new UsernamePasswordAuthenticationToken(username, userId, authorities);
    }
}
