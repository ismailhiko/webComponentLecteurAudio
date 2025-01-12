class AudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentTrackIndex = 0;
    }

    static get observedAttributes() {
        return ['src', 'playlist', 'eq'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src') {
            this.src = newValue; // Mise à jour de la source audio
        }
        if (name === 'playlist') {
            this.showPlaylist = newValue === 'true'; // Afficher/masquer la playlist
        }
        if (name === 'eq') {
            this.showEqualizer = newValue === 'true'; // Afficher/masquer l'égaliseur
        }
    }

    async connectedCallback() {
        await this.loadHTML();
        this.loadCSS();

        this.audio = this.shadowRoot.getElementById('audio');
        this.audioSource = this.shadowRoot.getElementById('audioSource');

        this.initAudioContext();
        this.setupEventListeners();

        window.dispatchEvent(new CustomEvent('audio-ready', {
            detail: {
                audioContext: this.audioContext,
                sourceNode: this.gainNode, // Utiliser le gainNode comme source
                analyser: this.analyser
            },
            bubbles: true,
            composed: true
        }));

        // Initialiser la piste si `src` est défini dans les attributs
        if (this.hasAttribute('src')) {
            this.src = this.getAttribute('src');
        }
    }

    async loadHTML() {
        const response = await fetch('components/audio-player/audio-player.html');
        const html = await response.text();
        this.shadowRoot.innerHTML = html;
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'components/audio-player/audio-player.css';
        this.shadowRoot.appendChild(link);
    }

    initAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sourceNode = this.audioContext.createMediaElementSource(this.audio);
        this.gainNode = this.audioContext.createGain();
        this.analyser = this.audioContext.createAnalyser();
    
        // Configuration de l'analyseur
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;
    
        // Connecter les nœuds audio dans le bon ordre
        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.gainNode.connect(this.audioContext.destination);
    
        // Émettre l'événement audio-ready APRÈS la configuration complète
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('audio-ready', {
                detail: {
                    audioContext: this.audioContext,
                    sourceNode: this.gainNode, // Utiliser le gainNode comme source
                    analyser: this.analyser
                },
                bubbles: true,
                composed: true
            }));
        }, 100);
    }

    setupEventListeners() {
        this.shadowRoot.getElementById('playButton').addEventListener('click', () => this.playAudio());
        this.shadowRoot.getElementById('pauseButton').addEventListener('click', () => this.pauseAudio());
        this.shadowRoot.getElementById('stopButton').addEventListener('click', () => this.stopAudio());
        this.shadowRoot.getElementById('forwardButton').addEventListener('click', () => this.forwardAudio());
        this.shadowRoot.getElementById('volumeControl').addEventListener('input', (e) => this.setVolume(e));

        const playlist = document.querySelector('audio-playlist');
        if (playlist) {
            playlist.addEventListener('selecttrack', (event) => {
                const index = event.detail.index;
                if (index !== undefined) {
                    this.loadTrack(index, playlist.tracks);
                }
            });
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
        }
    }

    get playing() {
        return !this.audio.paused;
    }

    get src() {
        return this.audio ? this.audio.src : '';
    }

    set src(value) {
        if (this.audio) {
            this.audio.src = value;
            this.audio.load();
        }
    }

    set showPlaylist(value) {
        const playlist = document.querySelector('audio-playlist');
        if (playlist) {
            playlist.style.display = value ? 'block' : 'none';
        }
    }

    set showEqualizer(value) {
        const equalizer = document.querySelector('audio-equalizer');
        if (equalizer) {
            equalizer.style.display = value ? 'block' : 'none';
        }
    }
}

customElements.define('audio-player', AudioPlayer);
