# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install typescript globally
RUN npm install -g typescript

# Copy the source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port (if needed)
EXPOSE 8080

# Start the application
CMD ["node", "dist/server.js"]