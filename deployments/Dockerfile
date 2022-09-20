# build environment
FROM node:16-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN apk add --no-cache python3 py3-pip make g++
RUN corepack enable
RUN yarn install
COPY . /app
RUN yarn run build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./deployments/nginx.conf /etc/nginx/conf.d
EXPOSE 8002
CMD ["nginx", "-g", "daemon off;"]