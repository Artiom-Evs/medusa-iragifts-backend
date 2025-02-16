FROM node:22-alpine

WORKDIR /app/medusa
EXPOSE 9000

COPY package*.json .
COPY yarn.* .
RUN yarn install

COPY . .
RUN yarn build

# quick fix the bug with starting production build  in Medusa.JS v2.5.0
RUN ln -s .medusa/server/public/ public

CMD ["yarn", "start"]
