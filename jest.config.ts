module.exports = {
    preset: 'ts-jest', // Utiliser ts-jest pour transformer les fichiers TypeScript
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', // Transformer les fichiers .ts et .tsx avec ts-jest
        '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'babel-jest', // Utiliser babel-jest pour les fichiers JS et JSX
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'], // Extensions de fichier supportées
    transformIgnorePatterns: ['node_modules/(?!(your-module-name)/)'], // Si vous devez ajouter des modules spécifiques
}
