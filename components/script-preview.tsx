"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download, FileCode, Play } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"
import { highlightLuaCode } from "@/lib/syntax-highlighting"

interface ScriptPreviewProps {
  script: string
}

export function ScriptPreview({ script }: ScriptPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [highlightedScript, setHighlightedScript] = useState<string>(script)

  // Apply syntax highlighting when script changes
  useEffect(() => {
    setHighlightedScript(highlightLuaCode(script))
  }, [script])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Script Copied",
      description: "The Lua script has been copied to clipboard",
      variant: "success",
    })
  }

  const downloadScript = () => {
    const blob = new Blob([script], { type: "text/plain" })
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
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-8 bg-amber-950/70 border-b border-amber-500/30 flex items-center px-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="mx-auto text-xs text-amber-500/70">script.lua</div>
            </div>
            <div className="mt-8 bg-amber-950/50 p-4 rounded-b-md overflow-x-auto font-mono text-sm whitespace-pre-wrap text-amber-200 border-t border-amber-500/30 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-600 scrollbar-track-amber-900/30">
              <div dangerouslySetInnerHTML={{ __html: highlightedScript }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

