"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { ControlStatement } from "@/lib/types"

interface ControlStatementDialogProps {
  type: "if" | "while" | "for" | "function"
  onClose: () => void
  onAdd: (statement: ControlStatement) => void
}

export function ControlStatementDialog({ type, onClose, onAdd }: ControlStatementDialogProps) {
  const [condition, setCondition] = useState("")
  const [loopVariable, setLoopVariable] = useState("i")
  const [startValue, setStartValue] = useState("1")
  const [endValue, setEndValue] = useState("10")
  const [stepValue, setStepValue] = useState("1")
  const [functionName, setFunctionName] = useState("myFunction")
  const [functionParams, setFunctionParams] = useState("param1, param2")
  const [functionBody, setFunctionBody] = useState("  -- Function body\n  return true")
  const [inMainLoop, setInMainLoop] = useState(true)
  const [statementType, setStatementType] = useState<"if" | "while" | "for" | "end" | "function">(type)

  const handleSubmit = () => {
    if (statementType === "end") {
      onAdd({
        type: "end",
        inMainLoop,
      })
    } else if (statementType === "if" || statementType === "while") {
      if (!condition) return
      onAdd({
        type: statementType,
        condition,
        inMainLoop,
      })
    } else if (statementType === "for") {
      if (!loopVariable || !startValue || !endValue) return
      onAdd({
        type: "for",
        loopVariable,
        startValue,
        endValue,
        stepValue: stepValue || "1",
        inMainLoop,
      })
    } else if (statementType === "function") {
      if (!functionName) return
      onAdd({
        type: "function",
        functionName,
        functionParams,
        functionBody,
        inMainLoop: false, // Functions are always outside the main loop
      })
    }
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-game-card border-2 border-amber-500/50 text-amber-100 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-amber-100">Add Control Statement</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="statement-type">Statement Type</Label>
            <Select value={statementType} onValueChange={(value) => setStatementType(value as any)}>
              <SelectTrigger id="statement-type" className="bg-amber-900/30 border-amber-500/50 text-amber-100">
                <SelectValue placeholder="Select statement type" />
              </SelectTrigger>
              <SelectContent className="bg-game-card border-amber-500/50">
                <SelectItem value="if">If Statement</SelectItem>
                <SelectItem value="while">While Loop</SelectItem>
                <SelectItem value="for">For Loop</SelectItem>
                <SelectItem value="function">Function Declaration</SelectItem>
                <SelectItem value="end">End Statement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {statementType !== "function" && statementType !== "end" && (
            <div className="flex items-center space-x-2">
              <Switch
                id="in-main-loop"
                checked={inMainLoop}
                onCheckedChange={setInMainLoop}
                className="data-[state=checked]:bg-amber-600"
              />
              <Label htmlFor="in-main-loop">Place inside main loop</Label>
              <div className="text-xs text-amber-500/70 ml-2">
                {inMainLoop
                  ? "This statement will be placed inside the main loop"
                  : "This statement will be placed outside the main loop"}
              </div>
            </div>
          )}

          {(statementType === "if" || statementType === "while") && (
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder={statementType === "if" ? "e.g., x > 10" : "e.g., i < 10"}
                className="bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70"
              />
              <p className="text-xs text-amber-500/70">
                {statementType === "if"
                  ? "The condition to check in the if statement"
                  : "The condition to check in each iteration of the while loop"}
              </p>
            </div>
          )}

          {statementType === "for" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="loop-variable">Loop Variable</Label>
                <Input
                  id="loop-variable"
                  value={loopVariable}
                  onChange={(e) => setLoopVariable(e.target.value)}
                  placeholder="e.g., i"
                  className="bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-value">Start Value</Label>
                <Input
                  id="start-value"
                  value={startValue}
                  onChange={(e) => setStartValue(e.target.value)}
                  placeholder="e.g., 1"
                  className="bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-value">End Value</Label>
                <Input
                  id="end-value"
                  value={endValue}
                  onChange={(e) => setEndValue(e.target.value)}
                  placeholder="e.g., 10"
                  className="bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="step-value">Step Value</Label>
                <Input
                  id="step-value"
                  value={stepValue}
                  onChange={(e) => setStepValue(e.target.value)}
                  placeholder="e.g., 1"
                  className="bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70"
                />
                <p className="text-xs text-amber-500/70">
                  The increment value for each iteration (optional, defaults to 1)
                </p>
              </div>
            </>
          )}

          {statementType === "function" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="function-name">Function Name</Label>
                <Input
                  id="function-name"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  placeholder="e.g., myFunction"
                  className="bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="function-params">Parameters (comma separated)</Label>
                <Input
                  id="function-params"
                  value={functionParams}
                  onChange={(e) => setFunctionParams(e.target.value)}
                  placeholder="e.g., param1, param2"
                  className="bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="function-body">Function Body</Label>
                <Textarea
                  id="function-body"
                  value={functionBody}
                  onChange={(e) => setFunctionBody(e.target.value)}
                  placeholder="Function body code"
                  className="bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70 font-mono min-h-[100px]"
                />
                <p className="text-xs text-amber-500/70">
                  Write the function body code. Include the return statement if needed.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-red-500/50 bg-red-900/30 text-red-300 hover:bg-red-800/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="border-green-500/50 bg-green-900/30 text-green-300 hover:bg-green-800/50"
          >
            Add Statement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

