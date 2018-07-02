FROM node:8.11.3-alpine
ARG APP_NAME

RUN mkdir -p app/logs

ADD ./dist app/dist
ADD ./.${APP_NAME}rc app/.${APP_NAME}rc
ADD ./package.json app/package.json
ADD ./package-lock.json app/package-lock.json

WORKDIR app

ENV NODE_ENV=production
RUN ["npm", "install"]
CMD [ "npm", "start" ]
