# Use Node.js LTS image as base
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose port 5173 for Vite dev server
EXPOSE 5173

# Start development server
CMD ["pnpm", "run", "dev"]
