import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: 'esnext', // Utilise les dernières fonctionnalités JavaScript
        outDir: 'dist', // Dossier de sortie
    },
    server: {
        open: true, // Ouvre automatiquement l'application dans le navigateur
    },
    base: '/<webComponentLecteurAudio>/', 
    plugins: []
});
