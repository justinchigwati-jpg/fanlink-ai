# Matrice d'État Opérationnel des Fonctionnalités — FanLink AI

Ce document fournit un inventaire rigoureux et transparent des fonctionnalités immédiatement opérationnelles et de celles qui nécessitent des configurations de clés externes ou de comptes marchands tiers.

---

## 1. Fonctionnalités Pleinement Opérationnelles

| Fonctionnalité | Statut | Détails d'implémentation |
|---|---|---|
| **Interface Utilisateur & Navigation PWA** | ✅ **Opérationnel** | Responsive mobile/tablette/PC, onglets validés, bouton d'installation in-app, manifest PWA et icône officielle. |
| **Authentification Utilisateur** | ✅ **Opérationnel** | Firebase Auth (Google Sign-In, Email/Mot de passe, Réinitialisation de mot de passe, sessions sécurisées). |
| **Base de données Firestore** | ✅ **Opérationnel** | Provisionnée avec ID de base de données dédié, blueprint structuré et règles ABAC déployées. |
| **Fil d'actualité & Publications** | ✅ **Opérationnel** | Création de post avec média photo/vidéo réel, J'aime, Commentaires, Partage et Favoris. |
| **Espace Stars & Classements** | ✅ **Opérationnel** | Annuaire complet, filtres par niche, podium des créateurs les plus suivis, abonnements gratuits. |
| **Messagerie Privée** | ✅ **Opérationnel** | Discussions temps réel, horodatage, messages payants avec paywall interactif, blocage et signalement. |
| **Cadeaux Virtuels & Confettis** | ✅ **Opérationnel** | Catalogue de 5 cadeaux officiels, solde décrémenté, confettis visuels, enregistrement de transaction. |
| **Modèle 80/20 & Rémunération** | ✅ **Opérationnel** | Calcul exact de la part créateur (80%) et de la commission plateforme (20%), seuil minimum de retrait vérifié. |
| **Administration & Modération** | ✅ **Opérationnel** | Espace réservé (justinchigwati@gmail.com), approbation/rejet de badges officiels, modération des signalements, journal d'audit. |
| **Internationalisation & Multi-devises** | ✅ **Opérationnel** | FR, EN, ES, PT et conversions monétaires réelles EUR, USD, GBP, XOF (FCFA), ZAR, KES. |
| **FanLink AI Studio** | ✅ **Opérationnel** | Intégration côté serveur de Google Gemini 3.8 Flash (`@google/genai`) avec fallback gracieux si la clé est absente. |

---

## 2. Fonctionnalités Requérant des Clés ou Comptes Marchands Externes

| Service Externe | Prérequis pour passage en production réelle | Impact actuel dans l'application |
|---|---|---|
| **Orange Money / MTN MoMo / Airtel / M-Pesa** | Signature d'un contrat marchand avec les opérateurs télécoms respectifs pour obtenir les clés API et webhooks de production. | L'architecture de paiement, l'idempotence et les endpoints de validation sont en place ; en dev, les recharges simulent la confirmation bancaire. |
| **Cartes Bancaires (Stripe)** | Compte Stripe activé avec clé secrète `STRIPE_SECRET_KEY` configurée dans les variables d'environnement. | Prêt à brancher le SDK Stripe. |
| **Diffusion Vidéo Live (CDN RTMP / WebRTC)** | Cluster de serveurs de streaming vidéo dédié (ex: AWS IVS, Agora.io, Mux ou LiveKit). | L'application affiche en toute transparence que le pipeline WebRTC est en cours de déploiement CDN tout en maintenant le chat et les cadeaux opérationnels. |
| **Notifications Push Mobiles (FCM)** | Certificat APNs Apple et configuration FCM dans la console Firebase pour les notifications en arrière-plan fermé. | Les notifications in-app sont actives dans l'interface. |
