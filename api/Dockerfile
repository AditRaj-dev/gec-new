# Multi-stage Dockerfile for NestJS API on Render
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json tsconfig*.json nest-cli.json ./
RUN npm ci

# Copy source files and build
COPY src ./src
COPY database ./database
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built distribution from builder
COPY --from=builder /app/dist ./dist

# Security: run as non-root user
USER node

EXPOSE 4000

CMD ["node", "dist/src/main"]
