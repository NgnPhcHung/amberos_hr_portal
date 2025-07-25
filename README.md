Navigate to server

run
```bash 
cp env.example .env

```
then run docker compose to build docker image

```bash 
docker-compose up -d 
```

after docker build, execute
```bash
pnpm prisma migrate dev
```

then 
```bash
pnpm start:dev
```
---------------


Navigate to client

run
```bash
pnpm dev
```
