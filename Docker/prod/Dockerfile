# Use the Node.js version 22.5.1 image
FROM node:22.5.1

# Install chromium browser
RUN apt-get update \
    && apt-get install -y chromium

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Skip puppeteer installation of chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000
EXPOSE 3001

# Define environment variables
ARG SERVICE
ENV SERVICE=${SERVICE}

# Use nodemon for development
CMD ["sh", "-c", "npm run ${SERVICE}"]
