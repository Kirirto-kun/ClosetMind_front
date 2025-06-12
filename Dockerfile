# -------- Build stage --------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy the rest of the application code
COPY . .

# Build Next.js application
RUN npm run build

# -------- Production stage --------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

# Install production dependencies only
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

EXPOSE 3000

CMD ["npm", "start"] 