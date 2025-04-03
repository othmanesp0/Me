"use client"

import type React from "react"
import {useEffect, useRef, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {AlertCircle, AlertTriangle, Check, Copy, Download, Edit, FileCode, History, Play, Save} from "lucide-react"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {toast} from "@/hooks/use-toast"
import {
    highlightLuaCode,
    highlightLuaCodeWithLineNumbers,
    type LuaValidationResult,
    validateLuaCode
} from "@/lib/syntax-highlighting"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Badge} from "@/components/ui/badge"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"

// Interface for script version history
interface ScriptVersion {
    id: string;
    timestamp: Date;
    content: string;
    description: string;
}

interface ScriptPreviewProps {
    script: string
    onScriptChange?: (newScript: string) => void
}

export function ScriptPreview({script, onScriptChange}: ScriptPreviewProps) {
    const [copied, setCopied] = useState(false)
    const [executing, setExecuting] = useState(false)
    const [highlightedScript, setHighlightedScript] = useState<string>("")
    const [isEditing, setIsEditing] = useState(false)
    const [editableScript, setEditableScript] = useState(script)
    const [validation, setValidation] = useState<LuaValidationResult>({isValid: true, errors: []})
    const [showLineNumbers, setShowLineNumbers] = useState(true)
    const [scriptVersions, setScriptVersions] = useState<ScriptVersion[]>([])
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null)
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
    const [editingTimeout, setEditingTimeout] = useState<NodeJS.Timeout | null>(null)
    const [isMounted, setIsMounted] = useState(false)
    const editorRef = useRef<HTMLTextAreaElement>(null)

    // Track client-side mounting
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Apply syntax highlighting when script changes after mounting
    useEffect(() => {
        if (isMounted) {
            updateHighlightedScript(script);
            validateScript(script);

            // Add initial version to history if none exists
            if (scriptVersions.length === 0) {
                addVersionToHistory(script, "Initial script");
            }
        }
    }, [script, isMounted, scriptVersions.length]);

    // Helper function to update highlighted script
    const updateHighlightedScript = (code: string) => {
        // Use the appropriate highlighting method based on line number preference
        const highlighted = showLineNumbers
            ? highlightLuaCodeWithLineNumbers(code)
            : highlightLuaCode(code);
        setHighlightedScript(highlighted);
    };

    // Validate the script
    const validateScript = (code: string) => {
        const result = validateLuaCode(code);
        setValidation(result);
        return result;
    };

    // Update editable script when script prop changes
    useEffect(() => {
        setEditableScript(script)
    }, [script])

    // Add a version to the history
    const addVersionToHistory = (content: string, description: string = "Script update") => {
        const newVersion: ScriptVersion = {
            id: Date.now().toString(),
            timestamp: new Date(),
            content,
            description
        };

        setScriptVersions(prev => [newVersion, ...prev].slice(0, 20)); // Keep only the last 20 versions
    };

    // Load a version from history
    const loadVersion = (versionId: string) => {
        const version = scriptVersions.find(v => v.id === versionId);
        if (version) {
            setEditableScript(version.content);
            updateHighlightedScript(version.content);
            validateScript(version.content);

            if (onScriptChange) {
                onScriptChange(version.content);
            }

            setHistoryDialogOpen(false);

            toast({
                title: "Version Restored",
                description: `Restored script version from ${version.timestamp.toLocaleString()}`,
                variant: "success",
            });
        }
    };

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
        const blob = new Blob([isEditing ? editableScript : script], {type: "text/plain"})
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
        // Validate before executing
        const result = validateScript(isEditing ? editableScript : script);
        if (!result.isValid) {
            toast({
                title: "Validation Error",
                description: "Cannot execute script with syntax errors",
                variant: "destructive",
            });
            return;
        }

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
            // Before saving, validate the script
            const result = validateScript(editableScript);

            if (!result.isValid) {
                // Show validation errors but don't save
                toast({
                    title: "Validation Error",
                    description: `Found ${result.errors.length} syntax error(s). Please fix before saving.`,
                    variant: "destructive",
                });
                return;
            }

            // Add to version history
            addVersionToHistory(editableScript);

            // Save changes
            if (onScriptChange) {
                onScriptChange(editableScript)
            }

            updateHighlightedScript(editableScript);

            toast({
                title: "Changes Saved",
                description: "Your script changes have been saved",
                variant: "success",
            })
        }

        setIsEditing(!isEditing)
    }

    const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newScript = e.target.value;
        setEditableScript(newScript);

        // Debounce real-time syntax validation and highlighting
        if (editingTimeout) {
            clearTimeout(editingTimeout);
        }

        const timeoutId = setTimeout(() => {
            // Validate as user types
            validateScript(newScript);

            // Generate real-time syntax highlighting for the editor
            updateHighlightedScript(newScript);
        }, 500);

        setEditingTimeout(timeoutId);
    }

    const toggleLineNumbers = () => {
        setShowLineNumbers(!showLineNumbers);
        updateHighlightedScript(isEditing ? editableScript : script);
    }

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (editingTimeout) {
                clearTimeout(editingTimeout);
            }
        };
    }, [editingTimeout]);

    return (
        <TooltipProvider>
            <Card className="border-2 border-amber-500/50 bg-game-card shadow-glow">
                <CardHeader
                    className="bg-game-header border-b border-amber-500/30 pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center text-amber-100 text-shadow">
                        <FileCode className="h-5 w-5 mr-2 text-amber-400"/>
                        Lua Script
                        {!validation.isValid && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="ml-2">
                                        <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse"/>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>Script has syntax errors</p>
                                    <ul className="list-disc ml-4 mt-1">
                                        {validation.errors.slice(0, 3).map((error, index) => (
                                            <li key={index} className="text-xs">
                                                Line {error.line}: {error.message}
                                            </li>
                                        ))}
                                        {validation.errors.length > 3 && (
                                            <li className="text-xs">...and {validation.errors.length - 3} more</li>
                                        )}
                                    </ul>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </CardTitle>
                    <div className="flex space-x-2">
                        <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 border-purple-500/50 bg-purple-900/30 text-purple-300 hover:bg-purple-800/50"
                                >
                                    <History className="mr-2 h-4 w-4"/>
                                    History
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Script History</DialogTitle>
                                    <DialogDescription>
                                        View and restore previous versions of your script
                                    </DialogDescription>
                                </DialogHeader>

                                <ScrollArea className="max-h-[400px] mt-4">
                                    <div className="space-y-2">
                                        {scriptVersions.length === 0 ? (
                                            <p className="text-center text-sm text-muted-foreground py-4">No history
                                                available yet</p>
                                        ) : (
                                            <Accordion type="single" collapsible className="w-full">
                                                {scriptVersions.map((version) => (
                                                    <AccordionItem key={version.id} value={version.id}>
                                                        <AccordionTrigger className="hover:bg-muted/50 px-3 rounded-lg">
                                                            <div
                                                                className="flex items-center justify-between w-full pr-4">
                                                                <div className="flex items-center">
                                                                    <Badge variant="outline" className="mr-2">
                                                                        {version.timestamp.toLocaleString()}
                                                                    </Badge>
                                                                    <span
                                                                        className="text-sm">{version.description}</span>
                                                                </div>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <div
                                                                className="bg-black/80 rounded p-2 my-2 max-h-[200px] overflow-auto">
                                <pre className="text-xs">
                                  <code>{version.content.substring(0, 500)}
                                      {version.content.length > 500 ? "..." : ""}
                                  </code>
                                </pre>
                                                            </div>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => loadVersion(version.id)}
                                                                className="mt-2"
                                                            >
                                                                Restore This Version
                                                            </Button>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        )}
                                    </div>
                                </ScrollArea>

                                <DialogFooter className="mt-4">
                                    <Button variant="secondary" onClick={() => setHistoryDialogOpen(false)}>
                                        Close
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleLineNumbers}
                                    className="h-8 border-cyan-500/50 bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800/50"
                                >
                                    {showLineNumbers ? "#" : "¶"}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{showLineNumbers ? "Hide line numbers" : "Show line numbers"}</p>
                            </TooltipContent>
                        </Tooltip>

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
                                            <Save className="mr-2 h-4 w-4"/>
                                            Save
                                        </>
                                    ) : (
                                        <>
                                            <Edit className="mr-2 h-4 w-4"/>
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
                                    disabled={executing || !validation.isValid}
                                    className="h-8 border-green-500/50 bg-green-900/30 text-green-300 hover:bg-green-800/50 disabled:bg-green-900/10 disabled:text-green-300/50"
                                >
                                    {executing ? (
                                        <div
                                            className="animate-spin h-4 w-4 border-2 border-green-300 rounded-full border-t-transparent mr-2"/>
                                    ) : (
                                        <Play className="mr-2 h-4 w-4"/>
                                    )}
                                    {executing ? "Running..." : "Execute"}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{!validation.isValid ? "Fix errors before executing" : "Execute the script"}</p>
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
                                    <Download className="mr-2 h-4 w-4"/>
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
                                            <Check className="mr-2 h-4 w-4"/>
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 h-4 w-4"/>
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
                        <div className="relative">
              <textarea
                  ref={editorRef}
                  title="Lua script editor"
                  placeholder="Edit your Lua script here"
                  className="w-full h-full min-h-[300px] p-4 font-mono text-sm bg-black/80 text-white"
                  value={editableScript}
                  onChange={handleScriptChange}
                  spellCheck="false"
                  autoComplete="off"
              />
                            {validation.errors.length > 0 && (
                                <div className="absolute bottom-4 right-4">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="opacity-80 hover:opacity-100"
                                            >
                                                <AlertCircle className="h-4 w-4 mr-1"/>
                                                {validation.errors.length} error{validation.errors.length > 1 ? 's' : ''}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left" className="max-w-xs">
                                            <p className="font-semibold">Syntax errors:</p>
                                            <ul className="list-disc ml-4 mt-1">
                                                {validation.errors.map((error, index) => (
                                                    <li key={index} className="text-xs">
                                                        Line {error.line}: {error.message}
                                                    </li>
                                                ))}
                                            </ul>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            )}
                        </div>
                    ) : !isMounted ? (
                        <div className="p-0 overflow-auto max-h-[500px] bg-black/80">
                            <pre className="p-4">
                                <code className="font-mono text-sm">
                                    {script}
                                </code>
                            </pre>
                        </div>
                    ) : (
                        <div className="p-0 overflow-auto max-h-[500px] bg-black/80">
                            <style jsx global>{`
                .line {
                  display: flex;
                }
                .line-number {
                  user-select: none;
                  text-align: right;
                  color: #666;
                  min-width: 3em;
                  padding-right: 1em;
                  border-right: 1px solid #444;
                  margin-right: 1em;
                }
                .line-content {
                  white-space: pre;
                }
                pre {
                  padding: 1em;
                  margin: 0;
                }
              `}</style>
                            <pre className="p-4">
                                <code
                                    className="font-mono text-sm language-lua"
                                    dangerouslySetInnerHTML={{__html: highlightedScript}}
                                />
                            </pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}

