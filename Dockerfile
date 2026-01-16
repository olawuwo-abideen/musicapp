# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build NestJS app
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the dist folder from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
