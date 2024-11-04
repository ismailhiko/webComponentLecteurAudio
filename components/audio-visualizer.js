class AudioVisualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.canvas = document.createElement('canvas');
        this.shadowRoot.appendChild(this.canvas);
    }

    connectedCallback() {
        this.loadCSS();
        this.canvasContext = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'components/audio-visualizer.css';
        this.shadowRoot.appendChild(link);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    startVisualization(analyser) {
        this.analyser = analyser;
        this.draw();
    }

    draw() {
        if (!this.analyser) return;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const drawLoop = () => {
            requestAnimationFrame(drawLoop);
            this.analyser.getByteFrequencyData(dataArray);
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const barWidth = (this.canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                this.canvasContext.fillStyle = `rgba(255, 255, 255, 0.7)`;
                this.canvasContext.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };
        drawLoop();
    }
}

customElements.define('audio-visualizer', AudioVisualizer);
