FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm install

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

RUN npm install --production

EXPOSE 3000

CMD ["node", "dist/index.js"]
