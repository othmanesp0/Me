"use client"
import type { ScriptStatement } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Trash2,
  GripVertical,
  Info,
  Code,
  FunctionSquare,
  ArrowUpDown,
  ArrowDownAZ,
  ArrowDownZA,
  Filter,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useDroppable } from "@dnd-kit/core"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface ScriptBuilderProps {
  statements: ScriptStatement[]
  onUpdateStatement: (id: string, statement: Partial<ScriptStatement>) => void
  onRemoveStatement: (id: string) => void
  onSortStatements: (location: "inside" | "outside" | "all", sortType: string) => void
}

export function ScriptBuilder({
  statements,
  onUpdateStatement,
  onRemoveStatement,
  onSortStatements,
}: ScriptBuilderProps) {
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: "script-builder-drop-area",
  })

  // Separate statements into those inside and outside the main loop
  const outsideLoopStatements = statements.filter((s) => s.inMainLoop === false)
  const insideLoopStatements = statements.filter((s) => s.inMainLoop !== false)

  return (
    <TooltipProvider>
      <Card className="border-2 border-amber-500/50 bg-game-card shadow-glow">
        <CardHeader className="bg-game-header border-b border-amber-500/30 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-amber-100 text-shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              Function Sequence
            </CardTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-500/50 bg-amber-900/30 text-amber-300 hover:bg-amber-800/50"
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-game-card border-amber-500/50">
                <DropdownMenuLabel className="text-amber-300">Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-amber-500/30" />

                <DropdownMenuLabel className="text-xs text-amber-500/70 pt-2">Inside Main Loop</DropdownMenuLabel>
                <DropdownMenuItem
                  className="text-amber-200 focus:text-amber-100 focus:bg-amber-800/50"
                  onClick={() => onSortStatements("inside", "alphabetical-asc")}
                >
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  Alphabetical (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-amber-200 focus:text-amber-100 focus:bg-amber-800/50"
                  onClick={() => onSortStatements("inside", "alphabetical-desc")}
                >
                  <ArrowDownZA className="mr-2 h-4 w-4" />
                  Alphabetical (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-amber-200 focus:text-amber-100 focus:bg-amber-800/50"
                  onClick={() => onSortStatements("inside", "by-category")}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  By Category
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-amber-500/30" />

                <DropdownMenuLabel className="text-xs text-amber-500/70 pt-2">Outside Main Loop</DropdownMenuLabel>
                <DropdownMenuItem
                  className="text-amber-200 focus:text-amber-100 focus:bg-amber-800/50"
                  onClick={() => onSortStatements("outside", "alphabetical-asc")}
                >
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  Alphabetical (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-amber-200 focus:text-amber-100 focus:bg-amber-800/50"
                  onClick={() => onSortStatements("outside", "alphabetical-desc")}
                >
                  <ArrowDownZA className="mr-2 h-4 w-4" />
                  Alphabetical (Z-A)
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-amber-500/30" />

                <DropdownMenuItem
                  className="text-amber-200 focus:text-amber-100 focus:bg-amber-800/50"
                  onClick={() => onSortStatements("all", "clean")}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Clean Disabled Statements
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-4" ref={setDroppableRef}>
          {statements.length === 0 ? (
            <div className="text-center py-12 px-6 border-2 border-dashed border-amber-500/30 rounded-lg bg-amber-900/20 animate-pulse-slow">
              <img src="/drag-here.svg" alt="Drag functions here" className="h-16 w-16 mx-auto mb-4" />
              <p className="text-amber-300 font-medium mb-2">Drag functions here</p>
              <p className="text-amber-500/70 text-sm">Drag API functions to build your sequence</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Outside loop statements section */}
              {outsideLoopStatements.length > 0 && (
                <div>
                  <h3 className="text-amber-300 font-medium mb-3 flex items-center">
                    <FunctionSquare className="mr-2 h-4 w-4 text-amber-400" />
                    Outside Main Loop
                  </h3>
                  <Accordion type="multiple" className="space-y-3">
                    {outsideLoopStatements.map((statement) => (
                      <SortableStatement
                        key={statement.id}
                        statement={statement}
                        onUpdateStatement={onUpdateStatement}
                        onRemoveStatement={onRemoveStatement}
                      />
                    ))}
                  </Accordion>
                </div>
              )}

              {/* Inside loop statements section */}
              <div>
                <h3 className="text-amber-300 font-medium mb-3 flex items-center">
                  <Code className="mr-2 h-4 w-4 text-amber-400" />
                  Inside Main Loop
                </h3>
                <Accordion type="multiple" className="space-y-3">
                  {insideLoopStatements.map((statement) => (
                    <SortableStatement
                      key={statement.id}
                      statement={statement}
                      onUpdateStatement={onUpdateStatement}
                      onRemoveStatement={onRemoveStatement}
                    />
                  ))}
                </Accordion>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

interface SortableStatementProps {
  statement: ScriptStatement
  onUpdateStatement: (id: string, statement: Partial<ScriptStatement>) => void
  onRemoveStatement: (id: string) => void
}

function SortableStatement({ statement, onUpdateStatement, onRemoveStatement }: SortableStatementProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: statement.id,
    data: {
      type: "statement",
      statement,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  // Get parameter type badge color
  const getParamTypeColor = (type: string) => {
    if (type.includes("boolean")) return "bg-green-900/50 text-green-300 border-green-500/50"
    if (type.includes("number")) return "bg-blue-900/50 text-blue-300 border-blue-500/50"
    if (type.includes("string")) return "bg-purple-900/50 text-purple-300 border-purple-500/50"
    if (type.includes("table")) return "bg-yellow-900/50 text-yellow-300 border-yellow-500/50"
    return "bg-amber-900/50 text-amber-300 border-amber-500/50"
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        ${isDragging ? "z-50" : "z-10"}
        ${statement.enabled ? "" : "opacity-60"}
      `}
    >
      <AccordionItem
        value={statement.id}
        className={`
          border-2 rounded-lg overflow-hidden
          ${isDragging ? "shadow-glow bg-amber-800/50 border-amber-400 rotate-1" : "shadow-md bg-game-card border-amber-500/50 hover:shadow-glow-amber transition-all duration-200"}
        `}
      >
        <div className="flex items-center p-3">
          <div
            className="mr-2 cursor-move text-amber-500/70 hover:text-amber-400 touch-manipulation"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <Switch
            checked={statement.enabled}
            onCheckedChange={(checked) => onUpdateStatement(statement.id, { enabled: checked })}
            className="mr-3 data-[state=checked]:bg-amber-600"
          />
          <AccordionTrigger className="flex-1 hover:no-underline py-0 [&[data-state=open]>svg]:rotate-180">
            {statement.type === "function" ? (
              <span className="font-mono text-sm text-amber-300">
                {statement.function.name}({statement.parameters.map((p) => p.value || "nil").join(", ")})
              </span>
            ) : (
              <span className="font-mono text-sm flex items-center text-amber-300">
                {statement.controlType === "if" && (
                  <>
                    <Code className="h-4 w-4 mr-2" />
                    if {statement.condition} then
                  </>
                )}
                {statement.controlType === "while" && (
                  <>
                    <Code className="h-4 w-4 mr-2" />
                    while {statement.condition} do
                  </>
                )}
                {statement.controlType === "for" && (
                  <>
                    <Code className="h-4 w-4 mr-2" />
                    for {statement.loopVariable} = {statement.startValue}, {statement.endValue}
                    {statement.stepValue !== "1" ? ", " + statement.stepValue : ""} do
                  </>
                )}
                {statement.controlType === "function" && (
                  <>
                    <FunctionSquare className="h-4 w-4 mr-2" />
                    function {statement.functionName}({statement.functionParams})
                  </>
                )}
                {statement.controlType === "end" && (
                  <>
                    <Code className="h-4 w-4 mr-2" />
                    end
                  </>
                )}
              </span>
            )}
          </AccordionTrigger>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveStatement(statement.id)
                }}
                className="h-8 w-8 text-red-400 hover:text-red-300 border-red-500/50 bg-red-900/30 hover:bg-red-800/50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove from sequence</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <AccordionContent className="px-4 pb-3 pt-1 border-t border-amber-500/30 bg-amber-950/50">
          <div className="space-y-3">
            {statement.type === "function" ? (
              <>
                <div className="text-xs text-amber-300/80">{statement.function.description}</div>
                {statement.parameters.map((param, paramIndex) => (
                  <div key={param.name} className="grid grid-cols-3 gap-2 items-center">
                    <div className="flex items-center">
                      <Label htmlFor={`${statement.id}-${param.name}`} className="text-sm text-amber-200">
                        {param.name}:
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 ml-1 text-amber-500/70" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{param.description}</p>
                          <Badge variant="outline" className={`mt-1 ${getParamTypeColor(param.type)}`}>
                            {param.type}
                          </Badge>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {param.type.includes("boolean") ? (
                      <Select
                        value={param.value || "false"}
                        onValueChange={(value) => {
                          const newParams = [...statement.parameters]
                          newParams[paramIndex] = {
                            ...param,
                            value: value,
                          }
                          onUpdateStatement(statement.id, { parameters: newParams })
                        }}
                      >
                        <SelectTrigger className="col-span-2 h-8 bg-amber-900/30 border-amber-500/50 text-amber-100">
                          <SelectValue placeholder="Select value" />
                        </SelectTrigger>
                        <SelectContent className="bg-game-card border-amber-500/50">
                          <SelectItem value="true" className="text-green-300">
                            true
                          </SelectItem>
                          <SelectItem value="false" className="text-red-300">
                            false
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={`${statement.id}-${param.name}`}
                        value={param.value}
                        onChange={(e) => {
                          const newParams = [...statement.parameters]
                          newParams[paramIndex] = {
                            ...param,
                            value: e.target.value,
                          }
                          onUpdateStatement(statement.id, { parameters: newParams })
                        }}
                        className="col-span-2 h-8 bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70 focus:ring-amber-500"
                        placeholder={param.type}
                      />
                    )}
                  </div>
                ))}

                {/* Toggle for inside/outside main loop */}
                <div className="flex items-center space-x-2 mt-4 pt-2 border-t border-amber-500/20">
                  <Switch
                    id={`${statement.id}-in-main-loop`}
                    checked={statement.inMainLoop !== false}
                    onCheckedChange={(checked) => onUpdateStatement(statement.id, { inMainLoop: checked })}
                    className="data-[state=checked]:bg-amber-600"
                  />
                  <Label htmlFor={`${statement.id}-in-main-loop`} className="text-sm text-amber-200">
                    Place inside main loop
                  </Label>
                </div>
              </>
            ) : (
              <>
                {statement.controlType === "if" && (
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label htmlFor={`${statement.id}-condition`} className="text-sm text-amber-200">
                      Condition:
                    </Label>
                    <Input
                      id={`${statement.id}-condition`}
                      value={statement.condition || ""}
                      onChange={(e) => onUpdateStatement(statement.id, { condition: e.target.value })}
                      className="col-span-2 h-8 bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70 focus:ring-amber-500"
                      placeholder="e.g., x > 10"
                    />
                  </div>
                )}
                {statement.controlType === "while" && (
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label htmlFor={`${statement.id}-condition`} className="text-sm text-amber-200">
                      Condition:
                    </Label>
                    <Input
                      id={`${statement.id}-condition`}
                      value={statement.condition || ""}
                      onChange={(e) => onUpdateStatement(statement.id, { condition: e.target.value })}
                      className="col-span-2 h-8 bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70 focus:ring-amber-500"
                      placeholder="e.g., i < 10"
                    />
                  </div>
                )}
                {statement.controlType === "for" && (
                  <>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label htmlFor={`${statement.id}-variable`} className="text-sm text-amber-200">
                        Variable:
                      </Label>
                      <Input
                        id={`${statement.id}-variable`}
                        value={statement.loopVariable || ""}
                        onChange={(e) => onUpdateStatement(statement.id, { loopVariable: e.target.value })}
                        className="col-span-2 h-8 bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70 focus:ring-amber-500"
                        placeholder="e.g., i"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label htmlFor={`${statement.id}-start`} className="text-sm text-amber-200">
                        Start Value:
                      </Label>
                      <Input
                        id={`${statement.id}-start`}
                        value={statement.startValue || ""}
                        onChange={(e) => onUpdateStatement(statement.id, { startValue: e.target.value })}
                        className="col-span-2 h-8 bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70 focus:ring-amber-500"
                        placeholder="e.g., 1"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label htmlFor={`${statement.id}-end`} className="text-sm text-amber-200">
                        End Value:
                      </Label>
                      <Input
                        id={`${statement.id}-end`}
                        value={statement.endValue || ""}
                        onChange={(e) => onUpdateStatement(statement.id, { endValue: e.target.value })}
                        className="col-span-2 h-8 bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70 focus:ring-amber-500"
                        placeholder="e.g., 10"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label htmlFor={`${statement.id}-step`} className="text-sm text-amber-200">
                        Step Value:
                      </Label>
                      <Input
                        id={`${statement.id}-step`}
                        value={statement.stepValue || "1"}
                        onChange={(e) => onUpdateStatement(statement.id, { stepValue: e.target.value })}
                        className="col-span-2 h-8 bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70 focus:ring-amber-500"
                        placeholder="e.g., 1"
                      />
                    </div>
                  </>
                )}
                {statement.controlType === "function" && (
                  <>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label htmlFor={`${statement.id}-function-name`} className="text-sm text-amber-200">
                        Function Name:
                      </Label>
                      <Input
                        id={`${statement.id}-function-name`}
                        value={statement.functionName || ""}
                        onChange={(e) => onUpdateStatement(statement.id, { functionName: e.target.value })}
                        className="col-span-2 h-8 bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70 focus:ring-amber-500"
                        placeholder="e.g., myFunction"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label htmlFor={`${statement.id}-function-params`} className="text-sm text-amber-200">
                        Parameters:
                      </Label>
                      <Input
                        id={`${statement.id}-function-params`}
                        value={statement.functionParams || ""}
                        onChange={(e) => onUpdateStatement(statement.id, { functionParams: e.target.value })}
                        className="col-span-2 h-8 bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70 focus:ring-amber-500"
                        placeholder="e.g., param1, param2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${statement.id}-function-body`} className="text-sm text-amber-200">
                        Function Body:
                      </Label>
                      <Textarea
                        id={`${statement.id}-function-body`}
                        value={statement.functionBody || ""}
                        onChange={(e) => onUpdateStatement(statement.id, { functionBody: e.target.value })}
                        className="w-full bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70 focus:ring-amber-500 font-mono min-h-[100px]"
                        placeholder="-- Function body code"
                      />
                    </div>
                  </>
                )}

                {/* Toggle for inside/outside main loop (except for function declarations) */}
                {statement.controlType !== "function" && (
                  <div className="flex items-center space-x-2 mt-4 pt-2 border-t border-amber-500/20">
                    <Switch
                      id={`${statement.id}-in-main-loop`}
                      checked={statement.inMainLoop !== false}
                      onCheckedChange={(checked) => onUpdateStatement(statement.id, { inMainLoop: checked })}
                      className="data-[state=checked]:bg-amber-600"
                    />
                    <Label htmlFor={`${statement.id}-in-main-loop`} className="text-sm text-amber-200">
                      Place inside main loop
                    </Label>
                  </div>
                )}
              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  )
}

