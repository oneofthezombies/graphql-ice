;; 파일명 예시: simple.wat
(module
  ;; (func (export "add") ...) -> "add"라는 이름으로 export
  (func (export "add") (param i32 i32) (result i32)
    ;; 첫 번째 파라미터(param 0) 읽기
    local.get 0
    ;; 두 번째 파라미터(param 1) 읽기
    local.get 1
    ;; 두 정수를 더하기
    i32.add
  )
)
