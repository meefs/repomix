export const queryDart = `
; Comments
(comment) @comment
(documentation_comment) @comment

; Import and export statements
(import_or_export) @definition.import

; Class declaration
(class_definition
  name: (identifier) @name) @definition.class

; Enum declaration
(enum_declaration
  name: (identifier) @name) @definition.class

; Extension declaration
(extension_declaration
  name: (identifier) @name) @definition.class

; Function declaration
(function_signature
  name: (identifier) @name) @definition.function

; Constructor declaration
(method_signature
 (constructor_signature
  name: (identifier) @name)) @definition.method
`;
