"use client"

import { useState, useEffect } from "react"
import { APIBrowser } from "@/components/api-browser"
import { ScriptBuilder } from "@/components/script-builder"
import { ScriptPreview } from "@/components/script-preview"
import type { APICategory, APIFunction, ScriptStatement, ControlStatement } from "@/lib/types"
import { categorizeAPI } from "@/lib/api-utils"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, closestCenter } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers"
import { FunctionCard } from "@/components/function-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { HelpCircle, Sparkles } from "lucide-react"
import { TutorialOverlay } from "@/components/tutorial-overlay"
import { useMobile } from "@/hooks/use-mobile"
import { toast } from "@/hooks/use-toast"
import { ControlStatementDialog } from "@/components/control-statement-dialog"

export default function Home() {
  const [apiCategories, setApiCategories] = useState<APICategory[]>([])
  const [scriptStatements, setScriptStatements] = useState<ScriptStatement[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeDragData, setActiveDragData] = useState<{ type: "function" | "statement"; data: any } | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showControlDialog, setShowControlDialog] = useState(false)
  const [controlStatementType, setControlStatementType] = useState<"if" | "while" | "for" | "function" | null>(null)
  const isMobile = useMobile()

  useEffect(() => {
    // In a real app, this would fetch from an API or load from a file
    const categories = categorizeAPI()
    setApiCategories(categories)
    if (categories.length > 0) {
      setSelectedCategory(categories[0].name)
    }

    // Show welcome toast on first load
    toast({
      title: "Welcome to ME-Gui",
      description: "Drag functions to build your script. Click the ? for help.",
      variant: "default",
    })
  }, [])

  const addStatement = (func: APIFunction) => {
    const newStatement: ScriptStatement = {
      id: `statement-${Date.now()}`,
      type: "function",
      function: func,
      parameters: func.parameters.map((p) => ({
        name: p.name,
        value: p.defaultValue || "",
        type: p.type,
        description: p.description,
      })),
      enabled: true,
      inMainLoop: true, // By default, add functions to the main loop
    }

    setScriptStatements([...scriptStatements, newStatement])

    // Show success toast
    toast({
      title: "Function Added",
      description: `Added ${func.name} to your script`,
      variant: "success",
    })
  }

  const addControlStatement = (type: "if" | "while" | "for" | "function") => {
    setControlStatementType(type)
    setShowControlDialog(true)
  }

  const handleAddControlStatement = (controlStatement: ControlStatement) => {
    const newStatement: ScriptStatement = {
      id: `statement-${Date.now()}`,
      type: "control",
      controlType: controlStatement.type,
      condition: controlStatement.condition,
      loopVariable: controlStatement.loopVariable,
      startValue: controlStatement.startValue,
      endValue: controlStatement.endValue,
      stepValue: controlStatement.stepValue,
      functionName: controlStatement.functionName,
      functionParams: controlStatement.functionParams,
      functionBody: controlStatement.functionBody,
      inMainLoop: controlStatement.inMainLoop,
      enabled: true,
    }

    setScriptStatements([...scriptStatements, newStatement])

    // Show success toast
    toast({
      title: "Statement Added",
      description: `Added ${controlStatement.type} statement to your script`,
      variant: "success",
    })

    setShowControlDialog(false)
  }

  const updateStatement = (id: string, updatedStatement: Partial<ScriptStatement>) => {
    setScriptStatements(scriptStatements.map((stmt) => (stmt.id === id ? { ...stmt, ...updatedStatement } : stmt)))
  }

  const removeStatement = (id: string) => {
    const statement = scriptStatements.find((s) => s.id === id)
    setScriptStatements(scriptStatements.filter((stmt) => stmt.id !== id))

    if (statement) {
      toast({
        title: "Statement Removed",
        description:
          statement.type === "function"
            ? `Removed ${statement.function.name} from your script`
            : `Removed ${statement.controlType} statement from your script`,
        variant: "destructive",
      })
    }
  }

  // Sort statements based on different criteria
  const sortStatements = (location: "inside" | "outside" | "all", sortType: string) => {
    let newStatements = [...scriptStatements]

    // Filter statements based on location
    if (location === "inside") {
      const insideStatements = newStatements.filter((s) => s.inMainLoop !== false)
      const outsideStatements = newStatements.filter((s) => s.inMainLoop === false)

      // Sort inside statements
      const sortedInsideStatements = sortStatementsByType(insideStatements, sortType)

      // Combine sorted inside statements with unchanged outside statements
      newStatements = [...sortedInsideStatements, ...outsideStatements]
    } else if (location === "outside") {
      const insideStatements = newStatements.filter((s) => s.inMainLoop !== false)
      const outsideStatements = newStatements.filter((s) => s.inMainLoop === false)

      // Sort outside statements
      const sortedOutsideStatements = sortStatementsByType(outsideStatements, sortType)

      // Combine unchanged inside statements with sorted outside statements
      newStatements = [...insideStatements, ...sortedOutsideStatements]
    } else if (location === "all" && sortType === "clean") {
      // Remove all disabled statements
      newStatements = newStatements.filter((s) => s.enabled)

      toast({
        title: "Cleaned Script",
        description: "Removed all disabled statements from your script",
        variant: "success",
      })
    }

    setScriptStatements(newStatements)
  }

  // Helper function to sort statements by different criteria
  const sortStatementsByType = (statements: ScriptStatement[], sortType: string) => {
    let sortedStatements = [...statements]

    if (sortType === "alphabetical-asc") {
      sortedStatements.sort((a, b) => {
        const nameA = a.type === "function" ? a.function.name : a.controlType || ""
        const nameB = b.type === "function" ? b.function.name : b.controlType || ""
        return nameA.localeCompare(nameB)
      })

      toast({
        title: "Sorted Statements",
        description: "Sorted statements alphabetically (A-Z)",
        variant: "success",
      })
    } else if (sortType === "alphabetical-desc") {
      sortedStatements.sort((a, b) => {
        const nameA = a.type === "function" ? a.function.name : a.controlType || ""
        const nameB = b.type === "function" ? b.function.name : b.controlType || ""
        return nameB.localeCompare(nameA)
      })

      toast({
        title: "Sorted Statements",
        description: "Sorted statements alphabetically (Z-A)",
        variant: "success",
      })
    } else if (sortType === "by-category") {
      // Group functions by their category
      const categorizedStatements: Record<string, ScriptStatement[]> = {}
      const controlStatements: ScriptStatement[] = []

      // Separate control statements and function statements
      statements.forEach((stmt) => {
        if (stmt.type === "control") {
          controlStatements.push(stmt)
        } else if (stmt.type === "function" && stmt.function.category) {
          const category = stmt.function.category
          if (!categorizedStatements[category]) {
            categorizedStatements[category] = []
          }
          categorizedStatements[category].push(stmt)
        } else if (stmt.type === "function") {
          // If no category, use the function name's first letter
          const firstLetter = stmt.function.name.charAt(0).toUpperCase()
          if (!categorizedStatements[firstLetter]) {
            categorizedStatements[firstLetter] = []
          }
          categorizedStatements[firstLetter].push(stmt)
        }
      })

      // Flatten the categorized statements
      sortedStatements = Object.values(categorizedStatements).flat().concat(controlStatements)

      toast({
        title: "Sorted Statements",
        description: "Sorted statements by category",
        variant: "success",
      })
    }

    return sortedStatements
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)

    // Check if it's a function being dragged from the browser
    if (typeof active.id === "string" && active.id.startsWith("function-")) {
      const categoryName = active.data.current?.categoryName
      const functionName = active.data.current?.functionName

      if (categoryName && functionName) {
        const category = apiCategories.find((c) => c.name === categoryName)
        const func = category?.functions.find((f) => f.name === functionName)

        if (func) {
          setActiveDragData({
            type: "function",
            data: func,
          })
        }
      }
    } else if (typeof active.id === "string" && active.id.startsWith("statement-")) {
      const statement = scriptStatements.find((s) => s.id === active.id)
      if (statement) {
        setActiveDragData({
          type: "statement",
          data: statement,
        })
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      // If dragging from function browser to script builder
      if (
        typeof active.id === "string" &&
        active.id.startsWith("function-") &&
        typeof over.id === "string" &&
        over.id.startsWith("statement-")
      ) {
        // Function was dragged over a statement - we'll add it after that statement
        const categoryName = active.data.current?.categoryName
        const functionName = active.data.current?.functionName

        if (categoryName && functionName) {
          const category = apiCategories.find((c) => c.name === categoryName)
          const func = category?.functions.find((f) => f.name === functionName)

          if (func) {
            const overIndex = scriptStatements.findIndex((s) => s.id === over.id)
            const newStatement: ScriptStatement = {
              id: `statement-${Date.now()}`,
              type: "function",
              function: func,
              parameters: func.parameters.map((p) => ({
                name: p.name,
                value: p.defaultValue || "",
                type: p.type,
                description: p.description,
              })),
              enabled: true,
              inMainLoop: true, // Default to inside main loop
            }

            const newStatements = [...scriptStatements]
            newStatements.splice(overIndex + 1, 0, newStatement)
            setScriptStatements(newStatements)

            // Show success toast
            toast({
              title: "Function Added",
              description: `Added ${func.name} to your script`,
              variant: "success",
            })
          }
        }
      }
      // If dragging from function browser to empty script builder
      else if (
        typeof active.id === "string" &&
        active.id.startsWith("function-") &&
        over.id === "script-builder-drop-area"
      ) {
        const categoryName = active.data.current?.categoryName
        const functionName = active.data.current?.functionName

        if (categoryName && functionName) {
          const category = apiCategories.find((c) => c.name === categoryName)
          const func = category?.functions.find((f) => f.name === functionName)

          if (func) {
            addStatement(func)
          }
        }
      }
      // If reordering statements within the script builder
      else if (
        typeof active.id === "string" &&
        active.id.startsWith("statement-") &&
        typeof over.id === "string" &&
        over.id.startsWith("statement-")
      ) {
        setScriptStatements((items) => {
          const oldIndex = items.findIndex((i) => i.id === active.id)
          const newIndex = items.findIndex((i) => i.id === over.id)

          return arrayMove(items, oldIndex, newIndex)
        })

        // Show reorder toast
        toast({
          title: "Reordered Statements",
          description: "Script statements have been reordered",
          variant: "default",
        })
      }
    }

    setActiveId(null)
    setActiveDragData(null)
  }

  // Generate the script based on the statements
  const generateScript = () => {
    let script = '-- Generated Lua Script\n-- Created with ME-Gui\n\nlocal API = require("api")\n\n'

    // Add variable declarations section
    script += "-- Variable declarations\n"
    script += "local CurrentTick = API.Get_tick()\n"
    script += "local OBJECTS_table = API.ReadAllObjectsArray({-1},{-1},{})\n\n"

    // Add function declarations (outside main loop)
    const functionDeclarations = scriptStatements.filter(
      (stmt) => stmt.enabled && stmt.type === "control" && stmt.controlType === "function",
    )

    if (functionDeclarations.length > 0) {
      script += "-- Function declarations\n"
      functionDeclarations.forEach((func) => {
        script += `function ${func.functionName}(${func.functionParams || ""})\n`
        script += func.functionBody ? `${func.functionBody}\n` : "  return true\n"
        script += "end\n\n"
      })
    }

    // Add other statements that should be outside the main loop
    const outsideLoopStatements = scriptStatements.filter(
      (stmt) =>
        stmt.enabled && stmt.inMainLoop === false && !(stmt.type === "control" && stmt.controlType === "function"),
    )

    if (outsideLoopStatements.length > 0) {
      script += "-- Code outside main loop\n"

      // Process statements with proper indentation
      let indentLevel = 0

      outsideLoopStatements.forEach((stmt, index) => {
        const indent = "  ".repeat(indentLevel)

        if (stmt.type === "function") {
          const paramValues = stmt.parameters
            .map((p) => {
              // Handle different parameter types
              if (p.type.includes("string") || (typeof p.value === "string" && !p.value.match(/^-?\d+(\.\d+)?$/))) {
                return `"${p.value}"`
              }
              if (p.type.includes("boolean")) {
                return p.value.toLowerCase() === "true" ? "true" : "false"
              }
              if (p.type.includes("table") && p.value.trim() === "") {
                return "{}"
              }
              return p.value || "nil"
            })
            .join(", ")

          script += `${indent}API.${stmt.function.name}(${paramValues})\n`
        } else if (stmt.type === "control") {
          // Handle control statements
          if (stmt.controlType === "if") {
            script += `${indent}if ${stmt.condition} then\n`
            indentLevel++
          } else if (stmt.controlType === "while") {
            script += `${indent}while ${stmt.condition} do\n`
            indentLevel++
          } else if (stmt.controlType === "for") {
            script += `${indent}for ${stmt.loopVariable} = ${stmt.startValue}, ${stmt.endValue}${stmt.stepValue !== "1" ? ", " + stmt.stepValue : ""} do\n`
            indentLevel++
          } else if (stmt.controlType === "end") {
            indentLevel = Math.max(0, indentLevel - 1)
            script += `${indent}end\n`
          }
        }

        // Add a blank line after control statements for readability
        if (stmt.type === "control" && index < outsideLoopStatements.length - 1) {
          script += "\n"
        }
      })

      script += "\n"
    }

    // Add the main loop
    script += "-- Main execution loop\n"
    script += "while(API.Read_LoopyLoop())\ndo\n"

    // Add each enabled statement with proper indentation
    const insideLoopStatements = scriptStatements.filter((stmt) => stmt.enabled && stmt.inMainLoop !== false)

    if (insideLoopStatements.length === 0) {
      script += '  -- No statements added yet\n  print("Add functions to build your script!")\n'
    } else {
      // Add update section
      script += "  -- Update game state\n"
      script += "  CurrentTick = API.Get_tick()\n"
      script += "  API.DoRandomEvents()\n"
      script += "  OBJECTS_table = API.ReadAllObjectsArray({-1},{-1},{})\n\n"

      // Process statements with proper indentation
      let indentLevel = 1 // Start with one level inside the main loop

      insideLoopStatements.forEach((stmt, index) => {
        const indent = "  ".repeat(indentLevel)

        if (stmt.type === "function") {
          const paramValues = stmt.parameters
            .map((p) => {
              // Handle different parameter types
              if (p.type.includes("string") || (typeof p.value === "string" && !p.value.match(/^-?\d+(\.\d+)?$/))) {
                return `"${p.value}"`
              }
              if (p.type.includes("boolean")) {
                return p.value.toLowerCase() === "true" ? "true" : "false"
              }
              if (p.type.includes("table") && p.value.trim() === "") {
                return "{}"
              }
              return p.value || "nil"
            })
            .join(", ")

          script += `${indent}API.${stmt.function.name}(${paramValues})\n`
        } else if (stmt.type === "control") {
          // Handle control statements
          if (stmt.controlType === "if") {
            script += `${indent}if ${stmt.condition} then\n`
            indentLevel++
          } else if (stmt.controlType === "while") {
            script += `${indent}while ${stmt.condition} do\n`
            indentLevel++
          } else if (stmt.controlType === "for") {
            script += `${indent}for ${stmt.loopVariable} = ${stmt.startValue}, ${stmt.endValue}${stmt.stepValue !== "1" ? ", " + stmt.stepValue : ""} do\n`
            indentLevel++
          } else if (stmt.controlType === "end") {
            indentLevel = Math.max(1, indentLevel - 1) // Ensure we don't go below the main loop indent
            script += `${indent}end\n`
          }
        }

        // Add a blank line after control statements for readability
        if (stmt.type === "control" && index < insideLoopStatements.length - 1) {
          script += "\n"
        }
      })
    }

    // Close the main loop
    script += "end\n"

    return script
  }

  return (
    <TooltipProvider>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <div className="min-h-screen bg-game-pattern text-white">
          <header className="bg-game-header border-b-2 border-amber-500/50 shadow-lg">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mr-3 border-2 border-amber-300 shadow-glow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-amber-100 text-shadow">ME-Gui</h1>
                <div className="ml-3 animate-pulse">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowTutorial(true)}
                      className="border-amber-500/50 bg-amber-900/30 hover:bg-amber-800/50 text-amber-300"
                    >
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Show Tutorial</p>
                  </TooltipContent>
                </Tooltip>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <APIBrowser
                  categories={apiCategories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onAddFunction={addStatement}
                  onAddControlStatement={addControlStatement}
                />
              </div>

              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-6">
                  <ScriptBuilder
                    statements={scriptStatements}
                    onUpdateStatement={updateStatement}
                    onRemoveStatement={removeStatement}
                    onSortStatements={sortStatements}
                  />

                  <ScriptPreview script={generateScript()} />
                </div>
              </div>
            </div>
          </main>

          <DragOverlay>
            {activeId && activeDragData && (
              <div className="opacity-80 transform scale-105 rotate-1">
                {activeDragData.type === "function" && (
                  <FunctionCard func={activeDragData.data} onAddFunction={() => {}} isDragging={true} />
                )}
                {activeDragData.type === "statement" && (
                  <div className="bg-game-card p-3 rounded-lg border-2 border-amber-500/50 shadow-glow w-full max-w-md">
                    <div className="font-mono text-sm text-amber-100">
                      {activeDragData.data.type === "function"
                        ? `${activeDragData.data.function.name}(${activeDragData.data.parameters.map((p: any) => p.value || "nil").join(", ")})`
                        : `${activeDragData.data.controlType} statement`}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DragOverlay>

          {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}
          {showControlDialog && (
            <ControlStatementDialog
              type={controlStatementType || "if"}
              onClose={() => setShowControlDialog(false)}
              onAdd={handleAddControlStatement}
            />
          )}
        </div>
      </DndContext>
    </TooltipProvider>
  )
}

