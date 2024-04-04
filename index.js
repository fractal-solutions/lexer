// Token types
const TOKEN_TYPE = {
    KEYWORD: 'KEYWORD',
    IDENTIFIER: 'IDENTIFIER',
    PUNCTUATOR: 'PUNCTUATOR',
    OPERATOR: 'OPERATOR',
    CONSTANT: 'CONSTANT',
    LITERAL: 'LITERAL'
};

// Regular expressions for token recognition
const TOKEN_REGEX = [
    [TOKEN_TYPE.KEYWORD, /\b(if|else|int|return)\b/], // Added word boundaries \b to match whole keywords
    [TOKEN_TYPE.IDENTIFIER, /[_a-zA-Z][_a-zA-Z0-9]*/],
    [TOKEN_TYPE.PUNCTUATOR, /[\(\)\{\}\,\;]/], // Simplified punctuator regex
    [TOKEN_TYPE.OPERATOR, /[>=]/], // Adjusted operator regex
    [TOKEN_TYPE.CONSTANT, /\b\d+\b/], // Added word boundaries \b to match whole constants
    [TOKEN_TYPE.LITERAL, /"([^"\\]|\\.)*"/] // Updated string literal regex to handle escapes properly
];


/**
 * Lexical Analyzer class.
 */
class Lexer {
    /**
     * Initialize the Lexer with code.
     * @param {string} code The code to be analyzed.
     */
    constructor(code) {
        this.code = code;
        this.tokens = [];
    }

    /**
     * Analyze the code and generate tokens.
     */
    analyze() {
        let lineNumber = 1;
        
        while (this.code.length > 0) {
            let match = null;
            
            for (const [tokenType, tokenRegex] of TOKEN_REGEX) {
                const pattern = new RegExp('^' + tokenRegex.source);
                match = pattern.exec(this.code);
                
                if (match) {
                    let value = match[0];
                    if (tokenType === TOKEN_TYPE.LITERAL) {
                        value = value.substring(1, value.length - 1); // Remove quotes
                    }
                    this.tokens.push([tokenType, value]);
                    this.code = this.code.substring(value.length).trimLeft();
                    break;
                }
            }
            
            if (!match) {
                // Provide an error message with line number and position
                console.log(`Lexical Error at line ${lineNumber}: Unrecognized token - ${this.code[0]}`);
                this.code = this.code.substring(1);
            }
            
            if (this.code.startsWith('\n')) {
                lineNumber++;
                this.code = this.code.substring(1); // Skip newline character
            }
        }
    }
    
}

// Test the lexer
const code = `
if (x > y) {
    printf("x is greater than y\n");
} else {
    printf("x is not greater than y\n");
}
int main() {
    return 0;
}
`;

const lexer = new Lexer(code);
lexer.analyze();
for (const token of lexer.tokens) {
    console.log(token);
}
