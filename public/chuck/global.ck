public class Global {
    static Event @ tick;
    static dur quarter;
    static float bpm;
}

new Event @=> Global.tick;

120.0 => Global.bpm;

fun void updateTiming() {
    60.0 / Global.bpm => float secPerBeat;
    secPerBeat::second => Global.quarter;
}

updateTiming();

fun void clockLoop() {
    while(true) {
        Global.tick.broadcast();
        Global.quarter => now;
    }
}

spork ~ clockLoop();

while(true) { 1::second => now; }