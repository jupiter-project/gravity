FROM node:9
WORKDIR /apps/gravity
ADD package.json /apps/gravity
RUN npm install
COPY . .
CMD ["npm", "start"]
EXPOSE 4000
