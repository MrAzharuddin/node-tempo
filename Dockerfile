FROM node:slim
RUN mkdir -p /app
WORKDIR . /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 8080 80
CMD [ "npm", "run", "with-http-tracer" ]