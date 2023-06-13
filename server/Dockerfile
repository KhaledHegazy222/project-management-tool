FROM node:16

WORKDIR /app

COPY package.json yarn.lock* ./

RUN yarn

COPY ./ ./ 

CMD [ "npx yarn start" ]