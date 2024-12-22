use wasm_bindgen::prelude::*;
use web_sys::console;

#[wasm_bindgen]
pub async fn hello() -> Result<JsValue, JsValue> {
    console::log_1(&"hello".into());
    Ok(JsValue::null())
}

#[wasm_bindgen(start)]
fn start() -> Result<(), JsValue> {
    console::log_1(&"start".into());
    Ok(())
}
