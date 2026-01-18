# --- Stage 1: Build ---
FROM node:lts-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Production ---
FROM alpine:latest
RUN apk add --no-cache nginx

RUN mkdir -p /var/www/html

# Copy the static assets from the builder
COPY --from=builder /app/build /var/www/html

# We don't add a config here because you are mounting your own via volumes
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]