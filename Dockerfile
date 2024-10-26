# Étape 1: Installer les dépendances
FROM node:16-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Étape 2: Compiler l'application Next.js
FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Étape 3: Préparer l'image pour le serveur de production
FROM node:16-alpine AS runner
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour le déploiement
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

ENV NODE_ENV production

EXPOSE 3000

# Démarrer l'application Next.js en mode production
CMD ["npm", "start"]
