# Backend Deployment

This backend is ready to build and run as a Docker container. Do not commit a real `.env` file.

## Local Docker Run

1. Copy `.env.example` to `.env`. Docker Compose loads this file automatically.
2. Replace every placeholder value in `.env`.
3. Build and start the backend:

```sh
docker compose up --build
```

The API will be available on `http://localhost:9090` unless `APP_PORT` is changed.

## Production Notes

- Provide the same environment variables from `.env.example` in your hosting platform.
- Use a managed MongoDB URI for `MONGODB_URI`.
- Set `JWT_SECRET` to a strong random value with at least 32 characters.
- Keep mail credentials in the deployment platform's secret manager.
- The container listens on port `8080`.
