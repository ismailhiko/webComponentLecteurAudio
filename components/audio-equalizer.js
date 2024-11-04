class AudioEqualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <div class="audio-equalizer">
            <div class="slider-container">
                <label>Bass</label>
                <webaudio-knob id="bassControl" 
                src="../knobs/ST_Fader_230x69_128f.png" 
                value="10" step="0.01" 
                sprites="127"  
                width=100
                tooltip="Knob1 tooltip %d"></webaudio-knob>

            </div>

            <div class="slider-container">
                <label>Mid-Bass</label>
                <webaudio-knob id="midBassControl" 
                src="../knobs/ST_Fader_230x69_128f.png" 
                value="10" step="0.01" 
                sprites="127"  
                width=100
                tooltip="Knob1 tooltip %d"></webaudio-knob>
            </div>
            <div class="slider-container">
                <label>Mid</label>
                <webaudio-knob id="midControl"
                src="../knobs/ST_Fader_230x69_128f.png" 
                value="10" step="0.01" 
                sprites="127"  
                width=100
                tooltip="Knob1 tooltip %d"></webaudio-knob>
            </div>
            <div class="slider-container">
                <label>Treble</label>
                <webaudio-knob id="trebleControl" 
                src="../knobs/ST_Fader_230x69_128f.png" 
                value="10" step="0.01" 
                sprites="127"  
                width=100
                tooltip="Knob1 tooltip %d"></webaudio-knob>
            </div>
        </div>
    `;
    }

    connectedCallback() {
        this.loadCSS();
        this.shadowRoot.getElementById('bassControl').addEventListener('input', (e) => this.updateBass(e));
        this.shadowRoot.getElementById('midBassControl').addEventListener('input', (e) => this.updateMidBass(e));
        this.shadowRoot.getElementById('midControl').addEventListener('input', (e) => this.updateMid(e));
        this.shadowRoot.getElementById('trebleControl').addEventListener('input', (e) => this.updateTreble(e));
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'components/audio-equalizer.css';
        this.shadowRoot.appendChild(link);
    }

    setFilters(filters) {
        this.bassFilter = filters.bass;
        this.midBassFilter = filters.midBass;
        this.midFilter = filters.mid;
        this.trebleFilter = filters.treble;
    }

    updateBass(event) {
        if (this.bassFilter) this.bassFilter.gain.value = event.target.value;
    }

    updateMidBass(event) {
        if (this.midBassFilter) this.midBassFilter.gain.value = event.target.value;
    }

    updateMid(event) {
        if (this.midFilter) this.midFilter.gain.value = event.target.value;
    }

    updateTreble(event) {
        if (this.trebleFilter) this.trebleFilter.gain.value = event.target.value;
    }
}

customElements.define('audio-equalizer', AudioEqualizer);
