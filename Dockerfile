FROM node:24-slim AS development
WORKDIR /app

# copy root manifests for workspace caching
COPY package*.json              ./
COPY apps/server/package*.json  ./apps/server/
COPY apps/web/package*.json     ./apps/web/

RUN npm i

# copy rest
COPY apps/server/  ./apps/server/
COPY apps/web/     ./apps/web/

EXPOSE 5002 3002
