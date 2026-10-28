# Préproduction pour la validation client

La préproduction comprend un frontend Vercel Preview et un second Strapi. Le CMS dispose d’une base, de secrets et d’un dossier d’uploads distincts de la production.

## Environnements

| Élément                                  | Préproduction                            | Production                       |
| ---------------------------------------- | ---------------------------------------- | -------------------------------- |
| Site (client)                            | `https://preprod.dependant.tv`           | `https://www.dependant.tv`       |
| Site (équipe, compte Vercel)             | `https://dependant-preprod.vercel.app`   | —                                |
| Branche du site                          | `develop`                                | `master`                         |
| Administration Strapi                    | `https://cms-preprod.dependant.tv/admin` | `https://cms.dependant.tv/admin` |
| Branche du CMS                           | `develop`                                | `master`                         |
| Dossier CMS sur le VPS                   | `/home/ubuntu/dependantCMS-preprod`      | `/home/ubuntu/dependantCMS`      |
| Processus PM2                            | `dependant-preprod`                      | `strapi`                         |
| Écoute du CMS                            | `127.0.0.1:1338`                         | Instance existante               |
| Base et rôle PostgreSQL de préproduction | `dependant_preprod`                      | Base existante distincte         |
| Node du CMS                              | Node 22 dédié                            | Node 18 existant                 |

Le VPS est `51.222.156.38`. nginx expose le CMS de préproduction en HTTPS avec son propre hôte et son certificat. Le DNS `cms-preprod.dependant.tv` pointe vers ce VPS. Docker n’est pas utilisé pour cette installation.

Les deux dépôts ont une branche `develop` pour la préproduction :

- **Site** : chaque push sur `develop` crée un déploiement Vercel Preview. Les domaines `preprod.dependant.tv` et `dependant-preprod.vercel.app` sont rattachés à cette branche et suivent toujours son dernier déploiement (voir « Frontend Vercel Preview » pour leur accès).
- **CMS** : le dossier de préproduction du VPS n’est pas un checkout git. Après un push sur `develop`, lancer `scripts/deploy-preprod.sh` depuis le dépôt `dependantCMS` (voir plus bas). Le commit déployé est inscrit dans `/home/ubuntu/dependantCMS-preprod/REVISION`.

## Contenu et accès au CMS

La base de préproduction a été initialisée par une copie de la base de production. Les comptes administrateurs et les droits API sont ceux de cet instantané : utiliser les identifiants du CMS de production à la date de la copie. Ils peuvent différer de ceux du CMS local. Une modification de contenu ou de compte dans cette copie ne met pas à jour la production.

En cas de perte d’accès, réinitialiser uniquement le compte de préproduction depuis le dossier `/home/ubuntu/dependantCMS-preprod`, avec le Node dédié et `ENV_PATH=.env.preprod`. Ne pas lancer une commande de récupération depuis le dossier de production.

Les médias sont enregistrés dans `/home/ubuntu/dependantCMS-preprod/public/uploads` avec `UPLOAD_PROVIDER=local`. L’initialisation a recopié les 365 médias existants et leurs variantes, soit 1 522 fichiers et environ 9,5 Go. Leurs références ont été adaptées dans la seule base de préproduction. Une modification ou une suppression dans cette médiathèque agit sur cette copie locale, tandis que la production conserve ses fichiers S3.

Les vidéos existantes restent lisibles via leurs identifiants Mux, mais **l’ajout, la modification et la suppression d’assets Mux sont désactivés** avec `MUX_UPLOADS_ENABLED=false`. Le middleware de lecture seule renvoie une erreur explicite pour ces opérations. Il reste possible de modifier les titres des projets et les cases d’affichage. Pour tester un nouvel upload vidéo ultérieurement, créer d’abord un environnement Mux séparé et fournir ses propres identifiants ; ne pas utiliser les secrets Mux de production.

L’administration inclut un correctif ciblé dans `src/admin/app.ts` pour l’initialisation Mux avec Strapi 5.4.1 : sans ce correctif, la connexion réussit mais l’écran reste sur « Loading content ». Conserver ce fichier dans les prochaines compilations de l’administration. Le rôle Editor de préproduction peut lire et modifier les trois nouveaux champs de sélection des projets.

Le [guide des projets](projects.md) décrit `showInProjects`, `showInArtistPortfolio` et l’ordre des projets. Pour un affichage uniquement dans l’onglet Projets, activer la première case et désactiver la seconde, tout en conservant l’association à l’artiste.

## Configuration CMS et commandes de suivi

Dans le dépôt `dependantCMS`, `ecosystem.preprod.config.cjs` charge uniquement le fichier `.env.preprod` du dossier où il se trouve. Ce fichier est ignoré par Git. Le modèle `.env.preprod.example` contient les variables attendues, sans secret. Les valeurs de la production ne doivent pas être copiées dans ce fichier.

Le chemin du Node dédié est :

```text
/home/ubuntu/.local/opt/dependant-preprod-node22/bin/node
```

Ce chemin est renseigné dans `PREPROD_NODE_PATH`. Le processus PM2 utilise ce binaire sans modifier le Node global ni le processus `strapi` de production. La base, le rôle PostgreSQL, le port et le fournisseur d’uploads sont contrôlés au chargement de la configuration PM2.

Commandes de suivi sur le VPS :

```bash
cd /home/ubuntu/dependantCMS-preprod
pm2 show dependant-preprod
pm2 logs dependant-preprod --lines 50 --nostream
curl --fail --silent --output /dev/null --write-out '%{http_code}\n' http://127.0.0.1:1338/_health
curl --fail --silent --output /dev/null --write-out '%{http_code}\n' https://cms-preprod.dependant.tv/_health
```

Les contrôles de santé Strapi renvoient `204`. Utiliser le nom précis `dependant-preprod` pour les opérations PM2 ; les commandes portant sur tous les processus affecteraient aussi la production.

## Mettre à jour le CMS de préproduction

Le VPS dispose de 2 Go de mémoire et héberge également la production : Strapi est compilé sur le Mac, avec Node 22 installé via nvm. Depuis le dépôt `dependantCMS`, une fois les changements commités et poussés sur `develop` :

```bash
scripts/deploy-preprod.sh          # ou scripts/deploy-preprod.sh <commit>
```

Le script :

1. exporte le commit avec `git archive`, sans fichiers non commités ni `.env` local ;
2. compile Strapi avec Node 22 et l’URL publique de préproduction, intégrée au bundle d’administration ;
3. envoie `dist` et les sources vers `/home/ubuntu/dependantCMS-preprod`, sans toucher à `.env.preprod`, `node_modules` ni `public/uploads` ;
4. lance `npm ci` sur le VPS uniquement si `package-lock.json` a changé (les dépendances natives doivent être installées sous Linux) ;
5. recharge uniquement `dependant-preprod` via `ecosystem.preprod.config.cjs`, qui refuse de démarrer si la base, le port ou les uploads ne sont pas ceux de la préproduction ;
6. attend que `https://cms-preprod.dependant.tv/_health` réponde `204`.

Une mise à jour de code n’importe pas de données. Conserver la base et les uploads de préproduction, et ne pas réinitialiser la copie à partir de la production à chaque livraison.

## Frontend Vercel Preview

Le projet Vercel existant est `dependant-tv`, dans l’équipe `tayyyyylors-projects`, relié au dépôt `Dependant-production/dependant.tv`. `master` est sa branche de production. Utiliser `develop` pour les aperçus et ne pas promouvoir un déploiement en production avant validation.

Les variables suivantes doivent être configurées **uniquement pour Preview** ; le modèle se trouve dans [.env.preprod.example](../.env.preprod.example) :

```env
NEXT_PUBLIC_STRAPI_BASE_URL=https://cms-preprod.dependant.tv
DEPLOYMENT_ENV=preprod
```

Si l’API de préproduction nécessite un jeton, ajouter `STRAPI_API_TOKEN` avec un jeton de lecture créé dans ce CMS. Ne pas réutiliser un jeton de production.

Créer un déploiement Preview des changements à valider, soit en poussant `develop` via l’intégration Git existante, soit avec `vercel deploy` depuis le checkout du site lié au bon projet. Ne pas utiliser `--prod`. Toute modification de variable nécessite un nouveau déploiement.

Le frontend refuse de revenir vers `cms.dependant.tv` lorsqu’il est configuré en Preview/préproduction. Les images locales du CMS sont résolues avec son URL et la préproduction demande aux moteurs de recherche de ne pas l’indexer.

La protection du projet (`all_except_custom_domains`) demande une connexion Vercel sur toutes les URL en `.vercel.app` des aperçus, y compris `dependant-preprod.vercel.app` : celle-ci sert à l’équipe. Seuls les domaines personnalisés sont ouverts : `preprod.dependant.tv`, rattaché à `develop`, est le lien à transmettre au client. La préproduction demande aux moteurs de recherche de ne pas l’indexer.

`preprod.dependant.tv` nécessite chez OVH (zone DNS `dependant.tv`) l’enregistrement `preprod CNAME c2d770bf3aa42e80.vercel-dns-017.com.`. Vercel émet ensuite le certificat HTTPS automatiquement. Cette adresse figure déjà dans `CORS_ORIGINS` du CMS de préproduction.

## Validation et mise en production

1. Contrôler le CMS HTTPS, l’administration, les photos et la lecture des vidéos existantes.
2. Vérifier que les changements de contenu restent dans le CMS et la base de préproduction.
3. Valider les quatre combinaisons de `showInProjects` et `showInArtistPortfolio`, l’ordre, les galeries, le nom de l’artiste en bas à droite et l’affichage mobile.
4. Attendre le statut **Ready** de l’aperçu Vercel, contrôler son accès client et transmettre cette URL.
5. Après validation explicite du client, intégrer le code dans les branches de production et déployer séparément le CMS et le site. Le déploiement du site depuis `master` reste le flux de production.
6. Organiser les changements de contenu à publier : la base, les utilisateurs et les fichiers de préproduction ne sont jamais recopiés automatiquement en production.
