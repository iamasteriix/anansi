FROM node:24-slim AS development
WORKDIR /app

# copy root manifests for workspace caching
COPY package*.json              ./
COPY apps/server/package*.json  ./apps/server/

RUN npm i

# copy rest
COPY .  .

EXPOSE 5002
