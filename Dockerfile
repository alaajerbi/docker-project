FROM node
WORKDIR /usr/src/app
COPY app/* ./
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
