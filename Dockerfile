FROM nginx

# Create app directory
WORKDIR /app

# Deploy app
COPY build/ /usr/share/nginx/html/

# Expose http/https ports
EXPOSE 80
EXPOSE 443

# Start server
CMD ["nginx", "-g", "daemon off;"]
