import { Lexer } from './src/lexer.js';
import * as Types from 'types.js';
// https://mathjs.org/
import * as math from 'mathjs';


/**
 * Clase principal que se encarga de procesar fórmulas y extraer variables.
 * usan el analizador léxico (lexer) y el motor de evaluación de fórmulas de mathjs.
 *
 * @class Repl - Clase principal que se encarga de procesar fórmulas y extraer variables.
 * @typedef {Repl}
 */
class Repl {

    /**
     * Fórmula literal
     *
     * @type {string}
     */
    formula_literal = '';
    /**
     * Instancia de mathjs
     *
     * @static
     * @type {*}
     */
    static math = math;

    skippable_words = [];
    /**
     * Creates an instance of Repl.
     *
     * @constructor
     */
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
     * @returns {Types.ParseFormulaResult} - Un objeto que contiene las variables extraídas, las fórmulas evaluables y los tokens generados.
     *
     */
    parse_formula = (text) => {
        text = this.sanitize_formula(text);
        this.formula_literal = text;
        const tokens = this.parse(text);
        return { ...this.get_variables(tokens) };
    }
    /**
    * Convierte un texto dado en una lista de tokens usando un analizador léxico (lexer).
    *
    * @param {string} text - El texto que se va a analizar y convertir en tokens.
    * @returns {Array<Types.TokenType>|undefined} - Retorna un array de tokens si el texto es válido, o `undefined` si no se proporciona texto.
    *
    * Cada token es un objeto con diferentes propiedades, como `type` y `literal`.
    */
    parse = (text) => {
        const tokens = [];
        if (!text) return;
        const line = text;
        const lexer = new Lexer({
            skippable_words: this.skippable_words
        }).new(line);
        for (let token = lexer.nextToken(); token.type !== 'EOF'; token = lexer.nextToken()) {
            tokens.push(token);
        }
        return tokens;
    }
    /**
     * Procesa el resultado de una fórmula, identifica las variables y genera fórmulas evaluables.
     *
     * @param {Array<Object>} result - Lista de tokens que representan una fórmula. Cada token puede contener diferentes propiedades como `type`, `code`, y `literal`.
     * @returns {Types.GetVariablesResult} - Un objeto que contiene las variables extraídas, las fórmulas evaluables y otros datos útiles.
     *
     */
    get_variables = (result) => {
        if (!result) {
            return {
                variables: [],
                evaluable_formula: '',
                formula_literal: '',
                tokens: [],
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
        return {
            variables: variables,
            non_evaluable_formula: non_evaluable_formula,
            evaluable_formula: evaluable_formula,
            formula_literal: this.formula_literal,
            tokens: result,
            error: null,
            evaluate_with: (variables) => {
                return this.#evaluate_with(evaluable_formula, variables);
            }
        };
    }
    /**
     * Description placeholder
     *
     * @param {*} formula
     * @returns {({ data: number; error: any; } | { data: number; error: any; })}
     */
    #evaluate(formula) {
        try {
            const res = math.evaluate(formula);
            return {
                data: res,
                error: null
            }
        }
        catch (e) {
            console.error(e);
            return {
                data: null,
                error: e
            }
        }
    }
    /**

    * Evalúa una fórmula con las variables proporcionadas.
    *
    * @param {string} evaluable_formula - Fórmula que se va a evaluar.
    * @param {Array<Types.TokenType>} variables - Lista de variables con sus valores numéricos.
    * @returns {Types.EvaluateWithResult} - Un objeto que contiene el resultado de la evaluación y otros datos útiles.
    **/
    #evaluate_with = (evaluable_formula, variables) => {
        if (!variables) {
            return 0;
        }
        const evaluable_formula_replaced = evaluable_formula.replace(/{(.*?)}/g, (_, p1) => {
            const variable = variables.find((obj) => {
                return obj.code === p1
            });
            return variable ? variable.value : 0;
        })
        const evaluation_result = this.#evaluate(evaluable_formula_replaced);
        if (evaluation_result.error) {
            return {
                data: { ...evaluation_result.data },
                error: evaluation_result.error,
                replaced_formula: evaluable_formula_replaced + ' = ' + evaluation_result.data
            }
        }
        return {
            data: evaluation_result.data,
            replaced_formula: evaluable_formula_replaced + ' = ' + evaluation_result.data,
            error: null
        }
    }
    run_with_variables = (formula, variables) => {
        return this.#evaluate_with(formula, variables);
    }
    /**
     * Sanitiza una fórmula, eliminando caracteres no deseados.
     *
     * @param {*} formula
     * @returns {*}
     */
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

        // remove commas
        formula = formula.replace(/,/g, '');

        // remove dots
        formula = formula.replace(/\./g, '');
        formula = formula.replace(/;/g, '');
        // remove [ and ]
        formula = formula.replace(/\[/g, '');
        formula = formula.replace(/\]/g, '');


        formula = formula.replace(/\{/g, '');
        formula = formula.replace(/\}/g, '');
        return formula;
    }
}
export { Repl };
