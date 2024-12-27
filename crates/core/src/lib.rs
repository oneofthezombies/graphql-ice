use std::panic;

use wasm_bindgen::prelude::*;
use web_sys::console;

#[wasm_bindgen]
pub async fn ping() -> Result<String, JsError> {
    Ok("pong".to_string())
}

#[wasm_bindgen]
pub struct ExecutorImpl {
    value: JsValue,
}

#[wasm_bindgen]
impl ExecutorImpl {
    fn new(value: &JsValue) -> Self {
        Self {
            value: value.clone(),
        }
    }

    pub async fn create(value: &JsValue) -> Result<ExecutorImpl, JsError> {
        Ok(ExecutorImpl::new(value))
    }

    pub async fn execute(&self) -> Result<JsValue, JsError> {
        Ok(self.value.clone())
    }
}

#[wasm_bindgen(start)]
fn start() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    console::log_1(&"Core started".into());
}
