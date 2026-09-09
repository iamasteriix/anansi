FROM node:24-slim AS development
WORKDIR /app
COPY package*.json                      ./
COPY apps/server-upload/package*.json   ./apps/server-upload/
COPY apps/server-query/package*.json    ./apps/server-query/
RUN npm i
COPY apps/server-upload/   ./apps/server-upload/
COPY apps/server-query/    ./apps/server-query/
EXPOSE 5003 5103
