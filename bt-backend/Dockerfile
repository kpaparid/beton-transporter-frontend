FROM openjdk:17
LABEL maintainer="kpaparid"
ADD target/bt-backend-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]


# build -t bt-backend:latest .
#docker run -p 8080:8080 bt-backend
