# Usa una imagen oficial de Node para construir la app
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Usa nginx para servir el contenido estático
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# ✅ Copiamos configuración personalizada
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
