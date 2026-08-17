FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/templates/app.conf
COPY --from=build /app/dist /usr/share/nginx/html
ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "sed \"s/LISTEN_PORT/${PORT}/g\" /etc/nginx/templates/app.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
