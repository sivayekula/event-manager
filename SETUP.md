# SETUP

## Prerequisites
- Node.js 18+ and npm

## 1) Start the GraphQL Server
```bash
cd server
npm install
npm run dev
```
The server runs at **http://localhost:4000/graphql** and seeds demo data on boot.

## 2) Start the Next.js App
Open a new terminal:
```bash
cd web
npm install
npm run dev
```
The app runs at **http://localhost:3000**.

> Ensure `NEXT_PUBLIC_GRAPHQL_URL` points to your server (defaults to `http://localhost:4000/graphql`).

## Production Builds
```bash
# server
cd server && npm run build && npm start

# web
cd web && npm run build && npm start
```

## Docker (Optional)
Build and run:
```bash
# Server
cd server
docker build -t mini-event-server .
docker run -p 4000:4000 mini-event-server

# Web
cd web
docker build -t mini-event-web .
docker run -p 3000:3000 -e NEXT_PUBLIC_GRAPHQL_URL=http://host.docker.internal:4000/graphql mini-event-web
```