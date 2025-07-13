# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY mvnw pom.xml ./
COPY mvnw.cmd ./
COPY .mvn .mvn

# Copy the source code
COPY src src
COPY frontend frontend

# Build the Spring Boot application
RUN ./mvnw clean package -DskipTests

# Expose the backend port
EXPOSE 8080

# Start the Spring Boot app with dev profile
CMD ["java", "-jar", "target/hms-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=dev"]
