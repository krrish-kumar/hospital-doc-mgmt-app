# Use official Node.js LTS image as base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (backend listens on 5000)
EXPOSE 5000

# Start the application (using nodemon for development or node for production)
CMD [ "npm", "start" ]