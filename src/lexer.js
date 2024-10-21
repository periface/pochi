import { TokenType, lookupToken } from './token.js';
class Lexer {
    constructor({
        skippable_words = []
    }) {
        this.skippable_words = skippable_words;
    }
    input = '';
    position = 0;
    readPosition = 0;
    skippable_words = [];

    prevToken = ''
    ch = '';
    verbose = false;
    new = (input) => {
        this.input = input;
        this.readChar();
        return this;
    }
    skipWhiteChar = () => {
        while (this.ch === ' ' || this.ch === '\t' || this.ch === '\n' || this.ch === '\r') {
            this.readChar();
        }
    }
    nextToken = () => {
        let token = new TokenType();
        switch (this.ch) {
            case '=':
                token = new TokenType();
                token.type = 'EQUAL';
                token.literal = this.ch;
                break;
            case '(':
                token = new TokenType();
                token.type = 'LPAREN';
                token.literal = this.ch;
                break;
            case ')':
                token = new TokenType();
                token.type = 'RPAREN';
                token.literal = this.ch;
                break;
            case '+':
                token = new TokenType();
                token.type = 'PLUS';
                token.literal = this.ch;
                break;
            case '-':
                token = new TokenType();
                token.type = 'MINUS';
                token.literal = this.ch;
                break;
            case '/':
                token = new TokenType();
                token.type = 'DIV';
                token.literal = this.ch;
                break;
            case '*':
                token = new TokenType();
                token.type = 'MULT';
                token.literal = this.ch;
                break;
            case '^':
                token = new TokenType();
                token.type = 'POW';
                token.literal = this.ch;
                break;
            case '':
                token = new TokenType();
                token.type = 'EOF';
                token.literal = '';
                break;
            default:
                if (isLetter(this.ch)) {
                    token.literal = this.readIdentifier();
                    token.type = lookupToken(token.literal);
                    // concat until it's not a letter or digit
                    // this allows to get the whole word as variable
                    while (isLetter(this.ch) || isDigit(this.ch) || isSpace(this.ch)) {
                        token.literal += this.ch;
                        this.readChar();
                    }
                    // we add a code to the token to be able to identify it in the future
                    token.code = getFirstLeterFromWord(token.literal, this.skippable_words);
                    // check if token is repeated
                    // if it is, we add random one letter to the code
                    if (token.code === this.prevToken) {
                        token.code += this.#getRandomLetter();
                    }
                    this.prevToken = token.code;
                    return token;
                } else if (isDigit(this.ch)) {
                    token.literal = this.readNumber();
                    token.type = 'NUMBER';
                    while (isDigit(this.ch)) {
                        token.literal += this.ch;
                        this.readChar();
                    }
                    return token;
                } else {
                    if (isSpace(this.ch)) {
                        this.skipWhiteChar();
                        return this.nextToken();
                    }
                    token = new TokenType();
                    token.type = 'ILLEGAL';
                    token.literal = this.ch;
                }

        }
        this.readChar();
        return token;
    }
    #getRandomLetter = () => {
        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    readNumber = () => {
        let position = this.position;
        while (isDigit(this.ch)) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    }
    readIdentifier = () => {
        let position = this.position;
        while (isLetter(this.ch)) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    }
    readChar = () => {
        if (this.readPosition >= this.input.length) {
            this.ch = '';
        } else {
            this.ch = this.input[this.readPosition];
        }
        this.position = this.readPosition;
        this.readPosition += 1;
    }
    peekChar = () => {
        if (this.readPosition >= this.input.length) {
            return '';
        } else {
            return this.input[this.readPosition];
        }
    }
}
function isDigit(ch) {
    return '0' <= ch && ch <= '9';
}
function isSpace(ch) {
    return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
}
function isLetter(ch) {
    return ('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z') || ch === '_';
}
function newToken(tokenType, ch) {
    return {
        type: tokenType,
        literal: ch
    };
}
// to make token names
function getFirstLeterFromWord(str, skippable_words = []) {
    let result = '';
    let words = str.split(' ');
    skippable_words = skippable_words.map((word) => word.toLowerCase());
    // skip words that are in the skippable list
    if (skippable_words.length > 0) {
        words = words.filter((word) => {
            if (word === '') {
                return false;
            }
            return !skippable_words.includes(word.toLowerCase());
        });
    }

    for (let i = 0; i < words.length; i++) {
        result += (words[i][0] || '').toUpperCase();
    }
    return result;
}
export { Lexer, isDigit, isLetter, newToken };
