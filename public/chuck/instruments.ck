public class Instruments {

    fun void playBass(float note, int mix, int md) {
        <<< "Playing Bass Note: " + note >>>;
        SinOsc osc => LPF filter => ADSR env => dac;
        
        env.set(10::ms, 200::ms, Math.min(0.1*(mix-1),1.0), 100::ms);
        0.7 => osc.gain;
        
        400.0 => filter.freq;
        
        Std.mtof(note - 12.0) => osc.freq;
        
        env.keyOn();
        Global.quarter => now;
        env.keyOff();
        100::ms => now;
    }

    fun void playPad(float note, float velocity, int mix, int md) {
        <<< "Playing Pad Note: " + note + " with velocity: " + velocity >>>;
        SawOsc osc1 => ADSR env => LPF lpf => NRev verb => dac;
        SawOsc osc2 => env;
        SawOsc osc3 => env;
        
        0.15 => verb.mix;
        env.set(100::ms, 200::ms, 0.7, 100::ms);

        1000.0 => lpf.freq;
        
        Std.mtof(note) => osc1.freq;
        velocity * 0.15 => osc1.gain;
        Std.mtof(note+0.02*(mix-1)) => osc2.freq;
        velocity * 0.15 => osc2.gain;
        Std.mtof(note-0.02*(mix-1)) => osc3.freq;
        velocity * 0.15 => osc3.gain;
        
        env.keyOn();
        Global.quarter => now;
        env.keyOff();
        Global.quarter*2.0 => now;
    }

    fun void playLead(float note, float mix, int md) {
        <<< "Playing Lead Note: " + note >>>;
        SqrOsc osc => LPF lpf => ADSR env => NRev rev => dac;
        SinOsc lfo => blackhole;

        8.0 => lfo.freq;
        3.0 => float depth;

        2000.0 => lpf.freq;

        0.03*(mix-1.0) => rev.mix;
        env.set(5::ms, 80::ms, 1.0, 300::ms);
        
        Std.mtof(note+12) => float freq;
        freq => osc.freq;
        0.1 => osc.gain;
        
        env.keyOn();
        for(0=>int i; i<90; i++){
            freq + lfo.last()*depth => osc.freq;
            Global.quarter/100.0=>now;
        }
        env.keyOff();
        for(0=>int i; i<200; i++){
            freq + lfo.last()*depth => osc.freq;
            Global.quarter/100.0=>now;
        }
    }

    fun void playPerc(int type, int mix, int md) {
        <<< "Playing Percussion Type: " + type >>>;
        SndBuf buffer => NRev rev => dac;
        0.02*(mix - 1) => rev.mix;
        if(type == 0) {
            "808 Kick.wav" => buffer.read;
        }
        else if(type == 1) {
            "808 snare.wav" => buffer.read;
        }
        else if(type == 2) {
            "808 CH.wav" => buffer.read;
        }
        buffer.samples() => buffer.pos;
        0 => buffer.pos;
        0.1 => buffer.gain;
        buffer.length() + 0.5::second => now;
    }

    fun void onTick(int beatCount, string mode, int x, int y, string instrument, string dir, int length) {
        <<< "Tick: " + beatCount + " Instrument: " + mode + instrument + " Position: (" + x + "," + y + ") Direction: " + dir + " Length: " + length >>>;
        int d_i;
        if(dir == "UP") 0 => d_i;
        else if(dir == "DOWN") 1 => d_i;
        else if(dir == "RIGHT") 2 => d_i;
        else if(dir == "LEFT") 3 => d_i;
        
        if(mode == "ARABIC"){
            if(instrument == "BASS"){
                [45,45,52,57,50,50,57,62]@=>int Notes[];
                playBass(Notes[((beatCount % 8)/4)*4 + d_i], length, 0);
            }
            else if(instrument == "PAD"){
                [45,49, 49,52, 45,52, 49,57, 50,53, 53,57, 50,57, 53,62] @=> int Notes[];
                if(beatCount % 2 == 0){
                    spork ~ playPad(Notes[((beatCount % 8)/4)*8 + ((x + y)%4)*2], 1.0, length, 0);
                    playPad(Notes[((beatCount % 8)/4)*8 + ((x + y)%4)*2 + 1], 1.0, length, 0);
                }
            }
            else if(instrument == "LEAD"){
                [57, 58, 61, 62, 64, 65, 68, 69]@=>int Notes[];
                spork ~ playLead(Notes[x], length, 0);
                Global.quarter/2.0 => now;
                playLead(Notes[y], length, 0);
            }
            else if(instrument == "PERC"){
                [0,1,2]@=>int Notes[];
                spork~playPerc(Notes[beatCount % 2], length, 0);
                Global.quarter/2.0 => now;
                if(d_i%2==0){
                    spork~playPerc(Notes[2], length, 0);
                    Global.quarter/4.0 => now;
                    playPerc(Notes[2], length, 0);
                }
                else{
                    playPerc(Notes[2], length, 0);
                }
                
            }
        }

        if(mode == "ORCHESTRAL"){
            if(instrument == "BASS"){
                [36, 36, 43, 48,
                41, 41, 48, 53,
                43, 43, 50, 55,
                36, 36, 43, 48] @=> int Notes[];
                playBass(Notes[((beatCount % 8)/2)*4 + d_i], length, 1);
            }
            else if(instrument == "PAD"){
                [48, 51, 51, 55, 48, 55, 51, 60,
                53, 56, 56, 60, 53, 60, 56, 65,
                55, 59, 59, 62, 55, 62, 59, 67,
                48, 51, 51, 55, 48, 55, 51, 60]
                @=> int Notes[];
                if(beatCount % 2 == 0){
                    spork ~ playPad(Notes[((beatCount % 16)/4)*8 + ((x + y)%4)*2], 1.0, length, 1);
                    playPad(Notes[((beatCount % 16)/4)*8 + ((x + y)%4)*2 + 1], 1.0, length, 1);
                }
            }
            else if(instrument == "LEAD"){
                [60, 62, 63, 65, 67, 68, 71, 72]@=>int Notes[];
                spork ~ playLead(Notes[x], length, 1);
                Global.quarter/2.0 => now;
                playLead(Notes[y], length, 1);
            }
            else if(instrument == "PERC"){
                [0,1,2]@=>int Notes[];
                spork~playPerc(Notes[beatCount % 2], length, 0);
                Global.quarter/2.0 => now;
                if(d_i%2==0){
                    spork~playPerc(Notes[2], length, 0);
                    Global.quarter/4.0 => now;
                    playPerc(Notes[2], length, 0);
                }
                else{
                    playPerc(Notes[2], length, 0);
                }
                
            }
        }
    }
}