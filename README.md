This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Gérer l’onglet Projets

La sélection et l’ordre se règlent dans les fiches `projectsPhotos` et `ProjectVideos` du CMS Strapi, avec `showInProjects` et `projectsOrder`. Le champ indépendant `showInArtistPortfolio` permet de masquer un projet dans le portfolio de son artiste tout en le gardant dans l’onglet Projets. Voir le [guide de gestion des projets](docs/projects.md) pour la publication et la mise en service.

Le [CMS de préproduction](https://cms-preprod.dependant.tv/admin) utilise un processus PM2, une base PostgreSQL et des uploads indépendants. Les vidéos existantes y sont en lecture seule. Le [guide de préproduction](docs/preproduction.md) décrit les accès, les mises à jour et le frontend Vercel Preview à faire valider avant livraison depuis `master`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
