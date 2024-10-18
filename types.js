/**
 * Resultado de get_variables
 * @typedef {Object} GetVariablesResult
 * @property {Array<Types.TokenType>} variables - Lista de variables identificadas en la fórmula. Cada variable es un token de tipo `IDENT`.
 * @property {string} non_evaluable_formula - Fórmula original en la que las variables se mantienen como sus identificadores literales.
 * @property {string} evaluable_formula - Fórmula donde las variables han sido reemplazadas por su sintaxis evaluable (`{var}`).
 * @property {string} formula_literal - Representación literal de la fórmula original.
 * @property {Function} evaluate_with - Función que evalúa la fórmula utilizando las variables proporcionadas. Documentada por separado.
 * @property {Array<Types.TokenType>} tokens - Lista de tokens generados a partir de la fórmula.
 * @property {string} [error] - Mensaje de error si no se puede procesar la fórmula.
**/
/**
 * Tipo de resultado esperado de la función `parse_formula`.
 * @typedef {Object} ParseFormulaResult
 * @property {Array<Object>} tokens - Lista de tokens generados a partir de la fórmula.
 * @property {Array<Object>} variables - Lista de variables identificadas en la fórmula.
 * @property {string} non_evaluable_formula - Fórmula original en la que las variables se mantienen como sus identificadores literales.
 * @property {string} evaluable_formula - Fórmula donde las variables han sido reemplazadas por su sintaxis evaluable (`{var}`).
 * @property {string} evaluable_formula_replaced - Fórmula en la que las variables han sido reemplazadas por sus valores numéricos.
 * @property {string} formula_literal - Representación literal de la fórmula original.
 * @property {string} test_result - Resultado de la evaluación de la fórmula con los valores de prueba concatenado con la fórmula.
 * @property {Array<Object>} test_obj - Lista de objetos de prueba que contienen variables y sus valores de prueba generados aleatoriamente.
 * @property {Function} evaluate_with - Función que evalúa la fórmula utilizando las variables proporcionadas. Documentada por separado.
 * @property {string} [error] - Mensaje de error si no se puede procesar la fórmula.
 *
 **/
/**
 * Tipo de resultado esperado de la función `evaluate_with`.
 * @typedef {Object} EvaluateWithResult
 * @property {number} data - Resultado de la evaluación de la fórmula.
 * @property {string} replaced_formula - Fórmula en la que las variables han sido reemplazadas por sus valores numéricos.
 * @property {string} [error] - Mensaje de error si no se puede evaluar la fórmula.
 **/

/**
 * Variable utilizada para realizar cálculos matemáticos.
 * @typedef {Object} VariableInput
 * @property {string} code - Código de la variable.
 * @property {number} value - Valor numérico de la variable.
**/

/**
 * TokenType es un tipo de dato que representa el tipo de token generado por el parser.
 * @typedef {Object} TokenType
 * @property {string} type - Tipo del token.
 * @property {string} literal - Valor literal del token.
 * @property {string} code - Código de la variable.
**/

export default {
}
