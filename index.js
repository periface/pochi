import { Lexer } from './lexer.js';
//POWERED BY MATHJS
// https://mathjs.org/
import * as math from 'mathjs';

class Repl {

    formula_literal = '';
    static math = math;
    constructor() {

        console.log(`%c   ||
  ..           .
o--     \    / @)
 v__///\\__/ @
   {           }
    {  } \{  }
    <_|      <_|c
____awowoooouuuu!________

`, 'font-family:monospace');
    }

    /**
     * Sanitiza el texto de una fórmula, lo convierte en tokens y extrae las variables.
     *
     * @param {string} text - El texto de la fórmula que se va a sanitizar y analizar.
     * @returns {Object} - Un objeto que contiene las variables extraídas, las fórmulas evaluables y los tokens generados.
     *
     * @property {Array<Object>} tokens - Los tokens generados a partir del análisis léxico de la fórmula.
     *
     * @see sanitize_formula - Función que limpia y normaliza el texto de la fórmula.
     * @see parse - Función que convierte el texto en tokens.
     * @see get_variables - Función que extrae las variables de los tokens y genera fórmulas evaluables.
     */
    parse_formula = (text) => {
        text = this.sanitize_formula(text);
        this.formula_literal = text;
        const tokens = this.parse(text);
        return { ...this.get_variables(tokens), tokens: tokens };
    }
    /**
    * Convierte un texto dado en una lista de tokens usando un analizador léxico (lexer).
    *
    * @param {string} text - El texto que se va a analizar y convertir en tokens.
    * @returns {Array<Object>|undefined} - Retorna un array de tokens si el texto es válido, o `undefined` si no se proporciona texto.
    *
    * Cada token es un objeto con diferentes propiedades, como `type` y `literal`.
    */
    parse = (text) => {
        const tokens = [];
        if (!text) return;
        const line = text;
        const lexer = new Lexer().new(line);
        for (let token = lexer.nextToken(); token.type !== 'EOF'; token = lexer.nextToken()) {
            tokens.push(token);
        }
        return tokens;
    }
    /**
     * Procesa el resultado de una fórmula, identifica las variables y genera fórmulas evaluables.
     *
     * @param {Array<Object>} result - Lista de tokens que representan una fórmula. Cada token puede contener diferentes propiedades como `type`, `code`, y `literal`.
     * @returns {Object} - Un objeto que contiene las variables extraídas, las fórmulas evaluables y otros datos útiles.
     *
     * @property {Array<Object>} variables - Lista de variables identificadas en la fórmula. Cada variable es un token de tipo `IDENT`.
     * @property {string} non_evaluable_formula - Fórmula original en la que las variables se mantienen como sus identificadores literales.
     * @property {string} evaluable_formula - Fórmula donde las variables han sido reemplazadas por su sintaxis evaluable (`{var}`).
     * @property {string} evaluable_formula_replaced - Fórmula en la que las variables han sido reemplazadas por sus valores numéricos.
     * @property {string} formula_literal - Representación literal de la fórmula original.
     * @property {Array<Object>} formula_tokens - Lista completa de tokens generados a partir de la fórmula.
     * @property {string} test_result - Resultado de la evaluación de la fórmula con los valores de prueba concatenado con la fórmula.
     * @property {Array<Object>} test_obj - Lista de objetos de prueba que contienen variables y sus valores de prueba generados aleatoriamente.
     * @property {Function} evaluate_with - Función que evalúa la fórmula utilizando las variables proporcionadas. Documentada por separado.
     * @property {string} [error] - Mensaje de error si no se puede procesar la fórmula.
     */
    get_variables = (result) => {
        if (!result) {
            return {
                variables: [],
                evaluable_formula: '',
                evaluable_formula_replaced: '',
                formula_literal: '',
                formula_tokens: [],
                test_obj: [],
                error: 'Error al parsear la fórmula',
            };
        }

        // TODO: More complex
        // We should replace the variables in the old formula with  the new ones
        // ex. "(Número de contratos con MiPyMES/Número total de contratos realizados en el periodo)*100"
        // should be replaced with "({a}/{b})*100" in a new variable called evaluable_formula
        // using the result from pochi

        const variables = result.filter((token) => token.type === 'IDENT');

        let evaluable_formula = '';
        let non_evaluable_formula = '';
        const test_obj = [
        ]
        let ident_tokens = result.map((token) => {
            if (token.type === 'IDENT') {
                evaluable_formula += `{${token.code}}`;
                non_evaluable_formula += `${token.code}`
                return token;
            }
            else {
                evaluable_formula += token.literal;
                non_evaluable_formula += token.literal;
            }
        });
        ident_tokens = ident_tokens.filter((token) => token);
        for (let token of ident_tokens) {
            test_obj.push({
                variable: token,
                value: this.get_random_number(1, 100)
            });

        }
        const evaluable_formula_replaced = evaluable_formula.replace(/{(.*?)}/g, (_, p1) => {
            const variable = test_obj.find((obj) => {
                return obj.variable.code === p1
            });
            return variable ? variable.value : 0;
        })
        // test
        const test_result = math.evaluate(evaluable_formula_replaced);
        const test_result_concat = evaluable_formula_replaced + ' = ' + test_result;
        return {
            variables: variables,
            non_evaluable_formula: non_evaluable_formula,
            evaluable_formula: evaluable_formula,
            evaluable_formula_replaced: evaluable_formula_replaced,
            formula_literal: this.formula_literal,
            formula_tokens: result,
            test_result: test_result_concat,
            test_obj: test_obj,
            /**
            * Evalúa una fórmula reemplazando variables por sus valores correspondientes.
            *
            * @param {Array<Object>} variables - Lista de objetos que contienen las variables y sus valores. Cada objeto debe tener las propiedades `code` y `value`.
            * @returns {number} - El resultado de evaluar la fórmula matemática.
            */
            evaluate_with: this.evaluate_with,
        };
    }
    evaluate_with = (variables) => {
        if (!variables) {
            return 0;
        }
        const evaluable_formula_replaced = evaluable_formula.replace(/{(.*?)}/g, (_, p1) => {
            const variable = variables.find((obj) => {
                return obj.code === p1
            });
            return variable ? variable.value : 0;
        })
        return math.evaluate(evaluable_formula_replaced);
    }
    sanitize_formula = (formula) => {
        // remove accents
        const accents = 'áéíóúÁÉÍÓÚ';
        const accentsOut = 'aeiouAEIOU';
        formula = formula.split('').map((letter) => {
            const index = accents.indexOf(letter);
            if (index > -1) {
                return accentsOut[index];
            }
            return letter;
        }).join('');
        // remove "" and ''
        formula = formula.replace(/["']/g, '');
        // remove double spaces
        formula = formula.replace(/\s+/g, ' ');
        // remove line breaks
        formula = formula.replace(/\n/g, '');
        // remove tabs
        formula = formula.replace(/\t/g, '');
        // remove line jumps
        formula = formula.replace(/\r/g, '');
        return formula;
    }
    get_random_number = (from, to) => {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

}
export { Repl };
