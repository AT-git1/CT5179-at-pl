# Use the Node.js version 22.5.1 image
FROM node:22.5.1

# Install chromium browser
RUN apt-get update \
    && apt-get install -y chromium \
    && apt-get clean

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for both client and backend
COPY client/package*.json ./client/
COPY backend/package*.json ./backend/

# Skip puppeteer installation of chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

# Install dependencies for the backend
WORKDIR /usr/src/app/backend
RUN npm install

# Install dependencies for the client/frontend
WORKDIR /usr/src/app/client
RUN npm install

# Copy the rest of the application code
WORKDIR /usr/src/app
COPY . .

# Expose the ports the app runs on
EXPOSE 3000
EXPOSE 3001

# Define environment variables
ARG SERVICE
ENV SERVICE=${SERVICE}

# Use nodemon for development
CMD ["sh", "-c", "npm run ${SERVICE}"]
