FROM node:lts-alpine
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 8080
CMD ["yarn", "run", "serve"]