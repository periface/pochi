class TokenType {
    type = '';
    literal = '';
    code = '';
    constructor() {
        this.type = '';
        this.literal = '';
        this.code = '';
    }
}
const TOKENS = {
    '(': 'LPAREN',
    ')': 'RPAREN',
    '/': 'DIV',
    '*': 'MULT',
    '-': 'MINUS',
    '+': 'PLUS',
    '=': 'EQUAL',
    '^': 'POW',
    'ILLEGAL': 'ILLEGAL',
    'EOF': 'EOF',
    'IDENT': 'IDENT',
};

function lookupToken(token) {
    return TOKENS[token] || 'IDENT';
}
export { TokenType, lookupToken, TOKENS };
