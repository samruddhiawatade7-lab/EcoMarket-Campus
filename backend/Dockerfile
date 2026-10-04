# ==========================================
# Stage 1: Build Stage (Maven + Java 21)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build application JAR
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Runtime Stage (Lightweight JRE 21)
# ==========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Add non-root user for enhanced container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create directory for file uploads
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

# Copy executable JAR from builder stage
COPY --from=builder /app/target/ecomarket-backend-1.0.0.jar app.jar

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
