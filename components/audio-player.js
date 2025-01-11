class AudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentTrackIndex = 0;
    }

    async connectedCallback() {
        await this.loadHTML();
        this.loadCSS();

        this.audio = this.shadowRoot.getElementById('audio');
        this.audioSource = this.shadowRoot.getElementById('audioSource');

        this.initAudioContext();

        // Ajouter les écouteurs pour les boutons et les événements
        this.setupEventListeners();

        // Informer les autres composants que l'audio est prêt
        this.dispatchEvent(new CustomEvent('audio-ready', {
            detail: {
                audioElement: this.audio,
                audioContext: this.audioContext,
                sourceNode: this.sourceNode,
                analyser: this.analyser,
            },
            bubbles: true,
            composed: true,
        }));
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

    initAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.analyser = this.audioContext.createAnalyser();

        // Créez une seule instance MediaElementSourceNode
        this.sourceNode = this.audioContext.createMediaElementSource(this.audio);

        // Connecter les noeuds
        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    setupEventListeners() {
        // Boutons de contrôle audio
        this.shadowRoot.getElementById('playButton').addEventListener('click', () => this.playAudio());
        this.shadowRoot.getElementById('pauseButton').addEventListener('click', () => this.pauseAudio());
        this.shadowRoot.getElementById('stopButton').addEventListener('click', () => this.stopAudio());
        this.shadowRoot.getElementById('forwardButton').addEventListener('click', () => this.forwardAudio());
        this.shadowRoot.getElementById('volumeControl').addEventListener('input', (e) => this.setVolume(e));

        // Écouter les événements de sélection de piste depuis audio-playlist
        const playlist = document.querySelector('audio-playlist');
        if (playlist) {
            playlist.addEventListener('selecttrack', (event) => {
                const index = event.detail.index; // Récupérer l'index de la piste
                if (index !== undefined) {
                    this.loadTrack(index, playlist.tracks); // Charge la piste depuis la playlist
                } else {
                    console.error('Index is undefined in the selecttrack event.');
                }
            });
        } else {
            console.error('audio-playlist element not found.');
        }
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
        this.gainNode.gain.value = event.target.value;
    }

    loadTrack(index, tracks) {
        this.currentTrackIndex = index;
        const track = tracks[index];
        if (track) {
            this.audioSource.src = track.src;
            this.audio.load();
            this.playAudio();

            this.dispatchEvent(new CustomEvent('trackchange', {
                detail: { index },
                bubbles: true,
                composed: true,
            }));
        } else {
            console.error('Invalid track index:', index);
        }
    }
}

customElements.define('audio-player', AudioPlayer);
