# Static site: nginx serves the files, nothing runs on the server
FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY index.html style.css app.js opentype.min.js robots.txt sitemap.xml /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY fonts /usr/share/nginx/html/fonts
EXPOSE 80
