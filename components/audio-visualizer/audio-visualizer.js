import butterchurn from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';

class AudioVisualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div class="visualizer-container">
                <canvas id="visualizerCanvas"></canvas>
            </div>
        `;
    }

    connectedCallback() {
        this.loadCSS();

        // Initialisation du canvas
        this.canvas = this.shadowRoot.getElementById('visualizerCanvas');
        this.canvas.width = 800; // Taille initiale
        this.canvas.height = 600;

        // Redimensionnement dynamique
        window.addEventListener('resize', () => this.resizeCanvas());

        // Écoute de l'événement 'audio-ready'
        window.addEventListener('audio-ready', (event) => {
            const { audioContext, sourceNode } = event.detail;
            this.initButterchurn(audioContext, sourceNode);
        });
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'components/audio-visualizer/audio-visualizer.css';
        this.shadowRoot.appendChild(link);
    }

    resizeCanvas() {
        this.canvas.width = this.offsetWidth || 800;
        this.canvas.height = this.offsetHeight || 600;
        if (this.butterchurn) {
            this.butterchurn.setRendererSize(this.canvas.width, this.canvas.height);
        }
    }

    initButterchurn(audioContext, audioNode) {
        // Initialiser Butterchurn avec le contexte audio et le canvas
        this.butterchurn = butterchurn.createVisualizer(audioContext, this.canvas, {
            width: this.canvas.width,
            height: this.canvas.height,
        });

        // Connecter le nœud audio
        this.butterchurn.connectAudio(audioNode);


        // Démarrer le rendu
        this.renderButterchurn();
    }

    renderButterchurn() {
        const renderLoop = () => {
            requestAnimationFrame(renderLoop);
            this.butterchurn.render();
        };
        renderLoop();
    }
}

customElements.define('audio-visualizer', AudioVisualizer);
