FROM node:20-bullseye-slim

WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN npm install
RUN npm run prisma:generate

COPY . .

RUN npm run build

RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 4000

CMD ["/app/docker-entrypoint.sh"]
