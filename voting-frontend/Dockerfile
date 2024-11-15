# Step 1: Build the React app
FROM node:18 AS build
# Set the environment variable to use the legacy OpenSSL provider
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app

COPY package.json ./
RUN npm install
RUN npm install chart.js react-chartjs-2

# RUN npm install --save-dev @babel/plugin-proposal-class-properties
# #RUN npm install react-scripts

#COPY package.json package-lock.json ./
COPY . .
RUN npm run build

# Step 2: Serve the React app with a lightweight web server
FROM nginx:alpine

# Copy the build files from the previous step
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
