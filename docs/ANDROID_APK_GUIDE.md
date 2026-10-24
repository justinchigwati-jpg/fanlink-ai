# FanLink AI — Guide d'Exportation & Génération de l'APK Android

Ce document détaille la nature technique du projet FanLink AI, la méthode pour télécharger et ouvrir le code source sur Android, ainsi que les démarches pour compiler et générer un véritable fichier installable **`.apk`**.

---

## 1. Nature du Projet : Application Web vs React Native / Expo

### Réponse officielle :
Le projet **FanLink AI est une Application Web Moderne Full-Stack (React 19 + TypeScript + Vite + Tailwind CSS v4)** complétée par un serveur backend Node.js / Express (`server.ts`) et une architecture **PWA (Progressive Web App)** complète.

**Ce n'est PAS un projet Expo ou React Native.**
- Le projet n'utilise pas le moteur React Native ni les composants natifs JSX `<View>` / `<Text>`.
- Le projet utilise le DOM web standard (`react-dom`), des animations ultra-rapides, et un design mobile-first respectant au pixel près l'identité sombre & vert émeraude officielle.

### Pourquoi ce choix est idéal :
1. **Multiplateforme immédiat** : Fonctionne instantanément sur Android, iOS, tablette et ordinateur de bureau.
2. **Double mode d'installation** :
   - Installation directe en 1 clic sur Android sous forme de **WebAPK** (aucun téléchargement de fichier externe requis).
   - Génération d'un **vrai fichier APK autonome (`.apk`)** via **Capacitor** ou **PWABuilder / Bubblewrap** sans réécrire une seule ligne de code.

---

## 2. Comment Télécharger le Code Source sur Android

### Option A — Téléchargement direct depuis l'application
1. Ouvrez l'application FanLink AI sur votre navigateur Android.
2. Allez dans **Profil** > **Paramètres** (icône d'engrenage ou menu ☰).
3. Cliquez sur l'onglet **« Export & APK Android »** ou **« Assistance »**.
4. Cliquez sur le bouton vert **« Télécharger le code source (.ZIP) »**.
5. Le fichier `fanlink-ai-source.zip` est automatiquement téléchargé dans votre dossier `Téléchargements` (Downloads).

### Option B — Téléchargement via URL directe
Ouvrez directement dans Chrome sur Android :
```
https://<VOTRE-DOMAINE-FANLINK>/api/download-source
```
ou
```
https://<VOTRE-DOMAINE-FANLINK>/fanlink-ai-source.zip
```

### Comment ouvrir et explorer le code sur Android :
1. **Extraction de l'archive ZIP** :
   - Utilisez l'application native **Files by Google** (Fichiers) ou téléchargez **ZArchiver** (gratuit sur le Play Store).
   - Appuyez sur `fanlink-ai-source.zip` et sélectionnez **Extraire**.
2. **Lecture et modification du code sur Android** :
   - Téléchargez **Acode** (puissant éditeur de code avec coloration syntaxique TypeScript/React) ou **Spck Code Editor**.
   - Ouvrez le dossier extrait dans Acode pour consulter tous les composants (`/src/components/`, `/server.ts`, etc.).

---

## 3. Comment Générer un Véritable Fichier APK Android (`.apk`)

Deux méthodes éprouvées permettent de générer un véritable fichier `.apk` prêt à être installé sur votre smartphone Android.

### Méthode 1 : Avec Capacitor (Recommandé — APK Natif Autonome)
Le fichier de configuration officiel `capacitor.config.json` a déjà été créé à la racine du projet avec l'ID d'application `ai.fanlink.app`.

#### Étapes de compilation :
Sur un ordinateur ou un environnement de développement avec Node.js et Android SDK (ou Android Studio) :

1. **Compiler les assets web optimisés** :
   ```bash
   npm run build
   ```

2. **Installer les dépendances Capacitor Android** :
   ```bash
   npm install @capacitor/core @capacitor/android
   npm install -D @capacitor/cli
   ```

3. **Initialiser et synchroniser la plateforme Android** :
   ```bash
   npx cap add android
   npx cap sync android
   ```

4. **Générer le fichier APK** :
   - **En ligne de commande (sans interface)** :
     ```bash
     cd android
     ./gradlew assembleDebug
     ```
     Le fichier APK installable se trouve immédiatement dans :
     `android/app/build/outputs/apk/debug/app-debug.apk`

   - **Via Android Studio** :
     ```bash
     npx cap open android
     ```
     Dans le menu du haut : **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
     Dès la fin de la compilation, cliquez sur *locate* pour récupérer votre fichier `app-debug.apk`.

5. **Installation sur votre téléphone** :
   - Transférez `app-debug.apk` sur votre smartphone (par câble USB, WhatsApp, Telegram, Google Drive ou e-mail).
   - Sur votre téléphone Android, activez « Installer des applications inconnues » pour votre gestionnaire de fichiers.
   - Touchez le fichier APK pour lancer l'installation de **FanLink AI**.

---

### Méthode 2 : Avec PWABuilder (Simple, sans Android Studio, directement depuis un navigateur)
PWABuilder est l'outil officiel open-source soutenu par Microsoft et Google pour convertir une application web PWA en APK Android / TWA (Trusted Web Activity).

1. Ouvrez [https://www.pwabuilder.com](https://www.pwabuilder.com) sur votre téléphone ou PC.
2. Collez l'URL publique de FanLink AI.
3. Cliquez sur **Start** (l'outil valide le manifeste PWA de FanLink AI et ses icônes).
4. Cliquez sur **Package for Store** ou **Android**.
5. Téléchargez le package d'installation : vous obtenez directement un fichier `.apk` prêt pour le sideloading et un `.aab` pour le Google Play Store.

---

### Méthode 3 : Installation Immédiate en WebAPK (Sans rien compiler)
Grâce au manifeste PWA (`manifest.json`) et aux icônes déjà intégrées à FanLink AI :

1. Ouvrez FanLink AI dans **Google Chrome** sur votre téléphone Android.
2. Cliquez sur les **3 petits points** en haut à droite du navigateur.
3. Choisissez **« Installer l'application »** (ou « Ajouter à l'écran d'accueil »).
4. Android crée automatiquement un conteneur système **WebAPK** :
   - L'icône officielle FanLink AI apparaît sur votre écran d'accueil et dans le tiroir d'applications.
   - L'application s'ouvre en plein écran sans barre d'adresse de navigateur.
   - Les notifications push et le fonctionnement hors-ligne sont gérés.

---

## 4. Contenu de l'Archive Source

L'archive zip contient l'ensemble de l'architecture FanLink AI :
- `/src/components/` : Tous les écrans et composants (Accueil, Feed, Stories, Live, Messagerie, Évolution, Paramètres, Modalités).
- `/src/context/` : Gestion globale de l'authentification et des devises/langues.
- `/src/services/` : Services de données et intégration Firebase.
- `/server.ts` : Serveur Express avec endpoints IA Gemini, paiements multi-devises et statut live.
- `public/` : Manifeste PWA, icônes vectorielles et assets.
- `capacitor.config.json` : Configuration officielle pour la compilation Android.
- `package.json`, `tsconfig.json`, `vite.config.ts` : Configurations de build modernes.
