# Guide de Déploiement en Production

Ce guide détaille les étapes pour compiler, tester et déployer l'application FanLink AI sur Google Cloud Run ou tout environnement conteneurisé.

---

## 1. Processus de Build

L'application FanLink AI est une application Full-Stack TypeScript combinant un front-end React avec un serveur Node.js Express.

```bash
# 1. Compiler les fichiers front-end (Vite)
npm run build

# 2. Vérifier la conformité du code TypeScript
npm run lint
```

Les fichiers compilés du front-end sont générés dans le dossier `dist/`.

---

## 2. Déploiement sur Google Cloud Run

Un fichier `Dockerfile` standard peut être utilisé pour packager l'application :

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/firebase-applet-config.json ./

EXPOSE 3000
CMD ["npx", "tsx", "server.ts"]
```

### Commande de déploiement gcloud :
```bash
gcloud run deploy fanlink-ai \
  --source . \
  --region europe-west3 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production"
```

---

## 3. Variables d'Environnement en Production

| Variable | Description |
|---|---|
| `NODE_ENV` | Doit être fixé à `production` |
| `PORT` | Port d'écoute du serveur Express (défaut : 3000) |
| `GEMINI_API_KEY` | Clé d'API Google Gemini pour l'assistant IA |
| `APP_URL` | URL publique de l'application |
