public class Instruments {
    
    fun void playBass(float note) {
        <<< "Playing Bass Note: " + note >>>;
        SinOsc osc => LPF filter => ADSR env => dac;
        
        env.set(10::ms, 50::ms, 0.6, 100::ms);
        
        400.0 => filter.freq;
        
        Std.mtof(note) => osc.freq;
        
        env.keyOn();
        200::ms => now;
        env.keyOff();
        100::ms => now;
    }

    fun void playPad(float note, float velocity) {
        <<< "Playing Pad Note: " + note + " with velocity: " + velocity >>>;
        SawOsc osc => ADSR env => NRev verb => dac;
        
        0.15 => verb.mix;
        env.set(300::ms, 200::ms, 0.5, 600::ms);
        
        Std.mtof(note) => osc.freq;
        velocity * 0.15 => osc.gain;
        
        env.keyOn();
        Global.quarter => now;
        env.keyOff();
    }

    fun void playLead(float note) {
        <<< "Playing Lead Note: " + note >>>;
        SinOsc mod => SinOsc car => ADSR env => JCRev rev => dac;
        
        0.1 => rev.mix;
        env.set(5::ms, 80::ms, 0.4, 100::ms);
        
        Std.mtof(note) => float freq;
        freq => car.freq;
        freq * 2.0 => mod.freq;
        300.0 => mod.gain;
        
        env.keyOn();
        150::ms => now;
        env.keyOff();
    }

    fun void playPerc(int type) {
        <<< "Playing Percussion Type: " + type >>>;
        if(type == 0) {
            SinOsc osc => ADSR env => dac;
            env.set(2::ms, 50::ms, 0.0, 10::ms);
            60.0 => osc.freq;
            env.keyOn();
            100::ms => now;
        }
        else if(type == 1) {
            Noise n => LPF f => ADSR env => dac;
            1200 => f.freq;
            env.set(2::ms, 80::ms, 0.0, 10::ms);
            0.4 => n.gain;
            env.keyOn();
            100::ms => now;
        }
    }
}