/**
 * BaBa Translator - Core Logic
 */

const MAPPING = {
    'A': 'Ba', 'B': 'BaBa', 'C': 'BaBaBa', 'D': 'Baa', 'E': 'BaaBa',
    'F': 'BaaBaBa', 'G': 'Bab', 'H': 'BabBa', 'I': 'BabBab', 'J': 'Baaa',
    'K': 'BaaaBa', 'L': 'BaaaBaBa', 'M': 'Baab', 'N': 'BaabBa', 'O': 'BaabBab',
    'P': 'Baabb', 'Q': 'BaabbBa', 'R': 'BaabbBab', 'S': 'Babb', 'T': 'BabbBa',
    'U': 'BabbBab', 'V': 'Babbb', 'W': 'BabbbBa', 'X': 'BabbbBab', 'Y': 'Baaaa',
    'Z': 'BaaaaBa', ' ': '/', '.': '.', ',': ','
};
const REVERSE_MAPPING = Object.fromEntries(Object.entries(MAPPING).map(([k, v]) => [v, k]));

/**
 * Fun Audio System
 */
const AudioSys = {
    ctx: null,
    enabled: true,

    init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    toggle() {
        this.enabled = !this.enabled;
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
        return this.enabled;
    },

    playTone(freq, type, duration) {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    // Funky random pitch for typing
    playType() {
        // Random pentatonic-ish frequencies
        const freqs = [330, 440, 494, 554, 660, 880];
        const freq = freqs[Math.floor(Math.random() * freqs.length)];
        this.playTone(freq, 'sine', 0.1);
    },

    playSuccess() {
        this.playTone(554, 'sine', 0.1);
        setTimeout(() => this.playTone(660, 'sine', 0.2), 100);
    },

    playClick() {
        this.playTone(800, 'triangle', 0.05);
    }
};


class App {
    constructor() {
        this.engInput = document.getElementById('input-eng');
        this.babaInput = document.getElementById('input-baba');
        this.visualizer = document.getElementById('visualizer');
        this.historyLog = document.getElementById('history-log');

        this.history = [];
        this.ignoreEvent = false;

        // Init Audio on first interaction
        document.body.addEventListener('click', () => AudioSys.init(), { once: true });
        document.body.addEventListener('keydown', () => AudioSys.init(), { once: true });

        // Event Listeners
        this.engInput.addEventListener('input', () => this.handleEngInput());
        this.babaInput.addEventListener('input', () => this.handleBabaInput());

        // Initialize Map
        this.renderMap();

        // Check URL Hash for shared content
        if (location.hash.length > 1) {
            try {
                const decoded = atob(decodeURIComponent(location.hash.substring(1)));
                this.engInput.value = decoded;
                this.handleEngInput();
            } catch (e) { console.error("Invalid Hash"); }
        }
    }

    renderMap() {
        const mapContent = document.getElementById('map-content');
        if (mapContent) {
            mapContent.className = 'mapping-grid';
            mapContent.innerHTML = '';
            for (let [k, v] of Object.entries(MAPPING)) {
                mapContent.innerHTML += `
                    <div class="map-item">
                        <span class="map-char">${k === ' ' ? 'SPC' : k}</span>
                        <span class="map-code">${v}</span>
                    </div>`;
            }
        }
    }

    handleEngInput() {
        if (this.ignoreEvent) return;
        AudioSys.playType();

        const text = this.engInput.value.toUpperCase();
        let result = [];
        let visHTML = "";

        for (let char of text) {
            if (char === '\n') { result.push('\n'); visHTML += `<div style="width:100%"></div>`; continue; }
            const mapped = MAPPING[char];
            if (mapped) {
                result.push(mapped);
                visHTML += `<div class="chip"><span>${char}</span>${mapped}</div>`;
            } else {
                result.push(char);
                visHTML += `<div class="chip" style="opacity:0.5; border-color:#ccc; color:#888;"><span>${char}</span>?</div>`;
            }
        }

        this.ignoreEvent = true;
        this.babaInput.value = result.join(' ');
        this.ignoreEvent = false;

        this.visualizer.innerHTML = visHTML || `<div style="width:100%; text-align:center; color:#999; margin-top:30px; font-weight:600;">Types something nice! 🌈</div>`;
        this.debouncedSave();
    }

    handleBabaInput() {
        if (this.ignoreEvent) return;
        AudioSys.playType();

        const text = this.babaInput.value;
        const tokens = text.split(/\s+/);
        let result = "";
        let visHTML = "";

        for (let token of tokens) {
            if (!token) continue;
            const char = REVERSE_MAPPING[token];
            if (char) {
                result += char;
                visHTML += `<div class="chip"><span>${char}</span>${token}</div>`;
            } else {
                result += "?";
                visHTML += `<div class="chip" style="border-color:red; color:red;"><span>?</span>${token}</div>`;
            }
        }

        this.ignoreEvent = true;
        this.engInput.value = result;
        this.ignoreEvent = false;

        this.visualizer.innerHTML = visHTML || `<div style="width:100%; text-align:center; color:#999; margin-top:30px; font-weight:600;">Types something nice! 🌈</div>`;
        this.debouncedSave();
    }

    debouncedSave() {
        clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => this.addToHistory(this.engInput.value), 2000);
    }

    addToHistory(text) {
        if (!text || (this.history.length > 0 && this.history[0] === text)) return;
        this.history.unshift(text);
        if (this.history.length > 20) this.history.pop();
        this.renderHistory();
    }

    renderHistory() {
        this.historyLog.innerHTML = this.history.map(t =>
            `<div class="history-item" onclick="app.loadHistory('${t.replace(/'/g, "\\'")}')">${t.substring(0, 30)}${t.length > 30 ? '...' : ''}</div>`
        ).join('');
    }

    loadHistory(text) {
        this.engInput.value = text;
        this.handleEngInput();
        AudioSys.playSuccess();
    }

    copy(type) {
        const el = type === 'eng' ? this.engInput : this.babaInput;
        el.select();
        document.execCommand('copy');
        AudioSys.playSuccess();
    }

    clear() {
        this.engInput.value = "";
        this.babaInput.value = "";
        this.visualizer.innerHTML = `<div style="width:100%; text-align:center; color:#999; margin-top:30px; font-weight:600;">Types something nice! 🌈</div>`;
        AudioSys.playClick();
    }

    download() {
        const content = `SOURCE:\n${this.engInput.value}\n\nTRANSLATED:\n${this.babaInput.value}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'baba_rainbow.txt';
        a.click();
        AudioSys.playSuccess();
    }

    share() {
        const b64 = btoa(this.engInput.value);
        location.hash = b64;
        navigator.clipboard.writeText(location.href);
        alert("Rainbow Link Copied! 🌈");
        AudioSys.playSuccess();
    }

    toggleAudio() {
        const enabled = AudioSys.toggle();
        const btn = document.getElementById('audio-btn');
        btn.innerHTML = enabled ? "🔊 Sound ON" : "🔇 Sound OFF";
        btn.classList.toggle('muted', !enabled);
    }

    toggleMap() {
        document.getElementById('map-modal').classList.toggle('open');
        AudioSys.playClick();
    }
}

const app = new App();
