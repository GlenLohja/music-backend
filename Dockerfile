# Use a Node.js base image
FROM node:18



# Define ARGs
ARG DB_HOST_SUPERBASE
ARG DB_PORT
ARG DB_DATABASE
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_TYPE
ARG PORT

# Use ARGs in ENV
ENV DB_HOST_SUPERBASE=${DB_HOST_SUPERBASE}
ENV DB_PORT_SUPERBASE=${DB_PORT_SUPERBASE}
ENV DB_DATABASE_SUPERBASE=${DB_DATABASE_SUPERBASE}
ENV DB_USER_SUPERBASE=${DB_USER_SUPERBASE}
ENV DB_PASSWORD_SUPERBASE=${DB_PASSWORD_SUPERBASE}
ENV DB_TYPE=${DB_TYPE}
ENV PORT=${PORT}

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


# Expose the port your app will run on
EXPOSE 8080


ENV PORT=8080

# Start the application
CMD ["npm", "start"]