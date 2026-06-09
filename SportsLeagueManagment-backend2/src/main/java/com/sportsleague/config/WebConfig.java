package com.sportsleague.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS (Cross-Origin Resource Sharing) configuration.
 *
 * WHY THIS IS NEEDED IN DOCKER:
 * Even when the React frontend and Spring Boot backend run inside
 * the same Docker Compose stack, the browser still loads the React
 * app from http://localhost:3000 and makes API calls to
 * http://localhost:8080.  The browser enforces the Same-Origin
 * Policy — it blocks cross-origin requests unless the server
 * explicitly allows them.  Container networking does NOT bypass
 * browser CORS policies.
 *
 * The allowed origin is read from the FRONTEND_ORIGIN environment
 * variable so it can be changed without recompiling the app:
 *   - Local dev (no Docker):  defaults to http://localhost:3000
 *   - Docker Compose:         set FRONTEND_ORIGIN=http://localhost:3000
 *   - Production:             set FRONTEND_ORIGIN=https://yourdomain.com
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger log = LoggerFactory.getLogger(WebConfig.class);

    private static final String DEFAULT_ORIGIN = "http://localhost:3000";

    /**
     * Read the allowed frontend origin from the FRONTEND_ORIGIN
     * environment variable.  Falls back to http://localhost:3000 when
     * the variable is absent or empty (local development without Docker).
     */
    @Value("${FRONTEND_ORIGIN:http://localhost:3000}")
    private String frontendOrigin;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String resolvedOrigin = resolveOrigin(frontendOrigin);

        log.info("CORS: allowing origin '{}'", resolvedOrigin);

        registry.addMapping("/**")
                .allowedOrigins(resolvedOrigin)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Authorization", "Content-Type", "Accept")
                // allowCredentials(true) is required so the browser includes
                // the Authorization header in cross-origin requests.
                .allowCredentials(true)
                .maxAge(3600);
    }

    /**
     * Validate the origin value.
     * If the provided value is null, blank, or not a valid HTTP/HTTPS URL,
     * log a warning and fall back to the safe default.
     */
    private String resolveOrigin(String origin) {
        if (origin == null || origin.isBlank()) {
            log.warn("FRONTEND_ORIGIN is not set or empty. Falling back to '{}'", DEFAULT_ORIGIN);
            return DEFAULT_ORIGIN;
        }
        if (!origin.startsWith("http://") && !origin.startsWith("https://")) {
            log.warn("FRONTEND_ORIGIN '{}' is not a valid URL (must start with http:// or https://). "
                    + "Falling back to '{}'", origin, DEFAULT_ORIGIN);
            return DEFAULT_ORIGIN;
        }
        return origin;
    }
}
