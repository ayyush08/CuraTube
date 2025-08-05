# ---------- Stage 1: Builder ----------
FROM node:20-slim AS builder

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy rest of the app
COPY . .

# ---------- Stage 2: Final Image ----------
FROM node:20-slim AS runner

# Install ffmpeg (static build, minimal deps)
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl xz-utils ca-certificates && \
    curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz | tar -xJ && \
    mv ffmpeg-*-static/ffmpeg /usr/local/bin/ && \
    mv ffmpeg-*-static/ffprobe /usr/local/bin/ && \
    chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe && \
    rm -rf ffmpeg-*-static && \
    apt-get purge -y curl xz-utils && \
    apt-get autoremove -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy production node_modules and app from builder
COPY --from=builder /app /app

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/index.js"]
