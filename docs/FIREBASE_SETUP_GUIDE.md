# Guide de Configuration Firebase pour FanLink AI

Ce document explique en détail l'architecture, la configuration et le déploiement de Firebase (Authentication, Cloud Firestore, Firebase Storage et Security Rules).

---

## 1. Projet & Identifiants Actuels

Le projet Firebase configuré pour cette instance est provisionné avec les paramètres suivants dans `firebase-applet-config.json` :

- **Project ID** : `pivotal-city-x5v9p`
- **Firestore Database ID** : `ai-studio-fanlinkai-d38c311b-95aa-48d5-a629-e325a73f8aef`
- **Storage Bucket** : `pivotal-city-x5v9p.firebasestorage.app`
- **Auth Domain** : `pivotal-city-x5v9p.firebaseapp.com`

---

## 2. Authentification Firebase

### Méthodes d'authentification activées :
1. **Google Sign-In via Popup** (`signInWithPopup(auth, new GoogleAuthProvider())`) :
   Recommandé dans les environnements intégrés et iFrames.
2. **Email & Mot de passe** (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`) :
   Permet l'inscription directe avec validation de mot de passe fort côté client et hachage cryptographique sécurisé par Firebase (jamais de mot de passe en clair).
3. **Réinitialisation de mot de passe** (`sendPasswordResetEmail`).

### Activation dans la console Firebase :
1. Ouvrez la [Console Firebase](https://console.firebase.google.com).
2. Rendez-vous dans **Build > Authentication > Sign-in method**.
3. Assurez-vous que **Google** et **Email/Password** sont activés.
4. Dans **Authorized domains**, ajoutez votre domaine de production.

---

## 3. Schéma Firestore (`firebase-blueprint.json`)

Toutes les collections respectent le modèle intermédiaire défini dans `firebase-blueprint.json` :

- `/users/{userId}` : Profils publics (nom, pseudonyme, type de compte, bio, badge).
- `/users/{userId}/private/info` : PII isolée et solde financier privé.
- `/posts/{postId}` : Publications sociales avec métadonnées et compteurs.
- `/posts/{postId}/comments/{commentId}` : Sous-collection de commentaires.
- `/conversations/{convId}` & `/messages/{messageId}` : Messagerie chiffrée.
- `/verificationRequests/{reqId}` : Dossiers de candidature au badge officiel.
- `/reports/{reportId}` : Signalements de modération.
- `/transactions/{txId}` : Registre immuable des flux financiers.

---

## 4. Règles de Sécurité (`firestore.rules`)

Les règles appliquent les 8 piliers Zero-Trust ABAC :
- Interdiction totale par défaut (`match /{document=**} { allow read, write: if false; }`).
- Protection contre l'auto-attribution de badges officiels ou de soldes.
- Isolation stricte des données PII et du solde dans la sous-collection `/private/`.
- Validation stricte des clés et des longueurs maximales de chaînes.
- Déploiement automatisé via l'outil RPC de la plateforme.
