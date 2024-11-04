// components/audio-player.js

class AudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.tracks = [
            { title: 'calme', src: 'audio.mp3' },
            { title: 'motivation', src: 'audio2.mp3' },
            { title: 'tristesse', src: 'audio3.mp3' }
        ];
        this.currentTrackIndex = 0;
    }

    async connectedCallback() {
        // Charger le CSS et le HTML externes
        await this.loadHTML();
        this.loadCSS();

        // Initialisation des éléments et des événements
        this.audio = this.shadowRoot.getElementById('audio');
        this.audioSource = this.shadowRoot.getElementById('audioSource');
        this.canvas = this.shadowRoot.getElementById('visualizer');
        this.canvasContext = this.canvas.getContext('2d');
        
        // Initialiser le contexte audio et les contrôles audio
        this.initAudioContext();

        // Contrôles de base
        this.shadowRoot.getElementById('playButton').addEventListener('click', () => this.playAudio());
        this.shadowRoot.getElementById('pauseButton').addEventListener('click', () => this.pauseAudio());
        this.shadowRoot.getElementById('stopButton').addEventListener('click', () => this.stopAudio());
        this.shadowRoot.getElementById('forwardButton').addEventListener('click', () => this.forwardAudio());

        // Contrôle de volume via le bouton rotatif WebAudioControl
        this.shadowRoot.getElementById('volumeControl').addEventListener('input', (e) => this.setVolume(e));

        // Ajouter les événements pour chaque contrôleur de l'égaliseur
        this.shadowRoot.getElementById('bassControl').addEventListener('input', (e) => this.setBassGain(e));
        this.shadowRoot.getElementById('midBassControl').addEventListener('input', (e) => this.setMidBassGain(e));
        this.shadowRoot.getElementById('midControl').addEventListener('input', (e) => this.setMidGain(e));
        this.shadowRoot.getElementById('trebleControl').addEventListener('input', (e) => this.setTrebleGain(e));

        
        // Initialiser la visualisation des fréquences
        this.initAudioVisualizer();
        
        // Afficher la playlist
        this.loadPlaylist();

        // Adapter le canvas en fonction de la taille de la fenêtre
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
    }

    async loadHTML() {
        const response = await fetch('components/audio-player.html');
        const html = await response.text();
        this.shadowRoot.innerHTML = html;
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'components/audio-player.css';
        this.shadowRoot.appendChild(link);
    }

    // Initialiser le contexte audio et les nœuds
    initAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.analyser = this.audioContext.createAnalyser();
        
        const source = this.audioContext.createMediaElementSource(this.audio);
        
        // Chaîne de connexion : Source → Gain → Analyser → Destination
        source.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

     // Initialiser le contexte audio et les nœuds
     initAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.analyser = this.audioContext.createAnalyser();

        // Initialiser les filtres de l'égaliseur
        this.bassFilter = this.audioContext.createBiquadFilter();
        this.bassFilter.type = 'lowshelf';
        this.bassFilter.frequency.setValueAtTime(100, this.audioContext.currentTime);

        this.midBassFilter = this.audioContext.createBiquadFilter();
        this.midBassFilter.type = 'peaking';
        this.midBassFilter.frequency.setValueAtTime(500, this.audioContext.currentTime);

        this.midFilter = this.audioContext.createBiquadFilter();
        this.midFilter.type = 'peaking';
        this.midFilter.frequency.setValueAtTime(1000, this.audioContext.currentTime);

        this.trebleFilter = this.audioContext.createBiquadFilter();
        this.trebleFilter.type = 'highshelf';
        this.trebleFilter.frequency.setValueAtTime(3000, this.audioContext.currentTime);

        const source = this.audioContext.createMediaElementSource(this.audio);

        // Chaîne de connexion : Source → Filtres → Gain → Analyser → Destination
        source.connect(this.bassFilter);
        this.bassFilter.connect(this.midBassFilter);
        this.midBassFilter.connect(this.midFilter);
        this.midFilter.connect(this.trebleFilter);
        this.trebleFilter.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    // Méthodes de contrôle d'égaliseur
    setBassGain(event) {
        this.bassFilter.gain.setValueAtTime(event.target.value, this.audioContext.currentTime);
    }

    setMidBassGain(event) {
        this.midBassFilter.gain.setValueAtTime(event.target.value, this.audioContext.currentTime);
    }

    setMidGain(event) {
        this.midFilter.gain.setValueAtTime(event.target.value, this.audioContext.currentTime);
    }

    setTrebleGain(event) {
        this.trebleFilter.gain.setValueAtTime(event.target.value, this.audioContext.currentTime);
    }

    playAudio() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        this.audio.play();
    }

    pauseAudio() {
        this.audio.pause();
    }

    stopAudio() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    forwardAudio() {
        this.audio.currentTime += 10;
    }

    setVolume(event) {
        const volume = event.target.value;
        this.gainNode.gain.value = volume;
    }

    // Méthodes de gestion de la playlist
    loadPlaylist() {
        const trackList = this.shadowRoot.getElementById('trackList');
        trackList.innerHTML = '';

        this.tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.title;
            li.addEventListener('click', () => this.loadTrack(index));
            trackList.appendChild(li);
        });

        this.highlightActiveTrack();
    }

    loadTrack(index) {
        this.currentTrackIndex = index;
        this.audioSource.src = this.tracks[index].src;
        this.audio.load();
        this.playAudio();
        this.highlightActiveTrack();
    }

    highlightActiveTrack() {
        const trackItems = this.shadowRoot.querySelectorAll('#trackList li');
        trackItems.forEach((item, idx) => {
            item.classList.toggle('active', idx === this.currentTrackIndex);
        });
    }

    // Méthode pour adapter la taille du canvas à la fenêtre
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initAudioVisualizer() {
        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            requestAnimationFrame(draw);
            this.analyser.getByteFrequencyData(dataArray);

            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const barWidth = (this.canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                this.canvasContext.fillStyle = `rgba(255, 255, 255, 0.7)`;
                this.canvasContext.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        draw();
    }
}

// Déclaration du composant
customElements.define('audio-player', AudioPlayer);
