FROM node:16 as development

WORKDIR /app

COPY package.json yarn.lock* ./

RUN yarn

COPY entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh

COPY ./ ./

EXPOSE 3000

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]


FROM node:16 as builder

WORKDIR /app

COPY package.json yarn.lock* ./

RUN yarn

COPY ./ ./

RUN yarn run build

FROM nginx:1.25.0-alpine as production

COPY --from=builder /app/dist /var/html/

EXPOSE 3000

ENTRYPOINT [ "nginx","-g","daemon off;" ]
