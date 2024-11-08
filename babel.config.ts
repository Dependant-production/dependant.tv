module.exports = {
    presets: [
        '@babel/preset-env', // Transforme le code JavaScript moderne en une version compatible avec tous les navigateurs
        '@babel/preset-react', // Transforme JSX en JavaScript
        '@babel/preset-typescript', // Permet de traiter le TypeScript
    ],
    plugins: [
        '@babel/plugin-transform-runtime', // Permet de réduire la taille du bundle en optimisant l'utilisation de helpers
    ],
}
