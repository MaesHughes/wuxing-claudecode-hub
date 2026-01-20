---
name: docker-helper
category: devops
description: Docker container creation, Docker Compose configuration, and containerization best practices
---

# Docker Helper

Expert guidance for Docker containerization, Docker Compose, and container orchestration.

## Dockerfile Basics

### Minimal Node.js Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### Python Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "app.py"]
```

### Multi-stage Build
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["node", "server.js"]
```

## Docker Compose

### Basic Web + Database
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb

volumes:
  postgres_data:
```

### Multi-service Setup
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REDIS_URL=redis://redis:6379
      - DB_HOST=postgres
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=myapp

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

## Common Commands

### Container Management
```bash
# Build image
docker build -t myapp:latest .

# Run container
docker run -d -p 3000:3000 --name myapp myapp

# List containers
docker ps

# Stop container
docker stop myapp

# Remove container
docker rm myapp

# View logs
docker logs myapp

# Follow logs
docker logs -f myapp

# Execute command in container
docker exec -it myapp sh
```

### Image Management
```bash
# List images
docker images

# Remove image
docker rmi myapp

# Remove all unused images
docker image prune -a

# Pull image
docker pull postgres:15
```

### Docker Compose
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild service
docker-compose up -d --build

# Run command in service
docker-compose exec app sh
```

## Best Practices

1. **Use alpine images** for smaller size
2. **Multi-stage builds** to reduce final image size
3. **Run as non-root user** for security
4. **Use .dockerignore** to exclude unnecessary files
5. **Don't store secrets** in images (use environment variables or secrets)
6. **Pin base image versions** for reproducibility
7. **Use health checks** for containers
8. **Limit container resources** (CPU, memory)
9. **Use volumes** for persistent data
10. **Clean up unused resources** regularly

## .dockerignore
```
node_modules
npm-debug.log
.git
.env
README.md
.DS_Store
coverage
.vscode
```
