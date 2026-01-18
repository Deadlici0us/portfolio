# 🚀 My Personal Portfolio

This repository contains my personal portfolio, designed to run as a containerized service within a larger multi-repo infrastructure. It includes a custom Nginx configuration with SSL termination.

## 🌐 Live Demo
Check out the live version here: https://anibal-flores.com/

## 🏗️ Architecture
This service is part of a broader self-hosted ecosystem. It is designed to be deployed alongside other repositories (e.g., API services, databases, or microservices) on a single VPS.

## 🛠️ Built With
- Frontend: **React**

- Styling: **CSS**

- Containerization: **Docker**

- Orchestration: **Docker Compose**

- Deployment: **Self-hosted on a VPS (Virtual Private Server)**

- Web Server: **Nginx as a Reverse Proxy** (with custom `nginx.conf`)

- Security: **SSL/TLS** (Self-managed via cert directory)

## 📂 Required Directory Structure
For the container to run correctly with SSL, ensure the following files are present in the root:

```
.
├── nginx/
│   ├── nginx.conf       # Custom Nginx server blocks
│   └── cert/            # SSL Certificates (fullchain.pem, privkey.pem)
├── Dockerfile           # Multi-stage production build
├── docker-compose.yml   # Deployment config for this + linked services
└── src/                 # Application source code
```

## 🚀 Deployment Integration
Because this repo is part of a multi-repo setup, it is typically managed via a master `docker-compose` or an external network.

### 1. SSL Setup
Place your certificates in the `nginx/cert/` directory before building. These are ignored by `.gitignore` for security but are required for the Nginx mount.

### 2. Standalone Deployment

```
docker-compose up -d --build
```

### 3. Integrated Deployment

If deploying with other repositories on the same VPS, ensure they share a common Docker network:

```
# Example snippet from docker-compose.yml
networks:
  web-network:
    external: true
```

## ⚙️ Nginx Configuration

The internal Nginx server is configured to:

- Listen on Port 443 (HTTPS).

- Redirect Port 80 (HTTP) to HTTPS.

- Reference certificates stored in /etc/nginx/cert/.

- Serve optimized static assets.
