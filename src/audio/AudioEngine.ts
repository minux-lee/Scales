import { Chuck } from 'webchuck';

class AudioEngine {
    public chuck: Chuck | null = null;
    public isReady: boolean = false;

    // 초기화 메서드
    async init() {
        if (this.chuck) return;

        try {
            // WebChucK 초기화
            this.chuck = await Chuck.init([]);

            await Promise.all([
                this.chuck.loadFile('./chuck/global.ck'),
                this.chuck.loadFile('./chuck/instruments.ck'),
                this.chuck.loadFile('./chuck/main.ck'),
                this.chuck.loadFile('./chuck/drums/808 Kick.wav'),
                this.chuck.loadFile('./chuck/drums/808 snare.wav'),
                this.chuck.loadFile('./chuck/drums/808 CH.wav')
            ]);

            this.chuck.runFile('global.ck');
            this.chuck.runFile('instruments.ck');
            this.chuck.runFile('main.ck');

            this.setupTickListener();

            this.isReady = true;
            console.log('Audio Engine Ready');
        } catch (e) {
            console.error('Audio Engine Init Failed:', e);
        }
    }

    private setupTickListener() {
        if (!this.chuck) return;
        // Logic placeholder
    }

    // 소리 트리거 메서드들
    public playBass(note: number, mix: number) {
        this.runCode(`Instruments inst; inst.playBass(${note},${mix});`);
    }

    public playPad(notes: number[], mix: number) {
        notes.forEach(n => {
            this.runCode(`Instruments inst; inst.playPad(${n}, 0.5,${mix});`);
        });
    }

    public playLead(note: number, mix: number) {
        this.runCode(`Instruments inst; inst.playLead(${note},${mix});`);
    }

    public playPerc(type: number, mix: number) {
        this.runCode(`Instruments inst; inst.playPerc(${type},${mix});`);
    }

    public setBPM(bpm: number) {
        this.runCode(`${bpm} => Global.bpm; updateTiming();`);
    }

    private runCode(code: string) {
        console.log(`[TS -> ChucK] ${code}`);
        if (this.chuck && this.isReady) {
            this.chuck.runCode(code);
        }
    }
}

export const audioEngine = new AudioEngine();