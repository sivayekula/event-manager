FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
ENV NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
CMD ["npm", "start"]