"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download, FileCode, Play, Edit, Save } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"
import { highlightLuaCode } from "@/lib/syntax-highlighting"

interface ScriptPreviewProps {
  script: string
  onScriptChange?: (newScript: string) => void
}

export function ScriptPreview({ script, onScriptChange }: ScriptPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [highlightedScript, setHighlightedScript] = useState<string>(script)
  const [isEditing, setIsEditing] = useState(false)
  const [editableScript, setEditableScript] = useState(script)

  // Apply syntax highlighting when script changes
  useEffect(() => {
    // Use Prism.js to highlight the script
    const highlighted = highlightLuaCode(script);
    setHighlightedScript(highlighted);
  }, [script]);

  // Update editable script when script prop changes
  useEffect(() => {
    setEditableScript(script)
  }, [script])

  const copyToClipboard = () => {
    // Use the clean version of the script without color codes
    navigator.clipboard.writeText(isEditing ? editableScript : script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Script Copied",
      description: "The Lua script has been copied to clipboard",
      variant: "success",
    })
  }

  const downloadScript = () => {
    // Use the clean version of the script without color codes
    const blob = new Blob([isEditing ? editableScript : script], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "script.lua"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Script Downloaded",
      description: "The Lua script has been downloaded as script.lua",
      variant: "success",
    })
  }

  const executeScript = () => {
    setExecuting(true)

    // Simulate execution
    toast({
      title: "Executing Script",
      description: "The script is now running...",
      variant: "default",
    })

    setTimeout(() => {
      setExecuting(false)
      toast({
        title: "Script Executed",
        description: "The script has completed execution",
        variant: "success",
      })
    }, 2000)
  }

  const toggleEditMode = () => {
    if (isEditing) {
      // Save changes
      if (onScriptChange) {
        onScriptChange(editableScript)
      }
      setHighlightedScript(editableScript)

      toast({
        title: "Changes Saved",
        description: "Your script changes have been saved",
        variant: "success",
      })
    }

    setIsEditing(!isEditing)
  }

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableScript(e.target.value)
  }

  return (
    <TooltipProvider>
      <Card className="border-2 border-amber-500/50 bg-game-card shadow-glow">
        <CardHeader className="bg-game-header border-b border-amber-500/30 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center text-amber-100 text-shadow">
            <FileCode className="h-5 w-5 mr-2 text-amber-400" />
            Lua Script
          </CardTitle>
          <div className="flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleEditMode}
                  className="h-8 border-blue-500/50 bg-blue-900/30 text-blue-300 hover:bg-blue-800/50"
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isEditing ? "Save changes" : "Edit script"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={executeScript}
                  disabled={executing}
                  className="h-8 border-green-500/50 bg-green-900/30 text-green-300 hover:bg-green-800/50"
                >
                  {executing ? (
                    <div className="animate-spin h-4 w-4 border-2 border-green-300 rounded-full border-t-transparent mr-2" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  {executing ? "Running..." : "Execute"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Execute the script</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadScript}
                  className="h-8 border-amber-500/50 bg-amber-900/30 text-amber-300 hover:bg-amber-800/50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download as .lua file</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-8 border-amber-500/50 bg-amber-900/30 text-amber-300 hover:bg-amber-800/50"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isEditing ? (
            <textarea
              title="Lua script editor"
              placeholder="Edit your Lua script here"
              className="w-full h-full min-h-[300px] p-4 font-mono text-sm bg-black/80 text-white"
              value={editableScript}
              onChange={handleScriptChange}
            />
          ) : (
            <pre className="p-4 overflow-auto max-h-[500px] bg-black/80">
              <code
                className="font-mono text-sm language-lua"
                dangerouslySetInnerHTML={{ __html: highlightedScript }}
              />
            </pre>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

