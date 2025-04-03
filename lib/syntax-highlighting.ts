import Prism from 'prismjs';
import 'prismjs/components/prism-lua'; // Import Lua language support

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