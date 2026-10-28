# Gérer l’onglet Projets dans Strapi

La sélection se gère dans le projet `dependantCMS`, depuis **Content Manager**.
L’onglet réutilise les projets photo et vidéo existants.

## Choisir et ordonner les projets

1. Ouvrir **projectsPhotos** pour un projet photo, ou **ProjectVideos** pour une vidéo.
2. Ouvrir la fiche du projet et activer **showInProjects** pour l’inclure dans l’onglet.
3. **projectsOrder** est facultatif. Le laisser vide pour classer le projet par ordre alphabétique, ou le renseigner pour le placer en tête de liste : les petits nombres apparaissent d’abord. Utiliser par exemple 10, 20, 30 pour pouvoir intercaler d’autres projets ensuite.
4. Choisir **showInArtistPortfolio** : activé pour afficher aussi ce projet sur la page de son artiste, désactivé pour le retirer de son portfolio.
5. Enregistrer et **publier** la fiche. Une modification enregistrée en brouillon ne modifie pas la version publiée.

L’ordre est commun aux photos et vidéos. Les projets qui ont un ordre s’affichent en premier, puis tous les autres par ordre alphabétique du titre. À ordre égal, les titres sont aussi classés par ordre alphabétique. Un ordre vide ou égal à 0 compte comme « pas d’ordre ».

Pour retirer un projet de cet onglet, désactiver **showInProjects**, puis publier.
Cette case concerne uniquement l’onglet Projets : elle ne change pas la sélection des pages réalisateurs et photographes.

Les deux cases sont indépendantes :

| showInProjects | showInArtistPortfolio | Affichage                                 |
| -------------- | --------------------- | ----------------------------------------- |
| Activé         | Désactivé             | Uniquement dans l’onglet Projets          |
| Désactivé      | Activé                | Uniquement dans le portfolio de l’artiste |
| Activé         | Activé                | Dans les deux                             |
| Désactivé      | Désactivé             | Dans aucune des deux listes               |

Conserver l’association au réalisateur ou au photographe, même pour un projet affiché uniquement dans l’onglet Projets : elle sert à récupérer son nom. Le projet est masqué du portfolio grâce à **showInArtistPortfolio**, sans supprimer cette association. Les projets existants restent visibles dans les portfolios tant que cette case n’est pas explicitement désactivée.

L’artiste peut rester en **brouillon** : seul le projet doit être publié. Il apparaît alors dans l’onglet Projets avec le nom de l’artiste, sans que la page de l’artiste soit visible sur le site. Le CMS ajoute ce nom aux réponses de l’API (`photographerName` pour les photos, `directorName` pour les vidéos), car Strapi ne renvoie pas la relation vers un artiste non publié.

## Mettre à jour le contenu

- **Photos** : modifier `title`, `coverMedia` (aperçu) et `media` (galerie) dans **projectsPhotos**. Le projet doit être associé à un photographe via le champ `projects` de sa fiche.
- **Vidéos** : modifier `title` et les médias Mux dans **ProjectVideos**. Le projet doit être associé à un réalisateur et comporter au moins un média avec un identifiant de lecture Mux.
- Le nom affiché en bas à droite est repris de la fiche du photographe ou du réalisateur associé.

Les données de cet onglet et de ses pages de détail ont un cache de 60 secondes. Après publication, attendre son expiration et recharger la page ; la première visite peut encore servir la version précédente pendant l’actualisation en arrière-plan.

## Première mise en service

Les champs sont définis dans les deux schémas du dépôt `dependantCMS` :

- `src/api/project/content-types/project/schema.json`
- `src/api/project-video/content-types/project-video/schema.json`

Redémarrer le CMS local, ou reconstruire et redéployer le CMS hébergé, pour charger ces schémas avant de déployer le site. Si un formulaire d’administration personnalisé masque les nouveaux champs, les ajouter via **Configurer la vue**.

Pour un rôle comme **Editor**, autoriser aussi la lecture, la création et la modification de `showInProjects`, `projectsOrder` et `showInArtistPortfolio` dans les permissions des deux types de projet. Les droits existants n’incluent pas automatiquement les nouveaux champs. Ce réglage est appliqué au rôle Editor de préproduction ; il devra être vérifié lors de la mise en production.

La sélection est explicite : `showInProjects` vaut `false` par défaut, et seules les fiches publiées avec la case activée apparaissent. Les projets existants doivent donc être sélectionnés puis republiés. Tant que le CMS ne renvoie pas ce champ ou qu’aucun projet n’est sélectionné, l’onglet affiche son état vide.
