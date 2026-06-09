# Docker & CI/CD Guide — Game-On Sports League Management System

This guide walks through every step of running the project with Docker and explains
**why** each piece exists — not just how to use it.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Quick Start](#2-quick-start)
3. [Service Graph](#3-service-graph)
4. [Understanding the Dockerfiles](#4-understanding-the-dockerfiles)
5. [Secrets and Environment Variables](#5-secrets-and-environment-variables)
6. [Useful Docker Commands](#6-useful-docker-commands)
7. [Troubleshooting](#7-troubleshooting)
8. [CI/CD Pipeline (GitHub Actions)](#8-cicd-pipeline-github-actions)

---

## 1. Prerequisites

Install the following software before you begin:

| Software | Minimum Version | Install Guide |
|---|---|---|
| **Docker Desktop** | 4.x | https://docs.docker.com/get-docker/ |
| **Docker Compose** | 2.x (included in Docker Desktop) | https://docs.docker.com/compose/install/ |
| **Git** | 2.x | https://git-scm.com/downloads |
| **Docker Hub account** | — | https://hub.docker.com/signup |

Verify your installation:

```bash
docker --version          # Docker version 24.x.x
docker compose version    # Docker Compose version v2.x.x
git --version             # git version 2.x.x
```

> **Why Docker Desktop?**
> Docker Desktop bundles the Docker daemon, Docker CLI, Docker Compose, and BuildKit
> into a single installer.  On Windows and Mac it also runs a lightweight Linux VM
> because Docker containers are Linux processes.

---

## 2. Quick Start

Follow these steps exactly to bring the full stack up.

### Step 1 — Clone the repository

```bash
git clone https://github.com/<your-username>/Game-On.git
cd Game-On
```

### Step 2 — Create your `.env` file

```bash
# Windows CMD
copy .env.example .env

# Git Bash / Mac / Linux
cp .env.example .env
```

### Step 3 — Fill in real values

Open `.env` in any text editor and replace every `changeme` placeholder:

```
MYSQL_ROOT_PASSWORD=<a strong password for the MySQL root user>
MYSQL_DATABASE=sportsLeague_db
MYSQL_USER=gameuser
MYSQL_PASSWORD=<a strong password for the app database user>
JWT_SECRET=<a random 64-character string — generate with: openssl rand -base64 64>
FRONTEND_ORIGIN=http://localhost:3000
```

> **Tip — generating a strong JWT secret:**
> ```bash
> openssl rand -base64 64
> ```
> Copy the output (without newlines) as your `JWT_SECRET` value.

### Step 4 — Build and start all services

```bash
docker compose up --build
```

`--build` forces Docker to rebuild the images from your local source code.
Omit it on subsequent runs if you haven't changed any code.

### Step 5 — Open the application

| URL | What you see |
|---|---|
| http://localhost:3000 | React frontend — Login / Sign Up page |
| http://localhost:8080/swagger-ui/index.html | Swagger API documentation |

### Step 6 — Stop the stack

```bash
# Stop containers but keep data (MySQL volume preserved)
docker compose down

# Stop AND delete all data (wipes the database)
docker compose down -v
```

---

## 3. Service Graph

The `docker-compose.yml` defines three services that form a dependency chain:

```
┌─────────────────────────────────────────────────────┐
│                  game-on-network                    │
│                                                     │
│  ┌──────────┐   healthy?   ┌──────────────────┐    │
│  │    db    │ ──────────▶  │    backend       │    │
│  │ MySQL 8  │              │  Spring Boot     │    │
│  │ :3306    │              │  :8080           │    │
│  └──────────┘              └──────────────────┘    │
│                                       │  started?  │
│                              ┌────────▼─────────┐  │
│                              │    frontend      │  │
│                              │  React + Nginx   │  │
│                              │  :3000 → :80     │  │
│                              └──────────────────┘  │
└─────────────────────────────────────────────────────┘
```

| Service | Image | Host Port | Container Port | Purpose |
|---|---|---|---|---|
| `db` | `mysql:8.0` | 3306 | 3306 | Stores all application data |
| `backend` | built from `SportsLeagueManagment-backend2/Dockerfile` | 8080 | 8080 | REST API, JWT auth, business logic |
| `frontend` | built from `league-website/Dockerfile` | 3000 | 80 | React SPA served by Nginx |

### Why this startup order?

**`backend` waits for `db` to be healthy.**
MySQL takes 10–30 seconds to initialise after the container starts.
If the backend tried to connect immediately it would fail with
"Communications link failure" and crash.  The `healthcheck` on
`db` runs `mysqladmin ping` every 10 seconds.  Once it passes,
Docker Compose starts `backend`.

**`frontend` waits for `backend` to be started.**
The React app is just static files served by Nginx — it doesn't
need the backend to be healthy to start.  But we start `frontend`
after `backend` so everything is available by the time the browser
makes its first API call.

### Networking — why `db` not `localhost`?

All three services are on a shared bridge network called `game-on-network`.
Docker makes each service reachable by its **service name** as a hostname.
So the backend connects to MySQL at `db:3306`, not `localhost:3306`.

This is why `docker-compose.yml` sets:
```
SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/sportsLeague_db...
```

---

## 4. Understanding the Dockerfiles

### Backend Dockerfile — multi-stage build

```
Stage 1 (builder):  maven:3.8-openjdk-11  (~700 MB)
    ↓  mvn clean package -DskipTests
    ↓  produces target/Game-On-0.0.1.jar
Stage 2 (runtime):  eclipse-temurin:11-jre-alpine  (~85 MB)
    ↓  COPY only the JAR
    ↓  run as non-root user "appuser"
    Final image: ~200 MB  (no Maven, no source code, no JDK)
```

### Frontend Dockerfile — multi-stage build with Nginx

```
Stage 1 (builder):  node:18-alpine
    ↓  npm ci                 (installs exact dependencies)
    ↓  npm run build          (produces /app/build/*.html/js/css)
Stage 2 (runtime):  nginx:stable-alpine  (~25 MB)
    ↓  COPY /app/build → /usr/share/nginx/html
    ↓  COPY nginx.conf        (handles React Router routing)
    Final image: ~30 MB  (no Node.js, no source code, no node_modules)
```

**Why Nginx instead of `npm start`?**
`npm start` is a development server — slow, memory-hungry, and unsafe
for production.  Nginx serves the same static files in ~25 MB of RAM.

---

## 5. Secrets and Environment Variables

**Rule: never commit real secrets to Git.**

| File | Committed to Git? | Purpose |
|---|---|---|
| `.env.example` | ✅ Yes | Documents which variables exist (placeholder values only) |
| `.env` | ❌ No (in .gitignore) | Holds your actual passwords and secrets |

The `.env` file is automatically loaded by Docker Compose.
Every `${VARIABLE}` in `docker-compose.yml` is replaced with the value from `.env`.

**Required variables:**

| Variable | Used by | Description |
|---|---|---|
| `MYSQL_ROOT_PASSWORD` | `db` | MySQL root password |
| `MYSQL_DATABASE` | `db`, `backend` | Database name |
| `MYSQL_USER` | `db`, `backend` | App database user |
| `MYSQL_PASSWORD` | `db`, `backend` | App database password |
| `JWT_SECRET` | `backend` | JWT signing key (≥ 64 chars) |
| `FRONTEND_ORIGIN` | `backend` | Allowed CORS origin |

---

## 6. Useful Docker Commands

```bash
# See all running containers and their health status
docker compose ps

# Watch live logs from all services
docker compose logs -f

# Watch logs from just the backend
docker compose logs -f backend

# Rebuild a single service without restarting the others
docker compose up --build backend

# Open a shell inside the backend container (for debugging)
docker compose exec backend sh

# Open a MySQL shell inside the db container
docker compose exec db mysql -u root -p

# List all named volumes
docker volume ls

# Remove stopped containers and unused images (free disk space)
docker system prune
```

---

## 7. Troubleshooting

### Problem 1 — Backend crashes immediately after starting

**Symptom:**
```
game-on-backend | Communications link failure
game-on-backend | The last packet sent successfully to the server was 0 milliseconds ago.
```

**Diagnostic command:**
```bash
docker compose ps
# Check if db shows "healthy" or "starting"
```

**Fix:**
MySQL hasn't finished initialising.  Wait 30–60 seconds and run:
```bash
docker compose restart backend
```
If it keeps crashing, check the db logs:
```bash
docker compose logs db
```
Also verify your `.env` contains `MYSQL_ROOT_PASSWORD` — MySQL will
not start without it.

---

### Problem 2 — CORS error in the browser

**Symptom:**
Browser console shows:
```
Access to XMLHttpRequest at 'http://localhost:8080/...' from origin
'http://localhost:3000' has been blocked by CORS policy
```

**Diagnostic command:**
```bash
docker compose logs backend | grep -i cors
```

**Fix:**
Check that `FRONTEND_ORIGIN=http://localhost:3000` is set in your `.env`
and that the backend container has restarted after you edited `.env`:
```bash
docker compose up --build backend
```
Note: CORS is enforced by the **browser**, not by Docker.  Even in
Docker Compose the browser sees two different origins (port 3000 vs 8080)
and applies the Same-Origin Policy.

---

### Problem 3 — Port already in use

**Symptom:**
```
Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:3306 -> 0.0.0.0:0:
bind: address already in use
```

**Diagnostic command:**
```bash
# Windows
netstat -ano | findstr :3306

# Mac / Linux
lsof -i :3306
```

**Fix — Option A:** Stop the conflicting process (e.g., your local MySQL service):
```bash
# Windows (stop MySQL service)
net stop mysql

# Mac with Homebrew
brew services stop mysql
```

**Fix — Option B:** Change the host port in `docker-compose.yml`:
```yaml
# Change  "3306:3306"  to  "3307:3306"
ports:
  - "3307:3306"
```
Then update `SPRING_DATASOURCE_URL` in `docker-compose.yml` if needed.

---

## 8. CI/CD Pipeline (GitHub Actions)

### What is CI/CD?

- **CI (Continuous Integration):** Every code push is automatically compiled
  and tested.  If something breaks, you find out within minutes.
- **CD (Continuous Delivery):** Once tests pass, a deployable Docker image is
  automatically built and pushed to Docker Hub.

The pipeline is defined in `.github/workflows/ci.yml`.
GitHub reads this file automatically — there is no separate CI server to install.

### Pipeline flow

```
git push to main
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│  Trigger: push or pull_request to main                  │
│                                                         │
│  build-backend ──────┐                                  │
│  (Java 11 / Maven)   ├── both pass? ──▶ docker-build-push│
│  build-frontend ─────┘   (push to main only)           │
│  (Node 18 / npm)                                        │
└─────────────────────────────────────────────────────────┘
```

### Step-by-step — adding GitHub Secrets

Docker Hub credentials must be stored as GitHub Secrets so they are never
written in the pipeline YAML file.

1. Go to your GitHub repository in a browser.
2. Click **Settings** (top navigation).
3. In the left sidebar, click **Secrets and variables → Actions**.
4. Click **New repository secret** and add:

   | Secret Name | Value |
   |---|---|
   | `DOCKER_HUB_USERNAME` | Your Docker Hub username |
   | `DOCKER_HUB_TOKEN` | A Docker Hub access token (**not** your password) |

   To create a Docker Hub access token:
   - Log in to https://hub.docker.com
   - Click your avatar → **Account Settings → Security → Access Tokens**
   - Click **New Access Token**, give it a name, select **Read, Write, Delete**
   - Copy the token value (it is shown only once)

### Verifying a successful pipeline run

After pushing to `main`:

1. Go to your GitHub repository.
2. Click the **Actions** tab.
3. Click the most recent workflow run named **"CI/CD Pipeline"**.
4. A ✅ green check mark on each job means it passed.
5. After the `docker-build-push` job completes, visit
   https://hub.docker.com/r/`<your-username>`/game-on-backend
   to confirm the image was pushed.

### What the pipeline caches

| Job | What is cached | Why |
|---|---|---|
| `build-backend` | `~/.m2/repository` (Maven dependencies) | Avoids re-downloading ~300 MB every run |
| `build-frontend` | `league-website/node_modules` | Avoids re-running `npm ci` (~2 min) every run |
| `docker-build-push` | Docker layers (GitHub Actions cache) | Avoids rebuilding unchanged image layers |
