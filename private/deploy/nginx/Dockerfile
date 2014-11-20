FROM dockerfile/ubuntu

RUN \
        apt-get update && \
        apt-get install -y nginx && \
        echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
        chown -R www-data:www-data /var/lib/nginx && \
        mkdir -p /var/local/www && \
        chown -R www-data:www-data /var/local/www

VOLUME ["/etc/nginx/sites-enabled", "/var/local/www"]

CMD ["nginx"]

EXPOSE 80
EXPOSE 443

