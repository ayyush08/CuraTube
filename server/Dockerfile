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



WORKDIR /app

# Copy production node_modules and app from builder
COPY --from=builder /app /app

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/index.js"]
