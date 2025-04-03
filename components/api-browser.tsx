"use client"

import { useState } from "react"
import type { APICategory, APIFunction } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Sparkles, Code, FunctionSquare } from "lucide-react"
import { FunctionCard } from "./function-card"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface APIBrowserProps {
  categories: APICategory[]
  selectedCategory: string | null
  onSelectCategory: (category: string) => void
  onAddFunction: (func: APIFunction) => void
  onAddControlStatement: (type: "if" | "while" | "for" | "function") => void
}

export function APIBrowser({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddFunction,
  onAddControlStatement,
}: APIBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      functions: category.functions.filter(
        (func) =>
          func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          func.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.functions.length > 0)

  // Get category icons
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case "Player":
        return "/player-icon.svg"
      case "Inventory":
        return "/inventory-icon.svg"
      case "Actions":
        return "/actions-icon.svg"
      case "Bank":
        return "/bank-icon.svg"
      case "Utility":
        return "/utility-icon.svg"
      case "Combat":
        return "/combat-icon.svg"
      case "Advanced":
        return "/advanced-icon.svg"
      default:
        return "/default-icon.svg"
    }
  }

  return (
    <TooltipProvider>
      <Card className="h-full overflow-hidden border-2 border-amber-500/50 bg-game-card shadow-glow">
        <CardHeader className="bg-game-header border-b border-amber-500/30 pb-3">
          <CardTitle className="flex items-center text-amber-100 text-shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-amber-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            API Functions
            <Sparkles className="h-4 w-4 ml-2 text-amber-300" />
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-amber-500/70" />
            <Input
              placeholder="Search functions..."
              className="pl-8 bg-amber-900/30 border-amber-500/50 text-amber-100 placeholder:text-amber-500/70 focus:ring-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          {/* Control Statements Section */}
          <div className="p-3 border-b border-amber-500/30 bg-amber-900/20">
            <h3 className="font-medium text-sm text-amber-400 mb-2 flex items-center">
              <Code className="h-4 w-4 mr-2 text-amber-400" />
              Control Statements
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddControlStatement("if")}
                className="border-amber-500/50 bg-amber-900/30 text-amber-300 hover:bg-amber-800/50"
              >
                If Statement
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddControlStatement("while")}
                className="border-amber-500/50 bg-amber-900/30 text-amber-300 hover:bg-amber-800/50"
              >
                While Loop
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddControlStatement("for")}
                className="border-amber-500/50 bg-amber-900/30 text-amber-300 hover:bg-amber-800/50"
              >
                For Loop
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddControlStatement("function")}
                className="border-amber-500/50 bg-amber-900/30 text-amber-300 hover:bg-amber-800/50"
              >
                <FunctionSquare className="mr-1 h-3 w-3" />
                Function
              </Button>
            </div>
          </div>

          {searchTerm ? (
            <div className="p-4 space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-600 scrollbar-track-amber-900/30">
              {filteredCategories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <h3 className="font-medium text-sm text-amber-400 flex items-center">
                    <img
                      src={getCategoryIcon(category.name) || "/placeholder.svg"}
                      alt={category.name}
                      className="w-5 h-5 mr-2"
                    />
                    {category.name}
                    <Badge variant="outline" className="ml-2 text-xs border-amber-500/50 text-amber-300">
                      {category.functions.length}
                    </Badge>
                  </h3>
                  <div className="space-y-2">
                    {category.functions.map((func) => (
                      <DraggableFunctionCard
                        key={func.name}
                        func={func}
                        categoryName={category.name}
                        onAddFunction={onAddFunction}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <div className="text-center text-amber-500/70 py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-amber-500/50 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>No functions found</p>
                </div>
              )}
            </div>
          ) : (
            <Tabs
              value={selectedCategory || undefined}
              onValueChange={onSelectCategory}
              className="h-[calc(100vh-320px)] overflow-hidden flex flex-col"
            >
              <TabsList className="grid grid-cols-7 h-12 rounded-none bg-game-header border-b border-amber-500/30">
                {categories.slice(0, 7).map((category) => (
                  <TabsTrigger
                    key={category.name}
                    value={category.name}
                    className="data-[state=active]:bg-amber-900/50 data-[state=active]:text-amber-300 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center">
                          <img
                            src={getCategoryIcon(category.name) || "/placeholder.svg"}
                            alt={category.name}
                            className="w-5 h-5 mb-1"
                          />
                          <span className="text-xs">{category.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{category.name} Functions</p>
                      </TooltipContent>
                    </Tooltip>
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((category) => (
                <TabsContent
                  key={category.name}
                  value={category.name}
                  className="overflow-y-auto flex-1 data-[state=inactive]:hidden p-3 scrollbar-thin scrollbar-thumb-amber-600 scrollbar-track-amber-900/30"
                >
                  <div className="space-y-2">
                    {category.functions.map((func) => (
                      <DraggableFunctionCard
                        key={func.name}
                        func={func}
                        categoryName={category.name}
                        onAddFunction={onAddFunction}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

interface DraggableFunctionCardProps {
  func: APIFunction
  categoryName: string
  onAddFunction: (func: APIFunction) => void
}

function DraggableFunctionCard({ func, categoryName, onAddFunction }: DraggableFunctionCardProps) {
  const id = `function-${func.name}`
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: {
      categoryName,
      functionName: func.name,
      type: "function",
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-manipulation">
      <FunctionCard func={func} onAddFunction={onAddFunction} isDragging={isDragging} />
    </div>
  )
}

