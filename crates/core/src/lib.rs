#![no_std]

use wasm_bindgen::prelude::*;
use web_sys::js_sys::Object;
use web_sys::console;

#[wasm_bindgen]
pub fn start() {
    console::log_1(&"GraphQL Ice initialized.".into());
}

#[wasm_bindgen]
pub async fn graphql(args: &JsValue) -> Result<Object, JsError> {
    Ok(Object::new())
}

#[wasm_bindgen(js_name = graphqlSync)]
pub fn graphql_sync(args: &JsValue) -> Result<Object, JsError> {
    Ok(Object::new())
}

#[inline(never)]
fn trigger_panic_0() {
    panic!("panic triggered!");
}

#[inline(never)]
fn trigger_panic_1() {
    trigger_panic_0();
}

#[wasm_bindgen(js_name = triggerPanic)]
pub fn trigger_panic() {
    trigger_panic_1();
}
