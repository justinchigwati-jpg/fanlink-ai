# Guide de Configuration des Prestataires de Paiement

FanLink AI intègre une couche de paiement modulaire et internationale permettant d'adresser à la fois les marchés émergents (Mobile Money) et les marchés internationaux (Cartes bancaires, PayPal).

---

## 1. Principes de Sécurité Financière

1. **Aucun secret côté client** : Toutes les clés secrètes d'API (`SECRET_KEY`, `WEBHOOK_SECRET`) doivent résider impérativement côté serveur dans les variables d'environnement (`.env`).
2. **Idempotence & Anti-double dépense** : Toute transaction envoie une clé d'idempotence unique (`idempotencyKey`) vérifiée côté serveur pour interdire les doubles débits.
3. **Validation côté serveur** : Le déblocage de messages payants ou le crédit de FanCoins est calculé et validé exclusivement sur le serveur Node.js.
4. **Partage des revenus garanti** : 80% des revenus sont reversés au créateur et 20% sont conservés par la plateforme.

---

## 2. Configuration des Opérateurs Mobile Money

### A. Orange Money (Afrique de l'Ouest & Centrale)
- **Devises** : XOF, XAF, EUR.
- **Pays éligibles** : Côte d'Ivoire, Sénégal, Cameroun, Mali, Burkina Faso, Guinée.
- **Portail développeur** : [Orange Developer](https://developer.orange.com).
- **Variables d'environnement requises** :
  ```env
  ORANGE_MONEY_CLIENT_ID="votre_client_id"
  ORANGE_MONEY_CLIENT_SECRET="votre_client_secret"
  ORANGE_MONEY_MERCHANT_KEY="votre_merchant_key"
  ```
- **Flux technique** : Appel de l'API Web Payment v1 > Redirection ou validation USSD par code PIN sur le téléphone du fan > Réception du Webhook de confirmation.

### B. MTN Mobile Money (MoMo API)
- **Devises** : XOF, USD, ZAR, GHS, UGX.
- **Pays éligibles** : Ghana, Ouganda, Rwanda, Cameroun, Côte d'Ivoire, Afrique du Sud, Nigeria.
- **Portail développeur** : [MTN MoMo Developer Portal](https://momodeveloper.mtn.com).
- **Variables d'environnement requises** :
  ```env
  MTN_MOMO_PRIMARY_KEY="votre_primary_key"
  MTN_MOMO_API_USER="votre_api_user_uuid"
  MTN_MOMO_API_KEY="votre_api_key"
  ```
- **Flux technique** : `RequestToPay` API déclenchant une notification push sur le mobile du fan.

### C. Airtel Money
- **Devises** : XOF, USD, KES, TZS.
- **Pays éligibles** : Kenya, Tanzanie, Ouganda, RDC, Madagascar, Gabon.
- **Portail développeur** : [Airtel Africa Developer Portal](https://developers.airtel.africa).

### D. Vodacom M-Pesa
- **Devises** : KES, USD, ZAR, TZS.
- **Pays éligibles** : Kenya (Safaricom), Tanzanie, Mozambique, RDC, Afrique du Sud.
- **Portail développeur** : [Daraja M-Pesa Portal](https://developer.safaricom.co.ke).

---

## 3. Configuration des Cartes Bancaires (Stripe / Checkout)

- **Devises supportées** : EUR, USD, GBP, ZAR, KES, XOF.
- **Variables requises** :
  ```env
  STRIPE_SECRET_KEY="sk_live_..."
  STRIPE_WEBHOOK_SECRET="whsec_..."
  ```
- **Flux technique** : Création d'une `PaymentIntent` côté serveur > Confirmation 3D-Secure dans le composant client > Déclenchement du Webhook vers `/api/payments/webhook`.

---

## 4. Configuration PayPal International

- **Devises supportées** : EUR, USD, GBP.
- **Portail développeur** : [PayPal Developer](https://developer.paypal.com).
- **Variables requises** :
  ```env
  PAYPAL_CLIENT_ID="votre_paypal_client_id"
  PAYPAL_CLIENT_SECRET="votre_paypal_client_secret"
  ```
