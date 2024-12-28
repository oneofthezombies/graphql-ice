#![no_std]

use wasm_bindgen::prelude::*;
use web_sys::console;
use web_sys::js_sys::Object;

#[wasm_bindgen]
pub async fn graphql(args: &Object) -> Result<Object, JsError> {
    Ok(Object::new())
}

#[wasm_bindgen(js_name = graphqlSync)]
pub fn graphql_sync(args: &Object) -> Result<Object, JsError> {
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

#[wasm_bindgen(start)]
fn on_start() {
    console::log_1(&"GraphQL Ice initialized.".into());
}
