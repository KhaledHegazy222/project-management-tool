#! /bin/bash

docker-compose -f /home/ubuntu/app/docker-compose-prod.yml down
docker-compose -f /home/ubuntu/app/docker-compose-prod.yml up --build -d