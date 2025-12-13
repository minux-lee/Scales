// test.ck: Sound Test Loop (Not executed in webChucK)

<<< "--- Main Sequencer Started ---" >>>;

// 소리가 너무 크지 않게 마스터 볼륨 조절 (선택 사항)
0.8 => dac.gain; 

Instruments inst;

// 무한 루프: 음악을 계속 재생
while(true) {
    // === Beat 1 ===
    // Kick (Perc 0) + Bass (Do) + Pad (Do Chord)
    spork ~ inst.playPerc(0);       
    spork ~ inst.playBass(48);      // MIDI 48 = C3
    spork ~ inst.playPad(60, 0.6);  // MIDI 60 = C4
    spork ~ inst.playPad(64, 0.5);  // MIDI 64 = E4
    
    // 한 박자 대기 (Global 설정값 따름)
    Global.quarter => now;

    // === Beat 2 ===
    // Snare (Perc 1) + Bass (Do)
    spork ~ inst.playPerc(1);
    spork ~ inst.playBass(48);
    
    Global.quarter => now;

    // === Beat 3 ===
    // Kick (Perc 0) + Bass (Sol) + Lead Melody
    spork ~ inst.playPerc(0);
    spork ~ inst.playBass(55);      // MIDI 55 = G3
    spork ~ inst.playLead(72);      // MIDI 72 = C5 (High Note)
    
    Global.quarter => now;

    // === Beat 4 ===
    // Snare (Perc 1) + Bass (Sol)
    spork ~ inst.playPerc(1);
    spork ~ inst.playBass(55);
    
    Global.quarter => now;
}