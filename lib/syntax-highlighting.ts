import Prism from 'prismjs';
import 'prismjs/components/prism-lua'; // Import Lua language support

/**
 * Interface for Lua script validation result
 */
export interface LuaValidationResult {
    isValid: boolean;
    errors: Array<{
        line: number;
        message: string;
    }>;
}

/**
 * Basic Lua syntax validator
 * This provides basic syntax validation - not a full Lua parser
 *
 * @param code The Lua code to validate
 * @returns Validation result with any errors
 */
export function validateLuaCode(code: string): LuaValidationResult {
    if (!code) return {isValid: true, errors: []};

    const errors: Array<{ line: number; message: string }> = [];
    const lines = code.split('\n');

    // Stack for tracking block statements
    const blockStack: Array<{ type: string; line: number }> = [];

    // Regular expressions for basic syntax validation
    const unbalancedQuotes = /(?:^|[^\\])(['"]).*(?:[^\\]|$)\1/;
    const functionDef = /\bfunction\b/;
    const ifStatement = /\bif\b.*\bthen\b/;
    const whileLoop = /\bwhile\b.*\bdo\b/;
    const forLoop = /\bfor\b.*\bdo\b/;
    const endBlock = /\bend\b/;

    // Check for balance of blocks
    lines.forEach((line, idx) => {
        const lineNumber = idx + 1;

        // Skip comments
        if (line.trim().startsWith('--')) return;

        // Check for unbalanced quotes
        if ((line.match(/"/g)?.length ?? 0) % 2 !== 0 || (line.match(/'/g)?.length ?? 0) % 2 !== 0) {
            if (!line.match(unbalancedQuotes)) {
                errors.push({
                    line: lineNumber,
                    message: 'Unbalanced quotes'
                });
            }
        }

        // Track block statements
        if (line.match(functionDef)) {
            blockStack.push({type: 'function', line: lineNumber});
        } else if (line.match(ifStatement)) {
            blockStack.push({type: 'if', line: lineNumber});
        } else if (line.match(whileLoop)) {
            blockStack.push({type: 'while', line: lineNumber});
        } else if (line.match(forLoop)) {
            blockStack.push({type: 'for', line: lineNumber});
        } else if (line.match(endBlock)) {
            if (blockStack.length === 0) {
                errors.push({
                    line: lineNumber,
                    message: 'Unexpected "end" without matching block'
                });
            } else {
                blockStack.pop();
            }
        }
    });

    // Check for unclosed blocks
    blockStack.forEach(block => {
        errors.push({
            line: block.line,
            message: `Unclosed "${block.type}" block`
        });
    });

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Highlights Lua code using Prism.js
 *
 * @param code The Lua code string to highlight
 * @returns HTML string with syntax highlighting
 */
export function highlightLuaCode(code: string): string {
    if (!code) return "";

    // Highlight the code using Prism.js
    return Prism.highlight(code, Prism.languages.lua, 'lua');
}

/**
 * Highlights Lua code with line numbers
 *
 * @param code The Lua code to highlight
 * @returns HTML string with syntax highlighting and line numbers
 */
export function highlightLuaCodeWithLineNumbers(code: string): string {
    if (!code) return "";

    const lines = code.split('\n');
    const highlightedLines = lines.map((line, index) => {
        const lineNumber = index + 1;
        const highlightedLine = Prism.highlight(line, Prism.languages.lua, 'lua');
        return `<div class="line"><span class="line-number">${lineNumber}</span><span class="line-content">${highlightedLine}</span></div>`;
    });

    return highlightedLines.join('');
}