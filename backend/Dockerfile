# Étape 1 : build du jar avec Maven (dépendances mises en cache tant que pom.xml ne change pas)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
# Les tests (dont les tests d'intégration Testcontainers) tournent déjà en CI avant le merge
# vers main ; les rejouer ici nécessiterait Docker-in-Docker sans apporter de garantie de plus.
RUN mvn package -DskipTests -B

# Étape 2 : image d'exécution, légère, sans outils de build
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S spring && adduser -S spring -G spring
USER spring
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
