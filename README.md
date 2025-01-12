# WebComponents Audio Player

Un lecteur audio modulaire basé sur des **Web Components**, intégrant des fonctionnalités avancées comme une **playlist interactive**, un **égaliseur graphique**, et un **visualiseur audio**. Ce projet offre une solution personnalisable et extensible pour la lecture audio.

---

## Fonctionnalités principales

- **Lecteur audio intégré** : Contrôles de base (lecture, pause, arrêt, avance rapide).
- **Playlist interactive** :
  - Gestion des morceaux avec drag-and-drop.
  - Sélection et surlignage des morceaux actifs.
- **Égaliseur graphique** :
  - Contrôle des fréquences audio via des sliders interactifs.
  - Fonctionnalité d’égalisation en temps réel.
- **Visualiseur audio** :
  - Animations dynamiques synchronisées avec l’audio.
- **Conception modulaire** :
  - Les composants sont autonomes et peuvent être intégrés indépendamment.

---

## Structure du projet

Voici les principaux fichiers et dossiers :

```
.
├── components/
│   ├── audio-player/
│   │   ├── audio-player.js
│   │   ├── audio-player.html
│   │   └── audio-player.css
│   ├── audio-playlist/
│   │   ├── audio-playlist.js
│   │   ├── audio-playlist.html
│   │   └── audio-playlist.css
│   ├── audio-equalizer/
│   │   ├── audio-equalizer.js
│   │   ├── audio-equalizer.html
│   │   └── audio-equalizer.css
│   └── audio-visualizer/
│       ├── audio-visualizer.js
│   │   ├── audio-visualizer.html
│       └── audio-visualizer.css
├── index.html
├── styles.css
└── README.md
```

---

## Technologies utilisées

- **Web Components** :
  - Utilisation des API natives (Custom Elements, Shadow DOM).
- **JavaScript** :
  - Événements personnalisés, gestion dynamique du DOM.
- **Web Audio API** :
  - Création et manipulation des nœuds audio pour l’égaliseur et le visualiseur.
- **HTML & CSS** :
  - Interface utilisateur avec styles personnalisés et responsive.

---

## Hébergement

Ce projet est hébergé sur **GitHub Pages** et peut être consulté ici :  
👉 **[Lien GitHub Pages](https://ismailhiko.github.io/webComponentLecteurAudio)**

Pour tester le projet directement dans votre navigateur, vous pouvez également utiliser **CodePen** :  
👉 **[Lien CodePen](https://codepen.io/ismailhiko)**

---

## Installation et lancement

### 1. Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/WebComponentsAudioPlayer.git
cd WebComponentsAudioPlayer
```

### 2. Lancer en local

Ouvrez le fichier `index.html` dans votre navigateur.
ou
lancer avec live serve


### 3. Inclure les composants dans votre propre projet

Ajoutez les scripts suivants dans votre HTML :

```html
<script src="https://ismailhiko.github.io/WebComponentsAudioPlayer/components/audio-player/audio-player.js"></script>
<script src="https://ismailhiko.github.io/WebComponentsAudioPlayer/components/audio-playlist/audio-playlist.js"></script>
<script src="https://ismailhiko.github.io/WebComponentsAudioPlayer/components/audio-equalizer/audio-equalizer.js"></script>
<script src="https://ismailhiko.github.io/WebComponentsAudioPlayer/components/audio-visualizer/audio-visualizer.js"></script>
```

Ajoutez ensuite les composants à votre page :

```html
<audio-player src="audio.mp3"></audio-player>
<audio-playlist></audio-playlist>
<audio-equalizer></audio-equalizer>
<audio-visualizer></audio-visualizer>
```

---

## Démonstration vidéo

Une vidéo explicative décrivant le projet est disponible ici :  
👉 **[Lien vers la vidéo](https://votre-lien-youtube-ou-autre-plateforme.com)**

---

## Fonctionnement détaillé

### 1. Audio Player
- Contrôles : Lecture, pause, arrêt, avance rapide.
- Gestion des volumes via un bouton rotatif.

### 2. Playlist
- Les morceaux peuvent être réarrangés grâce au **drag-and-drop**.
- Sélectionne et surligne automatiquement le morceau actif.

### 3. Égaliseur
- Sliders interactifs pour ajuster les basses, les moyennes et les hautes fréquences.
- Connecté au contexte audio pour un rendu en temps réel.

### 4. Visualiseur
- Affiche des animations basées sur les fréquences audio en temps réel.

---




---

Si vous avez des questions ou des suggestions, n'hésitez pas à ouvrir une **issue** sur GitHub ou à me contacter directement ! 🚀

