class AudioVisualizer extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'visualizer-canvas';

        const styleLink = document.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = 'components/audio-visualizer/audio-visualizer.css';

        shadow.appendChild(styleLink);
        shadow.appendChild(this.canvas);

        this.visualizer = null;
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