#!/bin/bash

echo "Building Image"
docker build -t "philbrookes/nginx" /vagrant/nginx

echo "Stopping All Images"
docker stop $(docker ps -a -q)

echo "Starting Image"
docker run -d -p 80:80 -v /vagrant/nginx/public:/var/local/www -v /vagrant/nginx/sites-enabled:/etc/nginx/sites-enabled philbrookes/nginx nginx
