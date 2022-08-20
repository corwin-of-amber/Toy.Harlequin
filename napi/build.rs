extern crate napi_build;
extern crate pkg_config;

fn main() {
  napi_build::setup();
  println!("cargo:rustc-link-arg=-L/opt/homebrew/lib");

  //pkg_config::probe_library("fluidsynth").unwrap();
}
