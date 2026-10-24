# FanLink AI — Plateforme Sociale Internationale

FanLink AI est une application web progressive (PWA) et une plateforme sociale internationale de nouvelle génération qui connecte les fans, les créateurs de contenu, les artistes, les sportifs et les personnalités publiques.

---

## 🌟 Fonctionnalités Principales

1. **Accueil & Fil d'Actualité Interactif**
   - Fil vertical fluide avec photos, textes et vidéos
   - Onglets « Pour toi » et « Abonnements »
   - Interactions temps réel : J'aime, Commentaires, Partage (WhatsApp, Telegram, Web Share) et Favoris
   - Accès aux contenus exclusifs déblocables contre des FanCoins

2. **Espace Stars & Classements Réels**
   - Annuaire de créateurs par catégorie (Musique, Sport, Art & Design, Gaming)
   - Classements authentiques (Top créateurs basés sur les données réelles)
   - Abonnements gratuits et souscriptions VIP
   - Formulaire officiel de demande de badge de certification (processus de modération humaine non automatique)

3. **Messagerie Privée & Contenus Payants**
   - Discussions privées chiffrées entre fans et créateurs
   - Messages payants exclusifs des stars vérifiés côté serveur avant déblocage (protection anti-fraude)
   - Outils de blocage et de signalement de comportements inappropriés

4. **Directs (Live Streaming) & Cadeaux Virtuels**
   - Espace de diffusion en direct avec compteur de spectateurs et chat instantané
   - Catalogue officiel de cadeaux virtuels (Rose Émeraude, Étoile FanLink, Flamme d'Or, Trophée Champion, Couronne VIP)
   - Célébration visuelle avec confettis lors des envois
   - Déduction de solde sécurisée côté serveur et protection anti-double dépense

5. **Monétisation Créateur (80/20)**
   - Tableau de bord financier : solde disponible, compensation en attente, historique
   - Rémunération transparente : 80% au créateur / 20% commission plateforme
   - Demandes de virement avec conformité KYC (compte vérifié obligatoire et seuil min de 50 €)

6. **Couche de Paiement Internationale & Mobile Money**
   - Support des moyens de paiement africains et internationaux : Orange Money, MTN MoMo, Airtel Money, Vodacom M-Pesa, Carte Bancaire (Visa/Mastercard) et PayPal
   - Multi-devises réelles : EUR (€), USD ($), GBP (£), XOF (FCFA), ZAR (R), KES (KSh)

7. **FanLink AI Studio (Google Gemini 3.8 Flash)**
   - Génération de légendes captivantes adaptées au ton du créateur
   - Suggestion de hashtags viraux pertinents
   - Proposition d'idées de contenu et de thèmes de direct
   - Traduction multilingue instantanée (Français, Anglais, Espagnol, Portugais, Swahili, Arabe)
   - Clés API protégées côté serveur (aucun secret exposé au client)

8. **Administration & Modération Sécurisée (ABAC)**
   - Rôles attribués exclusivement côté serveur
   - Examen et validation des demandes de badge officiel
   - Traitement des signalements abusifs et modération des publications
   - Journal d'audit complet

9. **PWA Mobile-First & Hors Ligne**
   - Installable sur Android, iOS (iPhone/iPad), tablettes et ordinateurs
   - Bouton d'installation in-app avec guide spécifique iOS Safari
   - Détection de l'état de connexion et indicateur hors ligne

---

## 🚀 Installation & Démarrage Rapide

```bash
# 1. Cloner et installer les dépendances
npm install

# 2. Configurer les variables d'environnement dans .env
# GEMINI_API_KEY=...

# 3. Lancer le serveur Full-Stack de développement (Port 3000)
npm run dev
```

L'application est accessible à l'adresse : `http://localhost:3000`

---

## 📚 Guides et Documentation Détaillée

- [Guide de Configuration Firebase](./docs/FIREBASE_SETUP_GUIDE.md)
- [Guide des Prestataires de Paiement (Mobile Money, Cartes, PayPal)](./docs/PAYMENT_PROVIDERS_GUIDE.md)
- [Guide de Déploiement Cloud & Production](./docs/DEPLOYMENT_GUIDE.md)
- [Guide de Migration Mobile Native (Android & iOS)](./docs/MOBILE_NATIVE_MIGRATION_GUIDE.md)
- [Matrice d'État Opérationnel](./docs/OPERATIONAL_STATUS.md)
