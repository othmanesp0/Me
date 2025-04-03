"use client"

import type { APIFunction } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface FunctionCardProps {
  func: APIFunction
  onAddFunction: (func: APIFunction) => void
  isDragging?: boolean
}

export function FunctionCard({ func, onAddFunction, isDragging = false }: FunctionCardProps) {
  // Determine function color based on return type
  const getTypeColor = (type: string) => {
    if (type.includes("boolean")) return "bg-green-900/50 text-green-300 border-green-500/50"
    if (type.includes("number")) return "bg-blue-900/50 text-blue-300 border-blue-500/50"
    if (type.includes("string")) return "bg-purple-900/50 text-purple-300 border-purple-500/50"
    if (type.includes("table")) return "bg-yellow-900/50 text-yellow-300 border-yellow-500/50"
    if (type.includes("void")) return "bg-gray-900/50 text-gray-300 border-gray-500/50"
    return "bg-amber-900/50 text-amber-300 border-amber-500/50"
  }

  return (
    <TooltipProvider>
      <div
        className={`
          flex items-start p-3 rounded-lg cursor-grab active:cursor-grabbing
          ${
            isDragging
              ? "bg-amber-800/50 border-2 border-amber-400 shadow-glow transform rotate-1"
              : `bg-game-card border-2 border-amber-500/50 hover:shadow-glow-amber transition-all duration-200`
          }
        `}
      >
        <div className="mr-2 mt-1 text-amber-500/70">
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
            <div className="font-mono font-medium text-amber-300 truncate">{func.name}</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${getTypeColor(func.returnType)}`}>
                  {func.returnType}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Return type: {func.returnType}</p>
                <p className="text-xs text-gray-400">{func.returnDescription}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="text-xs text-amber-200/70 line-clamp-2">{func.description}</div>
          {func.parameters.length > 0 && (
            <div className="mt-1 text-xs text-amber-500/70 italic flex items-center">
              <span className="mr-1">•</span>
              {func.parameters.length} parameter{func.parameters.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onAddFunction(func)
              }}
              className="h-8 w-8 text-amber-400 hover:text-amber-300 border-amber-500/50 bg-amber-900/30 hover:bg-amber-800/50"
              title="Add to script"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to script</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

