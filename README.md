starSmash
=========

multiplayer 2d rts using node.js and javascript canvas


nGinx Config
============
```conf
server {
    root   /home/phil/projects/starSmash/public_html;
    index index.php
    listen 80;
    server_name starsmash.com.dev www.starsmash.com.dev;

    access_log  /var/log/nginx/starsmash.com.access.log;
    error_log  /var/log/nginx/starsmash.com.error.log;
    rewrite_log on;
    error_page 404 = /404.php;

    try_files $uri /index.php?$args;

    if (-f $request_filename) {
        break;
    }

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    location ~ \.(php) {
        fastcgi_pass  127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME /home/phil/projects/starSmash/public_html/index.php;
        fastcgi_param PHP_VALUE "include_path=./:/usr/share/php:/usr/share/pear";
        include fastcgi_params;
    }
}
```
