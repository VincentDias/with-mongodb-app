# Projet Next.js avec MongoDB Atlas

## Description

Ce projet est fait avec [Next.js](https://nextjs.org/). La base de données est gérée via [MongoDB Atlas](https://account.mongodb.com/account/login), et l'application est déployée sur [Vercel](https://vercel.com/). Ce projet inclut des fonctionnalités d'authentification, des API accessibles via un swagger, et une gestion dynamique des données via MongoDB.

## Fonctionnalités

- **Authentification des utilisateurs** (inscription, connexion, déconnexion)
- **API RESTful** pour interagir avec la base de données MongoDB
- **Déploiement facile sur Vercel**n

## Prérequis

Avant de commencer, vous devez avoir installé les outils suivants :

- [Node.js](https://nodejs.org/) version 14 ou supérieure
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) compte et base de données configurée
- [Vercel CLI](https://vercel.com/docs/cli) (si vous souhaitez déployer localement avant de pousser sur Vercel)

## Installation

1. Clonez le projet sur votre machine locale :

   ```bash
   git clone https://https://github.com/VincentDias/with-mongodb-app
   ```

2. Installez les dépendances :

   ```bash
   cd with-mongodb-app
   npm install
   ```

3. Configurez votre fichier `.env` avec vos informations MongoDB Atlas et autres secrets :

   Créez un fichier `.env.local` à la racine du projet et ajoutez vos variables d'environnement :

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/nom-de-la-db?retryWrites=true&w=majority
   JWT_SECRET=ton_secret_jwt
   ```

4. Lancez l'application en mode développement :

   ```bash
   npm run dev
   ```

   L'application sera disponible sur `http://localhost:3000`.

## API Endpoints

### Routes disponibles

#### 1. Authentification

• POST /api/auth/signup → Inscription d’un utilisateur

• POST /api/auth/login → Connexion d’un utilisateur

• POST /api/auth/logout → Déconnexion d’un utilisateur

• POST /api/auth/refresh → Rafraîchir le token d’accès

#### 2. Movies

• GET /api/movies → Récupérer tous les films

• GET /api/movies/:idMovie → Récupérer un film par ID

• POST /api/movies → Ajouter un film

• PUT /api/movies/:idMovie → Modifier un film

• DELETE /api/movies/:idMovie → Supprimer un film

#### 3. Commentaires

• POST /api/movies/:idMovie/comment → Ajouter un commentaire

• PUT /api/movies/:idMovie/comment/:idComment → Modifier un commentaire

• DELETE /api/movies/:idMovie/comment/:idComment → Supprimer un commentaire

#### 4. Theaters

• GET /api/theaters → Récupérer tous les cinémas

• GET /api/theaters/:idTheater → Récupérer un cinéma par ID

## Déploiement sur Vercel

Pour déployer l'application sur Vercel, vous devez connecter votre projet à un compte Vercel. Voici les étapes à suivre :

Prérequis

- Un compte sur Vercel
- Un cluster MongoDB Atlas
- Node.js installé

Déploiement

1. Forker et cloner le projet

   ```bash
    git clone https://github.com/VincentDias/with-mongodb-app
    cd with-mongodb-app
   ```

2. Installer les dépendances

   ```bash
   npm install
   ```

3. Configurer les variables d’environnement

   - Créez un fichier .env.local à la racine et ajoutez :

   ```bash
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    REFRESH_SECRET=your_refresh_secret
   ```

4. Lancer le serveur localement

   ```bash
   npm install
   ```

   Accédez à http://localhost:3000

5. Déployer sur Vercel

   - Connectez-vous à Vercel

   - Importez le dépôt GitHub

   - Ajoutez les variables d’environnement sur l’interface Vercel

   - Cliquez sur "Deploy"

6. Consulter l’API sur Vercel

   ```bash
   https://with-mongodb-app-sable.vercel.app/api/movies
   ```

7. Créez un compte ou connectez-vous à [Vercel](https://vercel.com/).
8. Dans le tableau de bord de Vercel, cliquez sur **"New Project"** et sélectionnez **GitHub**.
9. Choisissez le projet que vous avez cloné et suivez les instructions de déploiement.
10. Configurez les variables d'environnement dans les paramètres de votre projet sur Vercel :

    - `MONGODB_URI`: L'URL de connexion à votre base de données MongoDB Atlas
    - `JWT_SECRET`: Votre secret JWT pour l'authentification
    - `REFRESH_SECRET`: Votre refreshToken pour la gestion des cookies

Une fois déployé, Vercel vous fournira une URL de production que vous pourrez partager avec vos utilisateurs.

## Structure du projet

Voici un aperçu de la structure du projet :

```bash
├── pages/
│ ├── api/
│ │ ├── auth/
│ │ └── users.js
│ ├── app.js
│ └── index.js
├── components/
├── lib/
│ └── authService.js
├── models/
│ ├── User.js
│ └── Session.js
├── public/
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

## Développement local

1. Pour tester l'API localement, utilisez `POSTMAN` pour interagir avec les points de terminaison définis dans `pages/api/auth`.
2. Utilisez `npm run dev` pour démarrer le serveur en mode développement. Tous les changements seront automatiquement rechargés grâce au "hot reloading".

## Notes sur MongoDB Atlas

1. Vous devez avoir un compte MongoDB Atlas et une base de données configurée.
2. Vous pouvez trouver l'URL de connexion dans l'onglet **Clusters** de votre compte MongoDB Atlas. Copiez cette URL et remplacez `<username>` et `<password>` par vos informations d'identification.

## Notes sur Vercel

1. Vous devez avoir un compte Vercel.com et importer votre projet
2. Vous pourrez alors vous rendre dans les settings du projets pour indiquer vos variables d'environnement

## Remarques sur la sécurité

- **MongoDB URI** : Assurez-vous que votre URI MongoDB Atlas est configuré avec des règles de sécurité pour limiter l'accès uniquement aux IP autorisées.
- **JWT Secret** : Ne jamais exposer votre JWT en production. Utilisez des variables d'environnement pour le sécuriser.
- **REFRESH_SECRET** : Ne jamais exposer votre JWT en production. Utilisez des variables d'environnement pour le sécuriser.

## Pour plus d'informations

- [Documentation de Next.js](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel](https://vercel.com/docs)
