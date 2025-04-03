// Utility functions for syntax highlighting Lua code

// Define colors for different syntax elements
export const syntaxColors = {
  comment: "#10b981", // Green
  keyword: "#c084fc", // Purple
  function: "#60a5fa", // Blue
  string: "#fcd34d", // Yellow
  number: "#f87171", // Red
  operator: "#e879f9", // Pink
  variable: "#d1d5db", // Light gray
}

/**
 * Apply syntax highlighting to Lua code
 */
export function highlightLuaCode(code: string): string {
  return (
    code
      // Comments
      .replace(/(--[^\n]*)/g, `<span style="color: ${comment}">$1</span>`)
      // Keywords
      .replace(
        /\b(function|local|end|if|then|else|elseif|while|do|for|in|return|break|nil|true|false|and|or|not)\b/g,
        `<span style="color: ${syntaxColors.keyword}">$1</span>`,
      )
      // Function calls
      .replace(/(\w+)(\s*\()/g, `<span style="color: ${function}">$1</span>$2`)
      // Strings
      .replace(/"([^"]*)"/g, `<span style="color: ${string}">"$1"</span>`)
      .replace(/'([^']*)'/g, `<span style="color: ${string}">'$1'</span>`)
      // Numbers
      .replace(/\b(\d+(\.\d+)?)\b/g, `<span style="color: ${number}">$1</span>`)
  )
}

