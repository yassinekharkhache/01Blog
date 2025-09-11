
sudo docker-compose down --volumes --remove-orphans 
sudo docker-compose up -d
sudo docker exec -it 01blog-postgres-1 bash