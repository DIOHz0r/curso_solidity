FROM node/lts-alpine as builder
COPY package.json yarn.lock /app/
RUN yarn install

FROM node/lts-alpine
COPY --from=builder /app/node_modules /app/node_modules
COPY . /app/

EXPOSE 3000
