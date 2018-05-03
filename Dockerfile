# Create temporary builder image
FROM node:9.11 as builder
# Create app directory
WORKDIR /app
# Copy app source and build app
COPY package*.json yarn.lock ./
RUN yarn
COPY public ./public
COPY src ./src
RUN yarn run build

# Create application image
FROM nginx:1.13-alpine
# Create app directory
WORKDIR /app
# Expose http/https ports
EXPOSE 80
EXPOSE 443
# Copy application files
COPY --from=builder app/build /usr/share/nginx/html/
# Start server
CMD ["nginx", "-g", "daemon off;"]
