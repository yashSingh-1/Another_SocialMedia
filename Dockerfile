# Use an official Node.js runtime as the base image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Install `serve` globally to serve the app in the next stage
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Start the application using `serve`
CMD ["serve", "-s", ".", "-l", "3000"]

