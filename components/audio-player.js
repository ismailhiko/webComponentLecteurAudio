class AudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.tracks = [
            { title: 'Calme', src: 'audio.mp3' },
            { title: 'Motivation', src: 'audio2.mp3' },
            { title: 'Tristesse', src: 'audio3.mp3' }
        ];
        this.currentTrackIndex = 0;
    }

    async connectedCallback() {
        await this.loadHTML();
        this.loadCSS();

        this.audio = this.shadowRoot.getElementById('audio');
        this.audioSource = this.shadowRoot.getElementById('audioSource');

        this.visualizer = this.shadowRoot.querySelector('audio-visualizer');
        this.equalizer = this.shadowRoot.querySelector('audio-equalizer');
        this.playlist = this.shadowRoot.querySelector('audio-playlist');

        this.initAudioContext();

        this.equalizer.setFilters({
            bass: this.bassFilter,
            midBass: this.midBassFilter,
            mid: this.midFilter,
            treble: this.trebleFilter
        });

        this.playlist.setTracks(this.tracks);
        this.playlist.addEventListener('selecttrack', (e) => this.loadTrack(e.detail));

        this.visualizer.startVisualization(this.analyser);

        this.shadowRoot.getElementById('playButton').addEventListener('click', () => this.playAudio());
        this.shadowRoot.getElementById('pauseButton').addEventListener('click', () => this.pauseAudio());
        this.shadowRoot.getElementById('stopButton').addEventListener('click', () => this.stopAudio());
        this.shadowRoot.getElementById('forwardButton').addEventListener('click', () => this.forwardAudio());

        this.shadowRoot.getElementById('volumeControl').addEventListener('input', (e) => this.setVolume(e));
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
        source.connect(this.bassFilter);
        this.bassFilter.connect(this.midBassFilter);
        this.midBassFilter.connect(this.midFilter);
        this.midFilter.connect(this.trebleFilter);
        this.trebleFilter.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
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

    loadTrack(index) {
        this.currentTrackIndex = index;
        this.audioSource.src = this.tracks[index].src;
        this.audio.load();
        this.playAudio();
        this.playlist.highlightTrack(index);
    }
}

customElements.define('audio-player', AudioPlayer);
