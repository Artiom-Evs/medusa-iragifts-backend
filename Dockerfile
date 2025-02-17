FROM node:22-alpine

WORKDIR /app/medusa
EXPOSE 9000

COPY package*.json .
COPY yarn.* .
RUN yarn install

COPY . .
RUN yarn build

CMD ["yarn", "start"]
