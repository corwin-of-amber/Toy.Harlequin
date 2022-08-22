#![allow(dead_code)]

#[macro_use]
extern crate napi_derive;

use libc::{c_double, c_int};

#[repr(C)]
#[allow(non_camel_case_types)]
pub struct fluid_settings_t { #[allow(dead_code)] dummy: u32 }

#[repr(C)]
#[allow(non_camel_case_types)]
pub struct fluid_synth_t { #[allow(dead_code)] dummy: u32 }

#[repr(C)]
#[allow(non_camel_case_types)]
pub struct fluid_audio_driver_t { #[allow(dead_code)] dummy: u32 }

#[link(name = "fluidsynth")]
extern {
  fn new_fluid_settings() -> *mut fluid_settings_t;
  fn new_fluid_synth(settings: *mut fluid_settings_t) -> *mut fluid_synth_t;
  // settings.h
  fn fluid_settings_setnum(settings: *mut fluid_settings_t, name: *const u8, val: c_double) -> c_int;
  // sfont.h
  fn fluid_synth_sfload(synth: *mut fluid_synth_t, filename: *const u8, reset_presets: c_int) -> c_int;
  // synth.h
  fn fluid_synth_program_select(synth: *mut fluid_synth_t, chan: c_int, sfont_id: c_int,
                                bank_num: c_int, preset_num: c_int) -> c_int;
  fn fluid_synth_noteon(synth: *mut fluid_synth_t, chan: c_int, key: c_int, vel: c_int) -> c_int;
  fn fluid_synth_noteoff(synth: *mut fluid_synth_t, chan: c_int, key: c_int) -> c_int;
  // audio.h
  fn new_fluid_audio_driver(settings: *mut fluid_settings_t, synth: *mut fluid_synth_t) -> *mut fluid_audio_driver_t;
}

struct Opaque<T> { ptr: *mut T }

/* unfortunately, cannot `#[napi]` a generic type */

#[napi]
pub struct FluidSettings { o: Opaque<fluid_settings_t> }
#[napi]
pub struct FluidSynth { o: Opaque<fluid_synth_t> }
#[napi]
pub struct FluidAudioDriver { o: Opaque<fluid_audio_driver_t> }

#[napi]
impl FluidSettings {
  pub fn from(ptr: *mut fluid_settings_t) -> Self {
    Self { o: Opaque { ptr } }
  }
}

#[napi(js_name = "new_fluid_settings")]
pub fn js_new_fluid_settings() -> FluidSettings {
  FluidSettings::from(unsafe { new_fluid_settings() })
}


#[napi]
impl FluidSynth {
  pub fn from(ptr: *mut fluid_synth_t) -> Self {
    Self { o: Opaque { ptr } }
  }
}

#[napi(js_name = "new_fluid_synth")]
pub fn js_new_fluid_synth(settings: &FluidSettings) -> FluidSynth {
  FluidSynth::from(unsafe { new_fluid_synth(settings.o.ptr) })
}


#[napi]
impl FluidAudioDriver {
  pub fn from(ptr: *mut fluid_audio_driver_t) -> Self {
    Self { o: Opaque { ptr } }
  }
}

#[napi(js_name = "new_fluid_audio_driver")]
pub fn js_new_fluid_audio_driver(settings: &FluidSettings, synth: &FluidSynth) -> FluidAudioDriver {
  FluidAudioDriver::from(unsafe { new_fluid_audio_driver(settings.o.ptr, synth.o.ptr) })
}

#[napi(js_name = "fluid_synth_sfload")]
pub fn js_fluid_synth_sfload(synth: &FluidSynth, filename: String, reset_presets: bool) -> c_int {
  unsafe { fluid_synth_sfload(synth.o.ptr, filename.as_ptr(),
                              reset_presets as c_int) }
}

#[napi(js_name = "fluid_synth_program_select")]
pub fn js_fluid_synth_program_select(synth: &FluidSynth, chan: c_int, sfont_id: c_int,
                                     bank_num: c_int, preset_num: c_int) -> c_int {
  unsafe { fluid_synth_program_select(synth.o.ptr, chan,
                                      sfont_id, bank_num, preset_num) }
}

#[napi(js_name = "fluid_synth_noteon")]
fn js_fluid_synth_noteon(synth: &FluidSynth, chan: c_int, key: c_int, vel: c_int) -> c_int {
  unsafe { fluid_synth_noteon(synth.o.ptr, chan, key, vel) }
}

#[napi(js_name = "fluid_synth_noteoff")]
fn js_fluid_synth_noteoff(synth: &FluidSynth, chan: c_int, key: c_int) -> c_int {
  unsafe { fluid_synth_noteoff(synth.o.ptr, chan, key) }
}

#[napi(js_name = "fluid_settings_setnum")]
fn js_fluid_settings_setnum(settings: &FluidSettings, name: String, val: c_double) -> c_int {
  unsafe { fluid_settings_setnum(settings.o.ptr, name.as_ptr(), val) }
}
