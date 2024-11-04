class AudioEqualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div class="audio-equalizer">
                <label>Bass</label>
                <webaudio-slider id="bassControl" min="-10" max="10" value="0" step="0.1"></webaudio-slider>
                <label>Mid-Bass</label>
                <webaudio-slider id="midBassControl" min="-10" max="10" value="0" step="0.1"></webaudio-slider>
                <label>Mid</label>
                <webaudio-slider id="midControl" min="-10" max="10" value="0" step="0.1"></webaudio-slider>
                <label>Treble</label>
                <webaudio-slider id="trebleControl" min="-10" max="10" value="0" step="0.1"></webaudio-slider>
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
