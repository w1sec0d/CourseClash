# CourseClash Frontend Docker Deployment

This document explains how the CourseClash frontend is dockerized and integrated into the main application.

## Overview

The frontend component is part of the CourseClash microservices architecture and is deployed using Docker. The Dockerfile in this directory defines how the frontend is built and packaged as a container.

## Integration with App-Level Docker Compose

The frontend service is defined in the app-level `docker-compose.yml` file at the root of the CourseClash project. There is no need for a separate docker-compose file in the frontend directory.

## Building and Running

To build and run the entire CourseClash application including the frontend:

```bash
# Navigate to the root directory of CourseClash
cd /home/carlos/dev/CourseClash

# Build and start all services
docker-compose up -d

# View logs for the frontend service
docker-compose logs -f frontend

# Stop all services
docker-compose down
```

The frontend application will be available at http://localhost:3000

## Building Only the Frontend

If you need to build just the frontend container:

```bash
# Navigate to the root directory
cd /home/carlos/dev/CourseClash

# Build only the frontend service
docker-compose build frontend

# Run only the frontend service (note: may require dependencies)
docker-compose up -d frontend
```

## Environment Variables

The frontend container uses the following environment variables:

- `NODE_ENV`: Set to 'production' for the production build
- `API_URL`: URL of the API gateway (default: http://api_gateway:8080)

These are configured in the app-level docker-compose.yml file.

## Production Deployment

For production deployment, consider:

1. Using a container orchestration platform like Kubernetes
2. Setting up a CI/CD pipeline for automated builds
3. Using a reverse proxy like Nginx for SSL termination
4. Implementing proper monitoring and logging

## Troubleshooting

If you encounter issues with the frontend container:

1. Check container logs: `docker-compose logs frontend`
2. Verify the container is running: `docker-compose ps`
3. Check the health status: `docker inspect --format='{{json .State.Health}}' courseclash_frontend_1`
