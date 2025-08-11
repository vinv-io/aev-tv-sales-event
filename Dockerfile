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

# Copy environment file for production build
COPY .env.prod .env.prod

# Generate Prisma client
RUN npx prisma generate

# Build the application using production environment
RUN npx dotenv -e .env.prod -- npm run build

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

# Copy the built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma files for database operations
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Copy production environment file
COPY --from=builder --chown=nextjs:nodejs /app/.env.prod ./.env.prod

# Create cache directory with proper permissions
RUN mkdir -p /app/.next/cache && chown -R nextjs:nodejs /app/.next/cache
RUN chown -R nextjs:nodejs /app/node_modules

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use dotenv to load production environment and start the server
CMD ["npx", "dotenv", "-e", ".env.prod", "--", "node", "server.js"]
