class AudioEqualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.loadHTML();
        this.loadCSS();

        window.addEventListener('audio-ready', (event) => {
            const { audioContext, sourceNode } = event.detail;
            this.initEqualizer(audioContext, sourceNode);
        });
    }

    async loadHTML() {
        try {
            const response = await fetch('https://ismailhiko.github.io/webComponentLecteurAudio/components/audio-equalizer/audio-equalizer.html');
            const html = await response.text();
            this.shadowRoot.innerHTML = html;
        } catch (error) {
            console.error('Erreur lors du chargement du fichier HTML:', error);
        }
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'components/audio-equalizer/audio-equalizer.css';
        this.shadowRoot.appendChild(link);
    }

    initEqualizer(audioContext, sourceNode) {
        // Créez les filtres pour Bass, Mid-Bass, Mid, et Treble
        this.filters = {
            bass: this.createFilter(audioContext, 'lowshelf', 100),
            midBass: this.createFilter(audioContext, 'peaking', 500),
            mid: this.createFilter(audioContext, 'peaking', 100),
            treble: this.createFilter(audioContext, 'highshelf', 80),
        };

        // Connecter les filtres en chaîne
        sourceNode.connect(this.filters.bass);
        this.filters.bass.connect(this.filters.midBass);
        this.filters.midBass.connect(this.filters.mid);
        this.filters.mid.connect(this.filters.treble);
        this.filters.treble.connect(audioContext.destination);

        this.audioContext = audioContext;

        // Ajoutez des écouteurs pour chaque slider
        this.addSliderListeners();
    }

    createFilter(audioContext, type, frequency) {
        const filter = audioContext.createBiquadFilter();
        filter.type = type;
        filter.frequency.value = frequency;
        filter.gain.value = 0; // Gain initial à 0 dB
        return filter;
    }

    addSliderListeners() {
        const sliders = {
            bassControl: this.filters.bass,
            midBassControl: this.filters.midBass,
            midControl: this.filters.mid,
            trebleControl: this.filters.treble,
        };

        Object.keys(sliders).forEach((sliderId) => {
            const slider = this.shadowRoot.getElementById(sliderId);
            const filter = sliders[sliderId];

            slider.addEventListener('input', (event) => {
                filter.gain.value = parseFloat(event.target.value);
            });
        });
    }
}

customElements.define('audio-equalizer', AudioEqualizer);
