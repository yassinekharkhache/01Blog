# technologies used

## Frontend
- Angular 20
- Angular Material
- Marked for Markdown parsing

## Backend
- Spring Boot 3
- Spring Security with JWT
- spring Data jpa
- PostgreSQL
- Java 17

# how to run

- open 3 terminals

1. Start the front end server:
```bash
    cd front_end
    ng dev
```
2. Start Data base
```bash
    cd back_end
    ./init.sh
```
3. Start back_end
```bash
    cd back_end
    ./mvnw spring-boot:run
```