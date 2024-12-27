use std::panic;

use wasm_bindgen::prelude::*;
use web_sys::console;

#[wasm_bindgen]
#[derive(Debug)]
pub enum GraphQLError {
    Dummy,
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct GraphQLSchema {}

#[wasm_bindgen]
#[derive(Debug)]
pub struct ExecutionResult {
    errors: Option<Vec<GraphQLError>>,
    data: Option<JsValue>,
    extensions: Option<JsValue>,
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct GraphQLArgs {
    schema: GraphQLSchema,
    source: String,
}

#[wasm_bindgen]
pub async fn graphql(args: &GraphQLArgs) -> Result<ExecutionResult, JsError> {
    Ok(ExecutionResult {
        errors: None,
        data: None,
        extensions: None,
    })
}

#[wasm_bindgen(js_name = graphqlSync)]
pub fn graphql_sync(args: &GraphQLArgs) -> Result<ExecutionResult, JsError> {
    Ok(ExecutionResult {
        errors: None,
        data: None,
        extensions: None,
    })
}

#[wasm_bindgen(start)]
fn on_start() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    console::log_1(&"GraphQL Ice initialized.".into());
}
