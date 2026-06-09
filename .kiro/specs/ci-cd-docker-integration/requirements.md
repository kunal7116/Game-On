# Requirements Document

## Introduction

This document specifies requirements for containerizing the **Game-On Sports League Management System**
and establishing a CI/CD pipeline. The system consists of three components:

- **Frontend**: React 18 SPA (league-website), built via Create React App, served on port 3000
- **Backend**: Spring Boot 2.7.18 REST API (SportsLeagueManagment-backend2), Java 11, port 8080
- **Database**: MySQL 8, port 3306

The goal is to package each component into Docker containers, wire them together with Docker Compose,
and automate build/test/deploy via GitHub Actions — while structuring the work so the developer learns
each concept as it is introduced.

> **Learning Note — Why containerize?**
> Running services locally means "it works on my machine" but breaks on a teammate's or a server.
> Docker bundles the app *and* its runtime environment together, so the same image runs identically
> everywhere: dev laptop, CI server, or production host.

---

## Glossary

- **Docker_Image**: A read-only, self-contained package that includes the application binary, its
  runtime, libraries, and configuration. Built from a `Dockerfile`.
- **Docker_Container**: A running instance of a Docker_Image. Multiple containers can run from the
  same image simultaneously.
- **Dockerfile**: A text file with step-by-step instructions that Docker uses to build a Docker_Image.
- **Docker_Compose**: A tool that reads a `docker-compose.yml` file and starts, networks, and
  manages multiple Docker_Containers as a single application stack.
- **Multi_Stage_Build**: A Dockerfile technique that uses multiple `FROM` stages so that build tools
  (e.g., Maven, Node) are not included in the final Docker_Image, keeping the image small.
- **Health_Check**: A command Docker runs periodically inside a container to determine whether the
  service is ready to accept traffic.
- **Named_Volume**: A Docker-managed storage area that persists data (e.g., database files) across
  container restarts.
- **Environment_Variable**: A key-value pair injected into a container at runtime, used to configure
  the application without hard-coding values in source code.
- **Service_Dependency**: A Docker Compose declaration (`depends_on`) that controls the startup order
  of containers within a stack.
- **CI_CD_Pipeline**: An automated sequence of steps (build → test → publish → deploy) triggered by
  a Git push or pull request.
- **GitHub_Actions**: A CI/CD platform built into GitHub that runs workflows defined in YAML files
  stored under `.github/workflows/`.
- **Workflow_Job**: A named set of steps within a GitHub_Actions workflow that runs on a
  GitHub-hosted runner.
- **Docker_Hub**: A public container registry where Docker_Images can be stored and pulled from.
- **Secret**: A sensitive value (password, API key, token) stored in GitHub repository settings and
  injected into Workflow_Jobs as environment variables at runtime — never stored in source code.
- **CORS**: Cross-Origin Resource Sharing — a browser security mechanism. The Backend must be
  configured to accept requests from the Frontend's origin when both run in containers.

---

## Requirements

---

### Requirement 1: Backend Dockerfile (Multi-Stage Build)

**User Story:** As a developer learning Docker, I want a Dockerfile for the Spring Boot backend that
uses a multi-stage build, so that I understand how to separate the build environment from the runtime
image and produce a lean production image.

> **Learning Note — Why multi-stage?**
> Stage 1 uses a Maven image (large) to compile and package the JAR. Stage 2 copies only the JAR into
> a minimal JRE image. The final image ships no compiler, no Maven cache, no source code — just the
> runnable JAR. This reduces image size from ~600 MB to ~200 MB.

#### Acceptance Criteria

1. THE Backend_Dockerfile SHALL use a two-stage Multi_Stage_Build: a `builder` stage based on
   `maven:3.8-openjdk-11` and a `runtime` stage based on `eclipse-temurin:11-jre-alpine`.
2. WHEN the `builder` stage executes, THE Backend_Dockerfile SHALL run `mvn clean package -DskipTests`
   to produce a JAR file at `target/Game-On-0.0.1.jar` inside the container.
3. WHEN the `runtime` stage executes, THE Backend_Dockerfile SHALL copy the compiled JAR from
   `/build/target/Game-On-0.0.1.jar` in the `builder` stage to `/app/app.jar` in the runtime image.
4. WHEN the container starts, THE Backend_Dockerfile SHALL execute `java -jar /app/app.jar` as
   the container entry point so the Spring Boot application starts automatically.
5. THE Backend_Dockerfile SHALL expose port 8080 to document the port the application listens on.
6. THE Backend_Dockerfile SHALL create a non-root system user named `appuser` with UID 1001
   in the runtime stage, verifiable by running `id appuser` inside the built container showing UID ≠ 0.
7. WHEN the container starts, THE Backend_Dockerfile SHALL switch to the `appuser` user before
   executing the entry point, verifiable by running `whoami` inside the container returning `appuser`.

---

### Requirement 2: Frontend Dockerfile (Multi-Stage Build with Nginx)

**User Story:** As a developer learning Docker, I want a Dockerfile for the React frontend that builds
the static assets and serves them via Nginx, so that I understand how to containerize a Single Page
Application efficiently.

> **Learning Note — Why Nginx for React?**
> `npm start` (react-scripts start) is a development server — it is slow, uses Node.js memory, and
> is not safe for production. `npm run build` compiles React into plain HTML/CSS/JS files. Nginx
> serves those static files extremely fast with very low memory usage. This is the standard
> production pattern.

#### Acceptance Criteria

1. THE Frontend_Dockerfile SHALL use a two-stage Multi_Stage_Build: a `builder` stage based on
   `node:18-alpine` and a `runtime` stage based on `nginx:stable-alpine`.
2. WHEN the `builder` stage executes, THE Frontend_Dockerfile SHALL run `npm ci` to install exact
   dependency versions from `package-lock.json`, then run `npm run build` to produce a `build/`
   directory containing the compiled HTML, CSS, and JS files.
3. WHEN the `runtime` stage executes, THE Frontend_Dockerfile SHALL copy only the contents of
   `/app/build` from the `builder` stage into `/usr/share/nginx/html` in the Nginx image.
4. WHEN Nginx receives an HTTP request for a path that does not match a static file (e.g., `/city`),
   THE nginx.conf SHALL serve `/usr/share/nginx/html/index.html` with an HTTP 200 response, enabling
   React Router client-side routing. The `nginx.conf` SHALL be copied from
   `league-website/nginx.conf` into the image at `/etc/nginx/conf.d/default.conf`.
5. THE Frontend_Dockerfile SHALL expose port 80 to document the port Nginx listens on.
6. THE Backend_Dockerfile SHALL copy `package.json` and `package-lock.json` into the builder stage
   before copying the rest of the application source code, so that Docker layer caching reuses the
   dependency installation layer when only non-package source files change.

---

### Requirement 3: MySQL Container Configuration

**User Story:** As a developer learning Docker, I want to run MySQL inside a Docker container
configured via environment variables, so that I understand how to manage a stateful service in
Docker without losing data between restarts.

> **Learning Note — Why not just use your local MySQL?**
> Local MySQL is tied to your OS. If a colleague runs the project, they need to install and configure
> MySQL manually. A containerized MySQL starts identically for everyone with one command. The Named
> Volume is the key concept — without it, all data disappears when the container stops.

#### Acceptance Criteria

1. THE Docker_Compose_Configuration SHALL define a `db` service using the official `mysql:8.0` image.
2. THE `db` service SHALL be configured using `${MYSQL_ROOT_PASSWORD}`, `${MYSQL_DATABASE}`,
   `${MYSQL_USER}`, and `${MYSQL_PASSWORD}` variable-substitution syntax in `docker-compose.yml`,
   with actual values sourced from the `.env` file and never hard-coded in `docker-compose.yml`.
3. THE `db` service SHALL mount a Named_Volume named `mysql_data` at `/var/lib/mysql` so that
   database data persists across container restarts and re-creations.
4. THE `db` service SHALL include a Health_Check configured with `test: ["CMD", "mysqladmin",
   "ping", "-h", "localhost"]`, `interval: 10s`, `timeout: 5s`, `retries: 3`, and
   `start_period: 30s`, so that `docker compose ps` reports the container as `healthy` once MySQL
   accepts connections.
5. THE Docker_Compose_Configuration SHALL declare `mysql_data` in the top-level `volumes:` section
   so Docker manages the volume lifecycle independently of any individual service.

---

### Requirement 4: Docker Compose Orchestration

**User Story:** As a developer learning Docker Compose, I want a single `docker-compose.yml` that
starts all three services together with correct networking and startup ordering, so that I can bring
the entire stack up or down with one command.

> **Learning Note — How Docker Compose networking works:**
> Compose creates a private virtual network for all services. Each service is reachable by its
> **service name** as a hostname. For example, the backend reaches MySQL at `db:3306` — not
> `localhost:3306`. This is why `application.properties` must change its datasource URL when running
> in Docker.

#### Acceptance Criteria

1. THE Docker_Compose_Configuration SHALL define three services: `db`, `backend`, and `frontend`.
2. THE `backend` service SHALL declare `depends_on: db: condition: service_healthy` along with a
   Health_Check on `db` using `interval: 10s`, `timeout: 5s`, `retries: 5`, so the backend
   container starts only after `docker compose ps` reports `db` as `healthy`.
3. THE `frontend` service SHALL declare `depends_on: backend: condition: service_started`,
   ensuring the frontend container starts after the backend container has been created and started.
4. THE `backend` service SHALL receive `SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/sportsLeague_db`
   as an Environment_Variable, overriding the `localhost` datasource URL in `application.properties`.
5. THE Docker_Compose_Configuration SHALL map host port 8080 to container port 8080 for `backend`,
   host port 3000 to container port 80 for `frontend`, and host port 3306 to container port 3306
   for `db`.
6. THE Docker_Compose_Configuration SHALL place all three services on a user-defined bridge network
   named `game-on-network` so containers can reach each other by service name as hostname.
7. THE Docker_Compose_Configuration SHALL read `DB_PASSWORD` and `JWT_SECRET` from a `.env` file
   at the project root via Compose's automatic `.env` loading, and both variables SHALL be listed
   in `.gitignore` so they are never committed to the repository.

---

### Requirement 5: Environment Variable and Secrets Management

**User Story:** As a developer learning secure configuration, I want all sensitive values to be
managed via environment variables and a `.env` file that is excluded from Git, so that I understand
how to keep secrets out of source control.

> **Learning Note — Why not hardcode credentials?**
> Hardcoded passwords in `application.properties` or `docker-compose.yml` get committed to Git.
> Once in Git history, they are effectively public — even if you delete the line later. The `.env`
> pattern keeps secrets in a file that `.gitignore` excludes. CI/CD systems use GitHub Secrets for
> the same purpose.

#### Acceptance Criteria

1. THE Project_Repository SHALL include a `.env.example` file at the project root containing all
   required variable names with placeholder values (e.g., `DB_PASSWORD=changeme`), committed to
   Git as documentation for new developers.
2. THE `.gitignore` file at the project root SHALL include the entry `.env` so that the actual
   secrets file is never committed to the repository.
3. THE `docker-compose.yml` SHALL reference all sensitive values using `${VARIABLE_NAME}`
   variable-substitution syntax, sourcing actual values from the `.env` file via Compose's
   automatic `.env` loading — no credential values shall appear as literals in `docker-compose.yml`.
4. THE Backend_Application SHALL read the JWT signing key from an Environment_Variable named
   `JWT_SECRET` at runtime; WHEN `APP_ENV=local` is set, THE application SHALL fall back to the
   `SECRET_KEY` value in `application.properties` for local development without Docker.
5. IF a variable listed in `.env.example` without a default value is absent at container startup,
   THEN THE affected container SHALL exit with a non-zero exit code and log a message identifying
   the missing variable name within the first 10 seconds of startup.
6. WHEN `JWT_SECRET` is absent or empty at application startup, THE Backend_Application SHALL
   throw a startup exception that prevents the application from starting and logs the message
   `"JWT_SECRET environment variable is required"`.

---

### Requirement 6: Backend CORS Configuration for Containerized Frontend

**User Story:** As a developer, I want the Spring Boot backend to accept requests from the
containerized frontend, so that the React SPA can call the API when both services run in Docker.

> **Learning Note — Why does CORS matter in Docker?**
> Even in Docker Compose, the browser loads the React app from `http://localhost:3000` and makes API
> calls to `http://localhost:8080`. The browser enforces CORS — it blocks requests unless the backend
> explicitly allows the frontend's origin. Container networking does not bypass browser CORS policies.

#### Acceptance Criteria

1. THE Backend_Application SHALL expose a CORS configuration on all paths (`/**`) that reads the
   allowed origin from the `FRONTEND_ORIGIN` Environment_Variable at application startup, and
   allows cross-origin requests from that origin.
2. THE CORS configuration SHALL permit the HTTP methods `GET`, `POST`, `PUT`, `DELETE`, and
   `OPTIONS` from the allowed origins.
3. THE CORS configuration SHALL allow the `Authorization`, `Content-Type`, and `Accept` request
   headers from the allowed origins, with `allowCredentials` set to `true` so browsers include
   the `Authorization` header in cross-origin requests.
4. WHEN `FRONTEND_ORIGIN` is not set or is empty at startup, THE Backend_Application SHALL
   default to allowing `http://localhost:3000` so local development without Docker continues
   to work without any additional configuration.
5. WHEN `FRONTEND_ORIGIN` is set to a value that is not a valid URL (i.e., does not start with
   `http://` or `https://`), THE Backend_Application SHALL log a warning at startup and fall back
   to `http://localhost:3000` rather than crash or silently allow all origins.

---

### Requirement 7: GitHub Actions CI Pipeline

**User Story:** As a developer learning CI/CD, I want a GitHub Actions workflow that automatically
builds and tests both the backend and frontend on every push, so that I understand how to catch
integration errors early without manual effort.

> **Learning Note — What is a CI pipeline?**
> CI (Continuous Integration) means every code push is automatically compiled and tested. If a test
> fails, the developer finds out within minutes, not days. GitHub Actions stores the pipeline as a
> YAML file in the repo itself — no separate CI server to configure.

#### Acceptance Criteria

1. WHEN a `push` or `pull_request` event targets the `main` branch, THE CI_CD_Pipeline defined in
   `.github/workflows/ci.yml` SHALL be triggered automatically.
2. THE CI_CD_Pipeline SHALL include a `build-backend` Workflow_Job that checks out the repository,
   sets up Java 11, and runs `mvn clean verify` with the working directory set to
   `SportsLeagueManagment-backend2`.
3. THE CI_CD_Pipeline SHALL include a `build-frontend` Workflow_Job that checks out the repository,
   sets up Node.js 18, runs `npm ci` inside `league-website`, and runs `npm run build`, treating
   a project with no test files as a passing build rather than an error.
4. THE `build-backend` Workflow_Job SHALL cache the Maven local repository at `~/.m2/repository`,
   keyed on the hash of `SportsLeagueManagment-backend2/pom.xml`, so subsequent pipeline runs
   reuse cached dependencies.
5. THE `build-frontend` Workflow_Job SHALL cache `league-website/node_modules`, keyed on the hash
   of `league-website/package-lock.json`, so subsequent pipeline runs reuse installed packages.
6. IF any step in the `build-backend` Workflow_Job fails, THEN THE pipeline run SHALL be marked
   as failed and the `build-backend` job status SHALL show as failed in the GitHub Actions UI.
7. IF any step in the `build-frontend` Workflow_Job fails, THEN THE pipeline run SHALL be marked
   as failed and the `build-frontend` job status SHALL show as failed in the GitHub Actions UI.
8. THE `build-backend` and `build-frontend` Workflow_Jobs SHALL have no `needs:` dependency on
   each other, so both jobs run in parallel to minimise total pipeline duration.

---

### Requirement 8: GitHub Actions CD Pipeline — Build and Push Docker Images

**User Story:** As a developer learning CD, I want the pipeline to automatically build Docker images
and push them to Docker Hub on every merge to `main`, so that I understand how artifacts are published
and made available for deployment.

> **Learning Note — What is a CD pipeline?**
> CD (Continuous Delivery) takes the tested code from CI and packages it into a deployable artifact.
> For Docker-based systems, that artifact is a Docker_Image pushed to a container registry (Docker Hub).
> Anyone — or any server — can then pull and run that exact image.

#### Acceptance Criteria

1. IF both `build-backend` and `build-frontend` jobs succeed AND the event is a `push` to the
   `main` branch (not a pull_request), THEN THE `docker-build-push` Workflow_Job SHALL run.
2. THE `docker-build-push` Workflow_Job SHALL authenticate to Docker Hub using credentials stored
   as GitHub Secrets named `DOCKER_HUB_USERNAME` and `DOCKER_HUB_TOKEN`.
3. THE `docker-build-push` Workflow_Job SHALL build the backend Docker_Image using
   `SportsLeagueManagment-backend2/Dockerfile` as context and push it tagged as both
   `<DOCKER_HUB_USERNAME>/game-on-backend:latest` and
   `<DOCKER_HUB_USERNAME>/game-on-backend:<7-char-git-sha>`.
4. THE `docker-build-push` Workflow_Job SHALL build the frontend Docker_Image using
   `league-website/Dockerfile` as context and push it tagged as both
   `<DOCKER_HUB_USERNAME>/game-on-frontend:latest` and
   `<DOCKER_HUB_USERNAME>/game-on-frontend:<7-char-git-sha>`.
5. THE `docker-build-push` Workflow_Job SHALL use `cache-from: type=gha` and
   `cache-to: type=gha,mode=max` with the `docker/build-push-action` to reuse cached Docker
   layers from previous pipeline runs.
6. THE CI_CD_Pipeline YAML files SHALL contain no literal Docker Hub credentials; all sensitive
   values SHALL be referenced exclusively via `${{ secrets.DOCKER_HUB_USERNAME }}` and
   `${{ secrets.DOCKER_HUB_TOKEN }}` syntax.
7. IF Docker Hub authentication fails during the `docker-build-push` job, THEN the job SHALL exit
   with a non-zero status code and log an error message identifying the authentication failure
   before attempting any image push.

---

### Requirement 9: Developer `.dockerignore` Files

**User Story:** As a developer learning Docker best practices, I want `.dockerignore` files for both
the backend and frontend, so that I understand how to exclude unnecessary files from Docker build
context and keep builds fast and images small.

> **Learning Note — What is a build context?**
> When you run `docker build`, Docker sends your entire project directory to the Docker daemon. A
> `.dockerignore` file works like `.gitignore` — it tells Docker which files to exclude from that
> transfer. Without it, Docker might send `node_modules` (hundreds of MB) or the Maven `target`
> folder unnecessarily, slowing every build.

#### Acceptance Criteria

1. THE file `SportsLeagueManagment-backend2/.dockerignore` SHALL exclude `target/`, `.git/`,
   `*.md`, `.idea/`, `.settings/`, `.classpath`, and `.project` from the backend Docker build
   context.
2. THE file `league-website/.dockerignore` SHALL exclude `node_modules/`, `build/`, `.git/`,
   `*.md`, and `.env*` from the frontend Docker build context.
3. WHEN a Docker_Image is built for either service, THE total size of the build context sent to
   the Docker daemon SHALL be ≤ 50 MB, verifiable by inspecting the "Sending build context"
   line in the `docker build` output.

---

### Requirement 10: Local Developer Workflow Documentation

**User Story:** As a developer learning this stack, I want a `DOCKER.md` guide that walks through
every step of running the project with Docker, so that I can reproduce the setup independently and
understand what each command does.

> **Learning Note — Documentation is part of the feature.**
> A working pipeline that nobody knows how to use is not done. The guide should explain the *why*
> behind each command, not just the *what*.

#### Acceptance Criteria

1. THE `DOCKER.md` file at the project root SHALL include a Prerequisites section listing:
   Docker Desktop ≥ 4.x, Docker Compose ≥ 2.x, Git, and a Docker Hub account — each with
   a link to its official installation page.
2. THE `DOCKER.md` file SHALL include a Quick Start section with numbered steps: clone the repo,
   copy `.env.example` to `.env`, fill in the values for `DB_PASSWORD`, `MYSQL_ROOT_PASSWORD`,
   `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, and `JWT_SECRET`, then run
   `docker compose up --build`.
3. THE `DOCKER.md` file SHALL include a Service Graph section that lists each service (`db`,
   `backend`, `frontend`), its exposed port, the Docker image it uses, and an explanation of why
   `backend` depends on `db` being healthy and why `frontend` depends on `backend` being started.
4. THE `DOCKER.md` file SHALL include a Troubleshooting section with at least three entries, each
   providing: (a) the observable symptom, (b) a diagnostic command to run, and (c) the corrective
   action — covering MySQL not ready, CORS errors in the browser, and a host port already in use.
5. THE `DOCKER.md` file SHALL include a CI/CD section naming the exact GitHub Secrets to add
   (`DOCKER_HUB_USERNAME`, `DOCKER_HUB_TOKEN`), explaining how to navigate to
   Settings → Secrets → Actions in the GitHub repository UI to add them, and describing the
   observable indicator of a successful pipeline run (green check mark on the Actions tab).
6. WHEN a developer follows the Quick Start steps exactly as written, THEN the application SHALL
   be accessible at `http://localhost:3000` in a browser and the backend health endpoint at
   `http://localhost:8080/swagger-ui/index.html` SHALL return HTTP 200.
