# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY .env .env
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]