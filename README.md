# Lecteur Audio avec Web Components

Ce projet est un lecteur audio interactif réalisé avec des **Web Components** et l'**API Web Audio**. Il permet de jouer des pistes audio avec des contrôles avancés, tels qu'un visualiseur de fréquences, un égaliseur de fréquences, et une playlist dynamique.

## Fonctionnalités

### 1. Composant Principal : `audio-player`
Le composant `audio-player` est l'élément central qui orchestre l'ensemble des composants du lecteur. Il est responsable de l'initialisation de l'audio, du contrôle de la lecture, du réglage du volume, et de la gestion de la piste en cours.

- **Lecture / Pause / Arrêt / Avance rapide** : Contrôle de base pour jouer, mettre en pause, arrêter et avancer de 10 secondes la piste audio.
- **Volume** : Curseur de réglage du volume, qui modifie le gain général de l'audio.
- **Sélection de Piste** : Réception de la piste choisie dans la playlist et gestion du changement de piste.

### 2. Composant Playlist : `audio-playlist`
Le composant `audio-playlist` affiche une liste de pistes disponibles et permet à l'utilisateur de sélectionner la piste de son choix.

- **Affichage de la Playlist** : Affiche les titres des pistes ajoutées au lecteur.
- **Sélection de la Piste** : En cliquant sur un titre, l'utilisateur peut sélectionner la piste à jouer. Le composant `audio-player` se charge ensuite de charger et lire cette piste.
- **Surbrillance de la Piste Active** : La piste actuellement en cours de lecture est surlignée pour indiquer qu'elle est en cours de lecture.

### 3. Composant Égaliseur de Fréquences : `audio-equalizer`
Le composant `audio-equalizer` permet de contrôler les bandes de fréquences de l'audio (basses, moyennes et aigus) pour un ajustement sonore personnalisé.

- **Curseurs de Fréquence** : Comprend des curseurs pour les fréquences basses, médianes et hautes (basses, mid-bass, mid, et treble) permettant de modifier la tonalité de l'audio en temps réel.
- **Application de Filtres** : Utilisation de filtres biquad pour chaque bande de fréquence. Les valeurs des curseurs contrôlent les gains des filtres pour un ajustement dynamique.

### 4. Composant Visualisation : `audio-visualizer`
Le composant `audio-visualizer` affiche la visualisation en temps réel des fréquences audio sous forme de barres animées.

- **Affichage en Temps Réel** : Utilisation de l’AnalyserNode de l'API Web Audio pour analyser les fréquences et générer un graphique de visualisation en temps réel.
- **Animation Synchronisée** : L'animation est mise à jour en fonction de l'intensité des fréquences audio jouées, ce qui donne une représentation visuelle dynamique et interactive de la musique.

## Technologies Utilisées

- **Web Components** : Pour la modularité et la réutilisation de code avec des composants personnalisés.
- **API Web Audio** : Pour le contrôle de l'audio, la création de filtres d'égaliseur, et l'affichage en temps réel des fréquences.
- **HTML5 & CSS3** : Pour la structure et le style des composants.
  
## Comment Utiliser

1. **Installation** : Clonez le projet et placez-le sur un serveur local pour assurer le bon fonctionnement des composants HTML et de l'API Web Audio.
2. **Chargement de Pistes** : Ajoutez vos fichiers audio dans le dossier approprié et mettez à jour la liste des pistes dans le composant `audio-player.js`.
3. **Contrôle de l'Audio** : Utilisez les boutons de contrôle pour lire, mettre en pause, avancer et ajuster le volume et les fréquences.
  
## Structure des Fichiers

- `components/audio-player.js` : Composant principal qui gère l'audio et orchestre les sous-composants.
- `components/audio-playlist.js` : Composant de la playlist.
- `components/audio-equalizer.js` : Composant de l'égaliseur de fréquences.
- `components/audio-visualizer.js` : Composant de visualisation des fréquences.
- `components/audio-player.css` : Style principal du lecteur audio.
- `components/audio-equalizer.css`, `components/audio-playlist.css`, `components/audio-visualizer.css` : Styles pour chaque sous-composant.

## Exemple d'Utilisation

Une fois le lecteur lancé, vous pouvez :
1. Choisir une piste depuis la playlist.
2. Utiliser les curseurs de l'égaliseur pour ajuster les basses, moyennes, et hautes fréquences.
3. Observer l'animation de visualisation en temps réel qui réagit à la musique en cours de lecture.

## Auteurs

Ce projet a été développé pour illustrer l'intégration des Web Components avec l'API Web Audio.
