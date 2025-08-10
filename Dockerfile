# 1. Base image for installing dependencies
FROM node:22-alpine AS base
WORKDIR /app

# Copy only files needed for install
COPY package.json package-lock.json* ./ 
COPY prisma ./prisma
RUN npm ci --omit=dev  # or npm install --frozen-lockfile for Yarn/Pnpm equivalent

# 2. Builder image
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Runner image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
