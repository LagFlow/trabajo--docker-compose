from node:24-alpine as build
workdir /app
copy . .
run npm install
run npm run build

from nginx:alpine as prod
copy --from=build /app/dist /usr/share/nginx/html
expose 80
entrypoint ["nginx", "-g", "daemon off;"]

