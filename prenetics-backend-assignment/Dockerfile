# Build and test
FROM node:18-alpine as build

# Copy source code
WORKDIR /home/node/app
COPY package.json /home/node/app/
COPY package-lock.json /home/node/app/

# Install all dependencies.
RUN npm ci

COPY tsconfig.json /home/node/app/
COPY tslint.json /home/node/app/
COPY src /home/node/app/src
COPY test /home/node/app/test
COPY .env.test /home/node/app/.env.test

RUN npm run build

# Deployment
FROM node:18-alpine as deployment

# Build
WORKDIR /var/www/html/api

# Setting UTC time
RUN apk add --no-cache tzdata && \
  cp /usr/share/zoneinfo/UTC /etc/localtime && \
  echo UTC > /etc/timezone

# COPY production dependencies and code
COPY --from=build /home/node/app/package.json /var/www/html/api
COPY --from=build /home/node/app/package-lock.json /var/www/html/api
COPY --from=build /home/node/app/dist /var/www/html/api/dist

RUN npm ci --only=production

# Using the default port
EXPOSE 8080

ENV NODE_ENV=production
CMD [ "node", "--max-old-space-size=2048", "dist/index.js" ]
