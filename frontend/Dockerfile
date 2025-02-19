# Use an official Node.js image for building the frontend
FROM node:18 as build

WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the React application
RUN npm run build

# Use an nginx image to serve the build
FROM nginx:stable-alpine

# Copy the build output to nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for serving the app
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]