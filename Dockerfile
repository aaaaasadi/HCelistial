# Multi-stage Dockerfile for TravelRescue Full Stack

# Stage 1: Build the frontend bundle
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5001

COPY package*.json ./
RUN npm ci --omit=dev && npm install -g tsx

# Copy source, migrations, and built frontend assets
COPY server ./server
COPY docs ./docs
COPY --from=frontend-builder /app/dist ./dist

EXPOSE 5001

# Run migrations and start server
CMD ["tsx", "server/index.ts"]
