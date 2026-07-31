# 1. Frontend Build Stage
FROM node:22-alpine AS frontend-build

WORKDIR /app

# 실제 폴더명인 report-automation-frontend 경로 지정
COPY report-automation-frontend/package.json report-automation-frontend/package-lock.json* ./
RUN npm install

COPY report-automation-frontend/ ./
RUN chmod +x node_modules/.bin/*
RUN npm run build

# 2. Nginx Runtime Stage
FROM nginx:1.27-alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]