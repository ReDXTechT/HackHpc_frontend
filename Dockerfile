#FROM node:16-alpine as build
#
#WORKDIR /app
#COPY package*.json ./
#RUN npm install --legacy-peer-deps
#COPY . .
#RUN npm run prod
#
#FROM nginx:latest
#COPY --from=build /app/dist/main/ /usr/share/nginx/html/
#EXPOSE 80
#
# Stick with Node.js 16 which is compatible with Angular 16
FROM node:16-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, respecting legacy peer dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of your application
COPY . .

# Build your application
RUN npm run prod

# Use the latest stable nginx image
FROM nginx:stable

# Copy built assets from the build stage to nginx
COPY --from=build /app/dist/fuse/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80
