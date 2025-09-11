
docker-compose down --volumes --remove-orphans 
docker-compose up -d
docker exec -it 01blog-postgres-1 bash