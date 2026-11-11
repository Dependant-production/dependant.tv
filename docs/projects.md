# Gérer l’onglet Projets dans Strapi

Sur le site, **Projets** ouvre une page avec quatre entrées, `[commercials]`, `[music videos]`, `[stills]` et `[unscripted]`, en français comme en anglais, qui mènent chacune à sa liste de projets. Dans Strapi, `Commercials`, `Music videos` et `Unscripted` portent les mêmes noms ; la section `[stills]` y s’appelle **Photography** (valeur `photography`, qui reste aussi dans l’adresse `/projects/photography`). Tout se règle depuis un seul endroit dans Strapi (projet `dependantCMS`) : l’entrée **projects** de la liste du Content Manager, à côté de `projectsPhotos` et `ProjectVideos`. La même page s’ouvre avec l’icône **Onglet Projets** de la barre de gauche.

## Classer les projets

Cette page liste **tous** les projets, sans avoir à ouvrir chaque fiche : les photos (`projectsPhotos`), les vidéos (`ProjectVideos`) et les vidéos de la homepage (`homepageVideos`). Ils sont répartis en cinq tableaux : **Commercials**, **Music videos**, **Photography**, **Unscripted** et **Hors de l’onglet**, et la colonne **Type** indique d’où vient chacun. Sur la ligne d’un projet :

1. **Section** : choisir `Commercials`, `Music videos`, `Photography` ou `Unscripted` pour l’afficher dans cette liste, ou `Hors de l’onglet` pour l’en retirer. Un projet n’est que dans une seule section.
2. **Ordre** (facultatif) : le laisser vide pour classer le projet par ordre alphabétique, ou le renseigner pour le placer en tête de liste. Les petits nombres apparaissent d’abord. Utiliser par exemple 10, 20, 30 pour pouvoir intercaler d’autres projets ensuite.

Ces deux réglages s’enregistrent tout seuls, sans ouvrir la fiche ni la publier. Si la fiche contient d’autres modifications non publiées, elles restent en attente.

Dans chaque section, tous les types sont mélangés : les projets qui ont un ordre s’affichent en premier, puis tous les autres par ordre alphabétique du titre. À ordre égal, les titres sont aussi classés par ordre alphabétique. Un ordre vide ou égal à 0 compte comme « pas d’ordre ».

## Nombre de projets avant « more »

Au-dessus du tableau de chaque section, le champ **Projets affichés sur le site** fixe combien de projets la section montre à l’arrivée. Les suivants apparaissent sous la liste au clic sur le bouton `[more]`, en français comme en anglais ; le survoler grise les projets, comme sur la page des sections. Vide ou 0 : la section affiche tous ses projets, sans bouton ; le bouton n’apparaît pas non plus si la section compte autant de projets ou moins.

Le nombre s’enregistre en quittant le champ, comme l’ordre, et vaut pour les deux langues. Il compte uniquement les projets affichés sur le site (états **Sur le site** et **Modifications non publiées**), dans l’ordre du tableau. Les mêmes nombres se trouvent dans le type unique **projectsTab** du Content Manager (`commercialsBeforeMore`, `musicVideosBeforeMore`, `photographyBeforeMore` pour la section `[stills]`, `unscriptedBeforeMore`), où ils s’enregistrent aussi sans publication.

La colonne **État** indique où en est chaque projet :

- **Sur le site** : le projet est affiché.
- **Modifications non publiées** : le projet est affiché, mais sa fiche contient des changements à publier.
- **À publier** : le projet n’a jamais été publié ; publier sa fiche pour l’afficher.
- **Vidéo Mux manquante** : la vidéo est publiée, mais n’a pas encore de média Mux lisible ; le site ne l’affiche pas.
- **À classer** : le projet avait été sélectionné avant la création des sections ; lui choisir une section. Ces projets sont en tête du tableau **Hors de l’onglet**.
- **Non affiché** : le projet n’est pas dans l’onglet.

L’entrée **projects** n’apparaît qu’aux comptes autorisés à lire les trois types de projets. L’icône apparaît dès qu’un compte peut en lire un seul, mais la page affiche alors une erreur. Modifier une ligne ou un nombre de projets affichés demande le droit de modifier les trois types.

## Depuis la fiche d’un projet

Les mêmes réglages existent dans les fiches **projectsPhotos**, **ProjectVideos** et **homepageVideos**, avec les champs **projectsSection** et **projectsOrder**. Dans la fiche, ils suivent le fonctionnement habituel : il faut enregistrer puis **publier**.

**showInArtistPortfolio** existe sur les photos et les vidéos, et se règle uniquement dans la fiche : activé pour afficher aussi le projet sur la page de son artiste, désactivé pour le retirer de son portfolio. Il est indépendant de la section :

| projectsSection | showInArtistPortfolio | Affichage                                 |
| --------------- | --------------------- | ----------------------------------------- |
| Renseignée      | Désactivé             | Uniquement dans l’onglet Projets          |
| Vide            | Activé                | Uniquement dans le portfolio de l’artiste |
| Renseignée      | Activé                | Dans les deux                             |
| Vide            | Désactivé             | Dans aucune des deux listes               |

Conserver l’association au réalisateur ou au photographe, même pour un projet affiché uniquement dans l’onglet Projets : elle sert à récupérer son nom. Le projet est masqué du portfolio grâce à **showInArtistPortfolio**, sans supprimer cette association. Les projets existants restent visibles dans les portfolios tant que cette case n’est pas explicitement désactivée.

L’artiste peut rester en **brouillon** : seul le projet doit être publié. Il apparaît alors dans l’onglet Projets avec le nom de l’artiste, sans que la page de l’artiste soit visible sur le site. Le CMS ajoute ce nom aux réponses de l’API (`photographerName` pour les photos, `directorName` pour les vidéos), car Strapi ne renvoie pas la relation vers un artiste non publié.

## Vidéos de la homepage

Une vidéo de la homepage placée dans une section y apparaît en plus de la homepage : elle ne la quitte pas. Son champ `order` règle sa place sur la homepage, et `projectsOrder` sa place dans l’onglet.

Le site utilise le premier fichier du champ `url` comme aperçu dans la liste. Au clic, il ouvre une page avec ce fichier en lecture, sans le son au départ, et le lecteur permet de l’activer. Le nom affiché est celui du réalisateur, sinon `directorNameBIS`.

## Mettre à jour le contenu

- **Photos** : modifier `title`, `coverMedia` (aperçu) et `media` (galerie) dans **projectsPhotos**. Le projet doit être associé à un photographe via le champ `projects` de sa fiche.
- **Vidéos** : modifier `title` et les médias Mux dans **ProjectVideos**. Le projet doit être associé à un réalisateur et comporter au moins un média avec un identifiant de lecture Mux.
- **Homepage** : modifier `title`, `url` et le réalisateur (ou `directorNameBIS`) dans **homepageVideos**.
- Le nom affiché en bas à droite est repris de la fiche du photographe ou du réalisateur associé.

Les données de cet onglet et de ses pages de détail ont un cache de 60 secondes. Après publication, attendre son expiration et recharger la page ; la première visite peut encore servir la version précédente pendant l’actualisation en arrière-plan.

## Première mise en service

Les champs sont définis dans ces schémas du dépôt `dependantCMS` :

- `src/api/project/content-types/project/schema.json`
- `src/api/project-video/content-types/project-video/schema.json`
- `src/api/homepage-video/content-types/homepage-video/schema.json`
- `src/api/projects-tab/content-types/projects-tab/schema.json` (nombres de projets avant `more`)

Respecter cet ordre, qui garde l’onglet en ligne pendant toute la transition :

1. **Déployer le CMS.** Le champ `projectsSection` s’ajoute sans rien retirer : le site déjà en ligne continue de lire `showInProjects`, masqué dans les fiches mais conservé en base.
2. **Classer les projets** dans **Onglet Projets** : ceux qui étaient cochés apparaissent avec l’état **À classer**. Cela ne change rien sur le site en ligne.
3. **Déployer le site.** Il lit désormais uniquement `projectsSection`. Déployé avant le CMS, il afficherait une erreur sur les listes, car Strapi refuse un filtre sur un champ qu’il ne connaît pas.
4. Une fois le site déployé dans tous les environnements, `showInProjects` et l’état **À classer** peuvent être retirés du CMS.

Le classement ne se recopie pas d’un environnement à l’autre : il est à refaire en production, même s’il a été fait en préproduction. Il en va de même pour les nombres de projets avant `more`.

Le nombre de projets avant `more` n’impose pas d’ordre de déploiement : tant que le CMS ne le fournit pas, ou qu’aucun nombre n’a encore été enregistré, le site affiche toutes les sections en entier. Le site le lit sans jeton, par `/api/projects-tab`, ouverte en lecture par le code du CMS : il n’y a rien à cocher dans les permissions du rôle **Public**.

Pour un rôle comme **Editor**, autoriser aussi la lecture, la création et la modification de `projectsSection` dans les permissions des trois types de projet, ainsi que `projectsOrder` sur `homepageVideos`, sans quoi ces champs restent invisibles dans la fiche. Les droits existants n’incluent pas automatiquement les nouveaux champs. Le tableau **Onglet Projets** n’en dépend pas. Pour que ce rôle voie aussi **projectsTab** dans le Content Manager, lui donner les droits de lecture et de modification sur ce type ; les champs de la page **Onglet Projets** n’en ont pas besoin.
