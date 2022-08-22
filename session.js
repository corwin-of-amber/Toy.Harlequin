var fluid = require('./napi');


var settings = fluid.new_fluid_settings();


var synth = fluid.new_fluid_synth(settings);


let sfont_id = fluid.fluid_synth_sfload(synth, "data/piano-1.sf2", false);
console.log(sfont_id);

let rc = fluid.fluid_synth_program_select(synth, 0, sfont_id, 0, 0);
console.log(rc);

let adriver = fluid.new_fluid_audio_driver(settings, synth);

fluid.fluid_synth_noteon(synth, 0, 60, 80);
setTimeout(() => fluid.fluid_settings_setnum(settings, "synth.gain", 2.0), 100);
setTimeout(() =>
    fluid.fluid_synth_noteon(synth, 0, 65, 80), 100);
setTimeout(() =>
    fluid.fluid_synth_noteon(synth, 0, 68, 80), 200);

setTimeout(() => fluid.fluid_synth_noteoff(synth, 0, 65), 1000);
setTimeout(() => {}, 3000);
