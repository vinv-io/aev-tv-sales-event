# 1. Dependencies stage
FROM node:23-alpine AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile

# 2. Builder stage
FROM node:23-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Copy environment file
COPY .env .env

# Generate Prisma client
RUN npx prisma generate

# Debug: Show environment and setup
RUN echo "Node version: $(node --version)" && echo "NPM version: $(npm --version)"

# Build the application using environment variables
RUN npm run build

# Debug: List .next directory contents
RUN ls -la /app/.next/ || echo ".next directory not found"

# Ensure .next directory exists and create missing files if needed
RUN mkdir -p /app/.next
RUN [ ! -f /app/.next/prerender-manifest.json ] && echo '{"version":4,"routes":{},"dynamicRoutes":{},"notFoundRoutes":[],"preview":{"previewModeId":"development","previewModeSigningKey":"development","previewModeEncryptionKey":"development"}}' > /app/.next/prerender-manifest.json || true
RUN [ ! -f /app/.next/routes-manifest.json ] && echo '{"version":3,"pages404":true,"basePath":"","redirects":[],"rewrites":[],"headers":[],"staticRoutes":[],"dynamicRoutes":[],"fallbackRoutes":[]}' > /app/.next/routes-manifest.json || true

# Debug: Verify files were created
RUN ls -la /app/.next/prerender-manifest.json /app/.next/routes-manifest.json || echo "Manifest files missing"

# Ensure proper permissions for node_modules
RUN chown -R 1001:1001 /app/node_modules

# 3. Runner stage
FROM node:23-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install sharp for image optimization
RUN npm install sharp

# Copy the built application and all dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy Prisma files for database operations
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Copy environment file
COPY --from=builder --chown=nextjs:nodejs /app/.env ./.env

# Create cache directory with proper permissions
RUN mkdir -p /app/.next/cache && chown -R nextjs:nodejs /app/.next/cache
RUN chown -R nextjs:nodejs /app/node_modules
RUN chown -R nextjs:nodejs /app/.next
RUN chown -R nextjs:nodejs /app/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start Next.js server
CMD ["npx", "next", "start"]

