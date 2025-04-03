export interface APIParameter {
    name: string
    type: string
    description: string
    defaultValue?: string
    options?: string[] // For parameters with predefined options
}

export interface APIFunction {
    name: string
    description: string
    parameters: APIParameter[]
    returnType: string
    returnDescription: string
    category?: string // For better categorization
    complexity?: "simple" | "medium" | "complex" // To indicate function complexity
}

export interface APICategory {
    name: string
    functions: APIFunction[]
    description?: string // Add description for each category
}

export interface ScriptParameter {
    name: string
    value: string
    type: string
    description: string
    options?: string[] // For parameters with predefined options
}

export interface ControlStatement {
    type: "if" | "while" | "for" | "end" | "function"
    condition?: string
    loopVariable?: string
    startValue?: string
    endValue?: string
    stepValue?: string
    functionName?: string
    functionParams?: string
    functionBody?: string
    inMainLoop?: boolean // Whether the statement should be in the main loop or outside
}

export interface ScriptStatement {
    id: string
    type: "function" | "control"
    function?: APIFunction
    parameters?: ScriptParameter[]
    controlType?: "if" | "while" | "for" | "end" | "function"
    condition?: string
    loopVariable?: string
    startValue?: string
    endValue?: string
    stepValue?: string
    functionName?: string
    functionParams?: string
    functionBody?: string
    inMainLoop?: boolean // Whether the statement should be in the main loop or outside
    enabled: boolean
    notes?: string // Allow users to add notes to statements
}

// Add template types for common script patterns
export interface ScriptTemplate {
    name: string
    description: string
    statements: Partial<ScriptStatement>[]
}

