FROM node:18-alpine
WORKDIR /app
ENV PORT 3000
COPY . .
COPY .env .env
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "start"]