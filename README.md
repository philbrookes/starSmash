starSmash
=========

multiplayer 2d rts using node.js and javascript canvas

Credit
======
I have used some wonderful sprites from: http://millionthvector.blogspot.co.uk/p/free-sprites.html Thanks so much for the beautiful art!

Using this code
===============
If you want to contribute to this code, that's brilliant! Just open a PR that'd be amazing.

If you want to use this code for your own project, that's brilliant! I would love to know about what you're building, and maybe we could talk about changes we could both make to suit both projects! Some credit somewhere would be nice too, of course!


nginx config
============
```conf
server {
    root   /path/to/starSmash/public_html;
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
        fastcgi_param SCRIPT_FILENAME /path/to/starSmash/public_html/index.php;
        fastcgi_param PHP_VALUE "include_path=./:/usr/share/php:/usr/share/pear";
        include fastcgi_params;
    }
}
```
