# =============================================================
# Stage 1: builder
# Uses the full Maven + JDK 11 image to compile the project
# and produce the fat JAR.  This image (~600 MB) is ONLY used
# during the build; it is NOT shipped in the final image.
# =============================================================
FROM maven:3.8-openjdk-11 AS builder

# Set the working directory inside the builder container.
# All subsequent COPY / RUN commands are relative to /build.
WORKDIR /build

# --- Dependency-caching trick ---
# Copy the POM first and download dependencies in a separate
# layer.  Docker caches this layer and reuses it on future
# builds as long as pom.xml has not changed, even if your
# source code has changed.  This makes rebuilds much faster.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Now copy the rest of the source tree and build the JAR.
# -DskipTests skips unit tests during image build; tests are
# run separately by the CI pipeline.
COPY src ./src
RUN mvn clean package -DskipTests -B

# =============================================================
# Stage 2: runtime
# Uses a minimal JRE-only Alpine image (~85 MB).
# Compiler, Maven cache, and source code are NOT included.
# This is the image that actually gets shipped to Docker Hub.
# =============================================================
FROM eclipse-temurin:11-jre-alpine AS runtime

# Create a non-root system user (UID 1001).
# Running as root inside a container is a security risk —
# if someone exploits the app they would have root on the host.
RUN addgroup -S appgroup && adduser -S -u 1001 -G appgroup appuser

# Set the working directory for the application.
WORKDIR /app

# Copy ONLY the compiled JAR from the builder stage.
# Nothing else (source, Maven cache, .class files) comes across.
COPY --from=builder /build/target/Game-On-0.0.1.jar app.jar

# Give the appuser ownership of the JAR so it can be read at runtime.
RUN chown appuser:appgroup app.jar

# Switch to the non-root user before starting the process.
USER appuser

# Document that the container listens on port 8080.
# This does NOT actually open the port; docker-compose.yml does.
EXPOSE 8080

# Start the Spring Boot application.
# Uses exec form (JSON array) so the JVM is PID 1 and receives
# OS signals (e.g., SIGTERM for graceful shutdown) correctly.
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
