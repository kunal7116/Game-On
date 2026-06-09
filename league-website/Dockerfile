# =============================================================
# Stage 1: builder
# Uses Node 18 Alpine to install dependencies and produce the
# production-optimised static build artifacts.
# Node.js is NOT present in the final image.
# =============================================================
FROM node:18-alpine AS builder

WORKDIR /app

# --- Dependency-caching trick ---
# Copy only the package manifest files first.
# Docker caches this layer separately from the source code.
# If you change only a .js file, npm ci is NOT re-run on the
# next build — saving several minutes every time.
COPY package.json package-lock.json ./

# npm ci installs EXACT versions from package-lock.json,
# unlike npm install which may upgrade within ranges.
# This guarantees reproducible builds.
RUN npm ci

# Now copy the rest of the application source.
COPY . .

# Build the production bundle.
# Output goes to /app/build — plain HTML, CSS, and JS files.
# No Node.js runtime is needed to serve them.
RUN npm run build

# =============================================================
# Stage 2: runtime
# Uses the official Nginx Alpine image (~25 MB).
# Only the compiled static files are copied from stage 1.
# =============================================================
FROM nginx:stable-alpine AS runtime

# Remove the default Nginx welcome page.
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled React assets from the builder stage.
COPY --from=builder /app/build /usr/share/nginx/html

# Copy our custom Nginx config that handles React Router routing.
# This file adds "try_files $uri /index.html" so that direct
# navigation to /city or /admin-home works correctly.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Document that the container listens on port 80.
EXPOSE 80

# Nginx's default CMD starts the server in the foreground.
# No custom CMD is needed.
