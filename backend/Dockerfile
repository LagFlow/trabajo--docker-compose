from node:24-alpine as build
workdir /app
copy . .
run npm install
run npm run build

from node:24-alpine as prod
workdir /app
copy --from=build /app/dist .
copy --from=build /app/package*.json .
run npm install
expose 3000
entrypoint ["node", "main.js"]

