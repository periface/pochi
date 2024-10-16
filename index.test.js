import { Repl } from './index';
test('Repl', () => {
    const repl = new Repl();
    expect(repl).toBeDefined();
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
        },
        {
            literal: "Proyectos evaluados/Proyectos totales*100",
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
        },
    ]
    for (let formula of formulas) {
        const result = repl.parse_formula(formula.literal);
        expect(result).toBeDefined();
        expect(result.variables).toBeDefined();
        expect(result.non_evaluable_formula).toBeDefined();
        expect(result.evaluable_formula).toBeDefined();
        expect(result.evaluable_formula_replaced).toBeDefined();
        expect(result.formula_literal).toBeDefined();
        expect(result.formula_literal).toBe(formula.literal);
        expect(result.evaluable_formula).toBe(formula.expected);
        const evaluated_result = result.evaluate_with(formula.values);
        expect(evaluated_result).toBe(formula.expected_result);
    }
});
