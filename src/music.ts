import * as fluid from '../../napi';  /* @kremlin.native */


class Music {
    synth: any

    constructor() {
        var settings = fluid.new_fluid_settings(),
            synth = fluid.new_fluid_synth(settings);
        
        fluid.fluid_settings_setnum(settings, "synth.gain", 1.0);

        let sfont_id = fluid.fluid_synth_sfload(synth, "data/piano-1.sf2", false);
        console.log("loaded font:", sfont_id);
        
        let chan = 0, prog = 0;
        let rc = fluid.fluid_synth_program_select(synth, 0, sfont_id, chan, prog);
        if (rc !== 0) throw new Error("failed to select program; rc="+rc);
        
        fluid.new_fluid_audio_driver(settings, synth);
        this.synth = synth;
    }

    play() {
        const V = 100;
        this.playNote('C2', V, 1000);
        setTimeout(() => this.playNote('G2', V, 1000), 500);
        setTimeout(() => this.playNote('D#3', V, 1000), 1000);

        this.playNote('C4', V, 800);
        setTimeout(() => this.playNote('C4', V, 500), 1500);
        setTimeout(() => this.playNote('D4', V, 1500), 2000);
    }

    playNote(note: string | number, vel: number, duration?: number) {
        if (typeof note === 'string') note = this.noteToMidi(note);
        let synth = this.synth;
        fluid.fluid_synth_noteon(synth, 0, note, vel);
        if (duration)
            setTimeout(() => fluid.fluid_synth_noteoff(synth, 0, note), duration);
    }

    stopNote(note: string | number) {
        if (typeof note === 'string') note = this.noteToMidi(note);
        let synth = this.synth;
        fluid.fluid_synth_noteoff(synth, 0, note);
    }

    noteToMidi(note: string) {
        let [, s_note, s_octave] = note.match(/^(.*?)(\d*)$/),
            octave = s_octave ? parseInt(s_octave) : 4,
            note_idx = MIDI_NOTES.indexOf(s_note);

        if (note_idx === -1) throw new Error(`invalid note '${note}'`);
        
        return note_idx + 12 * (octave + 1);
    }
}


const MIDI_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];


export { Music }