class AudioVisualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.loadHTML();
        this.loadCSS();

        this.visualizer = null;
    }

    async loadHTML() {
        try {
            const response = await fetch('https://ismailhiko.github.io/webComponentLecteurAudio/components/audio-visualizer/audio-visualizer.html');
            const html = await response.text();
            this.shadowRoot.innerHTML = html;
            this.canvas = this.shadowRoot.querySelector('#visualizer-canvas');
        } catch (error) {
            console.error('Erreur lors du chargement du fichier HTML:', error);
        }
    }

    async loadCSS() {
        try {
            const response = await fetch('https://ismailhiko.github.io/webComponentLecteurAudio/components/audio-visualizer/audio-visualizer.css');
            const css = await response.text();
            const style = document.createElement('style');
            style.textContent = css;
            this.shadowRoot.appendChild(style);
        } catch (error) {
            console.error('Erreur lors du chargement du fichier CSS:', error);
        }
    }

    connectedCallback() {
        window.addEventListener('audio-ready', (event) => {
            const { audioContext, sourceNode } = event.detail;
            this.initVisualizer(audioContext, sourceNode);
        });

        this.handleResize();
    }

    initVisualizer(audioContext, sourceNode) {
        try {
            this.visualizer = butterchurn.default.createVisualizer(audioContext, this.canvas, {
                width: this.canvas.clientWidth,
                height: this.canvas.clientHeight,
            });
    
            this.visualizer.connectAudio(sourceNode);
            
            this.startRendering();
        } catch (error) {
            console.error('Error initializing visualizer:', error);
        }
    }

    handleResize() {
        const resizeCanvas = () => {
            this.canvas.width = this.offsetWidth || 800;
            this.canvas.height = this.offsetHeight || 600;

            if (this.visualizer) {
                this.visualizer.setRendererSize(this.canvas.width, this.canvas.height);
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    }

    startRendering() {
        if (!this.isRendering) {
            this.isRendering = true;
            const render = () => {
                if (this.visualizer && this.isRendering) {
                    this.visualizer.render();
                    requestAnimationFrame(render);
                }
            };
            requestAnimationFrame(render);
        }
    }

    disconnectedCallback() {
        this.isRendering = false;
        if (this.visualizer) {
            try {
                this.visualizer.disconnectAudio();
                this.visualizer = null;
            } catch (error) {
                console.error('Error during cleanup:', error);
            }
        }
    }
}

customElements.define('audio-visualizer', AudioVisualizer);