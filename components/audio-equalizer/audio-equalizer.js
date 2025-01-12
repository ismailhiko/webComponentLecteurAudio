class AudioEqualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <div class="audio-equalizer">
            <div class="slider-container">
                <label for="bassControl">Bass</label>
                <webaudio-knob 
                    id="bassControl" 
                    src="src="https://ismailhiko.github.io/webComponentLecteurAudio/assets/knobs/ST_Fader_230x69_128f.png" 
                    min="-10" max="10" value="0" step="0.1" 
                    sprites="127"  
                    width="100" 
                    height="100" 
                    tooltip="Bass %d dB">
                </webaudio-knob>
            </div>
            <div class="slider-container">
                <label for="midBassControl">Mid-Bass</label>
                <webaudio-knob 
                    id="midBassControl" 
                    src="https://ismailhiko.github.io/webComponentLecteurAudio/assets/knobs/ST_Fader_230x69_128f.png" 
                    min="-10" max="10" value="0" step="0.1" 
                    sprites="127"  
                    width="100" 
                    height="100" 
                    tooltip="Mid-Bass %d dB">
                </webaudio-knob>
            </div>
            <div class="slider-container">
                <label for="midControl">Mid</label>
                <webaudio-knob 
                    id="midControl" 
                    src="https://ismailhiko.github.io/webComponentLecteurAudio/assets/knobs/ST_Fader_230x69_128f.png" 
                    min="-10" max="10" value="0" step="0.1" 
                    sprites="127"  
                    width="100" 
                    height="100" 
                    tooltip="Mid %d dB">
                </webaudio-knob>
            </div>
            <div class="slider-container">
                <label for="trebleControl">Treble</label>
                <webaudio-knob 
                    id="trebleControl" 
                    src="https://ismailhiko.github.io/webComponentLecteurAudio/assets/knobs/ST_Fader_230x69_128f.png" 
                    min="-10" max="10" value="0" step="0.1" 
                    sprites="127"  
                    width="100" 
                    height="100" 
                    tooltip="Treble %d dB">
                </webaudio-knob>
            </div>
        </div>
        `;
    }

    connectedCallback() {
        this.loadCSS();

        window.addEventListener('audio-ready', (event) => {
            const { audioContext, sourceNode } = event.detail;
            this.initEqualizer(audioContext, sourceNode);
        });
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
