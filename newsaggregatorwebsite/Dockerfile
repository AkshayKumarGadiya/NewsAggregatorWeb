FROM node:alpine

WORKDIR /app

COPY ./newsaggregatorwebsite/package.json ./
COPY ./newsaggregatorwebsite/package-lock.json ./
RUN npm install --silent

COPY ./ ./

CMD ["npm", "start"]