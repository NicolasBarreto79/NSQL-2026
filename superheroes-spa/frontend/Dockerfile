FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL
ENV DOCKER_PREVIEW_BUILD=1

COPY . .
RUN npm run build
ENV NODE_ENV=production

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
