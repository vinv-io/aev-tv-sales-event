# 1. Base image for dependencies
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma # Copy schema.prisma for Prisma client generation
RUN npm install --frozen-lockfile
COPY prisma ./prisma
RUN npx prisma generate

# 2. Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/prisma ./prisma
COPY . .
RUN npm run build

# 3. Runner stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
