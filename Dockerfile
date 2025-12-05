FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
