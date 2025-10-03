
docker-compose down --volumes --remove-orphans 
docker-compose up -d
docker exec -it back_end-postgres-1 bash
