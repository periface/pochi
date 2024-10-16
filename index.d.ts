declare module 'pochi' {
    import * as math from 'mathjs';
    export class Repl {
        formula_literal: string;
        static math: typeof math;

        constructor();

        /**
         * Sanitiza el texto de una fórmula, lo convierte en tokens y extrae las variables.
         *
         * @param {string} text - El texto de la fórmula que se va a sanitizar y analizar.
         * @returns {Object} - Un objeto que contiene las variables extraídas, las fórmulas evaluables y los tokens generados.
         */
        parse_formula(text: string): {
            variables: Array<{ type: string; code: string; literal: string }>;
            non_evaluable_formula: string;
            evaluable_formula: string;
            evaluable_formula_replaced: string;
            formula_literal: string;
            formula_tokens: Array<Object>;
            test_result: string;
            test_obj: Array<Object>;
            evaluate_with: (variables: Array<{ code: string; value: number }>) => number;
        };

        /**
         * Convierte un texto dado en una lista de tokens usando un analizador léxico (lexer).
         *
         * @param {string} text - El texto que se va a analizar y convertir en tokens.
         * @returns {Array<Object>|undefined} - Retorna un array de tokens si el texto es válido, o `undefined` si no se proporciona texto.
         */
        parse(text: string): Array<Object> | undefined;

        /**
         * Procesa el resultado de una fórmula, identifica las variables y genera fórmulas evaluables.
         *
         * @param {Array<Object>} result - Lista de tokens que representan una fórmula.
         * @returns {Object} - Un objeto con las variables extraídas, las fórmulas evaluables, y otros datos útiles.
         */
        get_variables(result: Array<Object>): {
            variables: Array<{ type: string; code: string; literal: string }>;
            non_evaluable_formula: string;
            evaluable_formula: string;
            evaluable_formula_replaced: string;
            formula_literal: string;
            formula_tokens: Array<Object>;
            test_result: string;
            test_obj: Array<Object>;
            evaluate_with: (variables: Array<{ code: string; value: number }>) => number;
        };

        sanitize_formula(formula: string): string;
        get_random_number(from: number, to: number): number;
    }
}
