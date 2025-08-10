# 1. Base image for installing dependencies
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json ./
COPY prisma ./prisma # Copy the entire prisma directory
RUN npm install --frozen-lockfile

# 2. Builder image for building the application
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Runner image for running the application
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy the standalone Next.js server output
COPY --from=builder /app/.next/standalone ./
# Copy the public assets
COPY --from=builder /app/public ./public
# Copy the static assets
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

# Start the Next.js server
CMD ["node", "server.js"]