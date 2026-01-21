# =====================================================
# Dockerfile Frontend Ooryxx - Simplifié
# =====================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Copier package files
COPY package*.json ./

# Installer les dépendances
RUN npm ci --legacy-peer-deps

# Copier le code source
COPY . .

# Variables d'environnement pour le build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build
RUN npm run build

# Stage production avec Nginx
FROM nginx:alpine

# Copier la config nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copier le build
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
