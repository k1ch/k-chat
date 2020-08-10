FROM node:12.18.2

COPY . /app
RUN cd /app && npm run pre-start

ENV NODE_ENV= \
  RABBITMQ_CONNECTION= \
  PG_DB_CONNECTION= \
  APP_PORT=

WORKDIR /app
EXPOSE 9000
EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start" ]
