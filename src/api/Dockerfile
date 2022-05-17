FROM node:14
RUN mkdir /home/api
WORKDIR /home/api
ADD ./* /home/api/
RUN npm install mongoose express cors body-parser csv-parser dotenv express-fileupload --save-dev 
EXPOSE 4000
ENTRYPOINT ["node", "index.js"]
