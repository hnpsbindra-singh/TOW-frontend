# Stage 1: Build the application
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /workspace
# Copy pom.xml and download dependencies using system Maven (bypassing wrapper files)
COPY pom.xml ./
RUN mvn dependency:go-offline -B
# Copy source code and build the package
COPY src src
RUN mvn package -DskipTests -B
# Stage 2: Run the application
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Create a non-root user for security
RUN useradd --create-home --shell /usr/sbin/nologin appuser
# Copy the built jar file
COPY --from=build /workspace/target/*.jar app.jar
USER appuser
EXPOSE 8080
# Run the jar
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
