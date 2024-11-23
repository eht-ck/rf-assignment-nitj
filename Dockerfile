# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the contents of the src directory to the container
COPY src/ ./src

# Copy the public directory to the container
COPY public/ ./public

# Expose the port the app will run on
EXPOSE 3000

# Set environment variable for production (optional)
ENV NODE_ENV=production

# Command to run the app
CMD ["node", "src/app.js"]
