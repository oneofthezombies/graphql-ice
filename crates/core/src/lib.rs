use std::panic::set_hook;

use console_error_panic_hook::hook;
use wasm_bindgen::prelude::*;
use web_sys::console::log_1;

#[wasm_bindgen]
pub async fn hello() -> Result<JsValue, JsValue> {
    log_1(&"hello".into());
    Ok(JsValue::null())
}

#[wasm_bindgen(start)]
fn main() {
    set_hook(Box::new(hook));
    log_1(&"Core started".into());
}
