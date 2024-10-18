import * as Types from './types';
declare module 'pochi' {
    import * as math from 'mathjs';

    /**
     * Clase principal de la librería Pochi.
     * @class
     * @classdesc Clase principal de la librería Pochi.
     * @constructor
     * @example
     * const Pochi = require('pochi');
     * const repl = new Pochi.Repl();
     * const result = repl.parse('2 + 2');
     * console.log(result);
     *
    **/
    export class Repl {
        formula_literal: string;
        static math: typeof math;

        constructor();

        /**
         * Sanitiza el texto de una fórmula, lo convierte en tokens y extrae las variables.
         * @param {string} text - El texto de la fórmula que se va a sanitizar y analizar.
         * @returns {Types.ParseFormulaResult} ParseFormulaResult - Un objeto que contiene las variables extraídas, las fórmulas evaluables y los tokens generados.
         */
        parse_formula(text: string): Types.ParseFormulaResult;
        /**
         * Convierte un texto dado en una lista de tokens usando un analizador léxico (lexer).
         *
         * @param {string} text - El texto que se va a analizar y convertir en tokens.
         * @returns {Array<Types.TokenType>|undefined} - Retorna un array de tokens si el texto es válido, o `undefined` si no se proporciona texto.
         */
        parse(text: string): Array<Types.TokenType> | undefined;
        /**
         * Procesa el resultado de una fórmula, identifica las variables y genera fórmulas evaluables.
         *
         * @param {Array<Object>} result - Lista de tokens que representan una fórmula.
         * @returns {Object} - Un objeto con las variables extraídas, las fórmulas evaluables, y otros datos útiles.
         */
        get_variables(result: Array<Types.GetVariablesResult>): Types.GetVariablesResult;
        sanitize_formula(formula: string): string;
    }
}
