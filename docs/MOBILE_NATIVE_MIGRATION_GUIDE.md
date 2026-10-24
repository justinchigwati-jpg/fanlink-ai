# Guide d'Architecture & Migration vers Applications Natives Android et iOS

FanLink AI a été conçu avec une architecture modulaire et découplée pour permettre une réutilisation maximale du backend, des schémas de données et de la logique métier sur des applications mobiles natives.

---

## 1. Architecture Partagée

Le backend Express, les règles de sécurité Firestore (`firestore.rules`), l'authentification Firebase et les points d'API IA / Paiements sont 100% agnostiques de la plateforme cliente.

```
       ┌────────────────────────────────────────────────────────┐
       │                Backend & Base de Données               │
       │   - Cloud Firestore (Schéma firebase-blueprint.json)   │
       │   - Firebase Authentication                            │
       │   - Serveur Node.js (API IA Gemini 3.8 & Paiements)    │
       └───────────────────────────┬────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Web / PWA      │     │  Android Native  │     │   iOS Native     │
│ (React + Vite)   │     │ (Kotlin+Compose) │     │ (Swift+SwiftUI)  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## 2. Option A : Migration Android Native (Kotlin + Jetpack Compose)

1. **Configuration Firebase Android** :
   - Récupérer `google-services.json` depuis la console Firebase et le placer dans `app/`.
   - Package name recommandé : `com.fanlink.ai`.
2. **Dépendances Gradle** :
   ```kotlin
   implementation(platform("com.google.firebase:firebase-bom:33.0.0"))
   implementation("com.google.firebase:firebase-auth-ktx")
   implementation("com.google.firebase:firebase-firestore-ktx")
   ```
3. **Appels API Sensibles** :
   - Utiliser Retrofit / Ktor Client pour appeler les endpoints `/api/payments/*` et `/api/ai/*` du serveur FanLink.

---

## 3. Option B : Migration iOS Native (Swift + SwiftUI)

1. **Configuration Firebase iOS** :
   - Récupérer `GoogleService-Info.plist` et l'ajouter au projet Xcode.
   - Bundle Identifier : `com.fanlink.ai`.
2. **Swift Package Manager (SPM)** :
   - Ajouter `https://github.com/firebase/firebase-ios-sdk` (sélectionner `FirebaseAuth` et `FirebaseFirestore`).
3. **Gestion des achats intégrés (In-App Purchases)** :
   - Sur iOS, l'achat de monnaie virtuelle (FanCoins) doit utiliser StoreKit 2 d'Apple pour être conforme aux guidelines App Store, puis valider le reçu côté serveur.

---

## 4. Option C : Approche Hybride / Capacitor

Si l'équipe souhaite réutiliser directement le code React existant dans un wrapper natif :
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "FanLink AI" "com.fanlink.ai"
npx cap add android
npx cap add ios
npx cap sync
```
Cela permet d'obtenir immédiatement deux binaires APK/AAB et Xcode prêts à être testés sur appareils physiques.
