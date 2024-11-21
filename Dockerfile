# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy the rest of the source code
COPY . .

# Build TypeScript code
RUN npm run build

# Remove development dependencies for production
RUN npm prune --production

# Expose the port your app will run on
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the application
CMD ["npm", "start"]