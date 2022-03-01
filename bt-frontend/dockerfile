FROM node:latest
WORKDIR /app
COPY package.json ./
COPY yarn.lock /app
RUN yarn install
COPY . .
CMD ["npm", "start"]