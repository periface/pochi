import * as Types from './src/types.js';
import { Repl } from './index';
test('Repl', () => {
    const formulas = [
        {
            literal: "(Proyectos evaluados/Proyectos totales)*100",
            expected: "({PE}/{PT})*100",
            variables: ["PE", "PT"],
            values: [{
                code: "PE",
                value: 10,
            },
            {
                code: "PT",
                value: 100,
            }],
            expected_result: 10,
            test_result: "(10/100)*100 = 10",
        },
        {
            literal: "Proyectos evaluados/Proyectos. totales*100",
            expected: "{PE}/{PT}*100",
            variables: ["PE", "PT"],
            values: [{
                code: "PE",
                value: 10,
            },
            {
                code: "PT",
                value: 100,
            }],
            expected_result: 10,
            test_result: "10/100*100 = 10",
        },
        {
            literal: "Ventas totales/Proyectos totales",
            expected: "{VT}/{PT}",
            variables: ["VT", "PT"],
            values: [{
                code: "VT",
                value: 10,
            },
            {
                code: "PT",
                value: 100,
            }],
            expected_result: 0.1,
            test_result: "10/100 = 0.1",
        },
        {
            literal: "(Ventas totales-Ventas Canceladas)/Proyectos totales*100",
            expected: "({VT}-{VC})/{PT}*100",
            variables: ["VT", "VC", "PT"],
            values: [{
                code: "VT",
                value: 10,
            },
            {
                code: "VC",
                value: 2,
            },
            {
                code: "PT",
                value: 100,
            }],
            expected_result: 8,
            test_result: "(10-2)/100*100 = 8",
        },

        {
            literal: "(Ventas totales de la secretaria-Ventas Canceladas de la secretaria)/Proyectos totales*100",
            expected: "({VTS}-{VCS})/{PT}*100",
            variables: ["VTS", "VCS", "PT"],
            values: [{
                code: "VTS",
                value: 10,
            },
            {
                code: "VCS",
                value: 2,
            },
            {
                code: "PT",
                value: 100,
            }],
            expected_result: 8,
            test_result: "(10-2)/100*100 = 8",
        },
        {
            literal: `Suma del [tiempo] total; desde que se,.... solicita la cotización hasta que se integra en el expediente
/Número, total, de {contratos} realizados en el periodo
`,
            expected: `{STTDSCHIE}/{NTCRP}`,
            variables: ["STTDSCHIE", "NTCRP"],
            values: [{
                code: "STTDSCHIE",
                value: 10,
            },
            {
                code: "NTCRP",
                value: 100,
            }],
            expected_result: 0.1,
            test_result: "10/100 = 0.1",
        },
        {
            literal: `"(Elaboración de resguardos de bienes
muebles de reciente adquisición/
Número de Bienes Adquiridos) * 100
"`,
            expected: `({ERBMRA}/{NBA})*100`,
            variables: ["ERBMRA", "NBA"],
            values: [{
                code: "ERBMRA",
                value: 10,
            },
            {
                code: "NBA",
                value: 100,
            }],
            expected_result: 10,
            test_result: "(10/100)*100 = 10",

        },

        {
            literal: `"(axis/axios) * 100
"`,
            checkSame: true,
        }

    ]

    const repl = new Repl();
    // palabras que se pueden omitir
    repl.skippable_words = [
        "del",
        "la",
        "que",
        "se",
        "en",
        "el",
        "de",
    ]
    expect(repl).toBeDefined();
    for (let formula of formulas) {
        if (formula.checkSame) {
            const result = repl.parse_formula(formula.literal);
            console.log(result);
        }
        else {
            const result = repl.parse_formula(formula.literal);
            expect(result).toBeDefined();
            expect(result.variables).toBeDefined();
            expect(result.non_evaluable_formula).toBeDefined();
            expect(result.evaluable_formula).toBeDefined();
            expect(result.formula_literal).toBeDefined();
            expect(result.formula_literal).toBe(sanitize_formula(formula.literal));
            expect(result.evaluable_formula).toBe(formula.expected);
            const evaluated_result = result.evaluate_with(formula.values);
            expect(evaluated_result.error).toBeNull();
            expect(evaluated_result.replaced_formula).toBe(formula.test_result);
        }

    }
});


const sanitize_formula = (formula) => {
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
