FROM node:alpine

ARG APP_DIR=./home/test
WORKDIR ${APP_DIR}

COPY package*.json ./
RUN npm install

COPY . .

RUN adduser -D test
USER test
EXPOSE 3030

CMD ["npm", "run", "start"]
