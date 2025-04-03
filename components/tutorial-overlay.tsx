"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {ArrowLeft, ArrowRight, BookOpen, X} from "lucide-react"

interface TutorialOverlayProps {
    onClose: () => void
}

export function TutorialOverlay({onClose}: TutorialOverlayProps) {
    const [step, setStep] = useState(0)

    const tutorialSteps = [
        {
            title: "Welcome to ME-Gui",
            content: "This tool helps you create Lua scripts by dragging and dropping functions. Let's learn how to use it!",
            image: "/tutorial-welcome.svg",
        },
        {
            title: "Browse API Functions",
            content:
                "The API Functions panel contains all available functions. Browse by category or search for specific functions.",
            image: "/tutorial-browse.svg",
        },
        {
            title: "Add Functions to Your Script",
            content: "Drag functions from the API panel to the script builder, or click the + button to add them.",
            image: "/tutorial-drag.svg",
        },
        {
            title: "Configure Parameters",
            content:
                "Click on a function to expand it and configure its parameters. Each parameter has a type and description.",
            image: "/tutorial-configure.svg",
        },
        {
            title: "Reorder Your Script",
            content:
                "Drag functions up or down to change their execution order. Toggle the switch to enable/disable functions.",
            image: "/tutorial-reorder.svg",
        },
        {
            title: "Generate and Use Your Script",
            content: "Your script is automatically generated. Copy, download, or execute it directly from the interface.",
            image: "/tutorial-generate.svg",
        },
        {
            title: "Creating Complex Scripts",
            content:
                "For complex scripts like boss fights, build your script in sections: initialization, helper functions, main logic, and cleanup. Use the parameter tooltips to understand what each function needs.",
            image: "/tutorial-complex.svg",
        },
    ]

    const currentStep = tutorialSteps[step]

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-game-card border-2 border-amber-500/50 rounded-lg shadow-glow max-w-2xl w-full">
                <div className="flex justify-between items-center p-4 border-b border-amber-500/30 bg-game-header">
                    <h2 className="text-xl font-bold text-amber-100 text-shadow flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-amber-400"/>
                        {currentStep.title}
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/50"
                    >
                        <X className="h-5 w-5"/>
                    </Button>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-full md:w-1/2">
                            <img
                                src={currentStep.image || "/placeholder.svg"}
                                alt={currentStep.title}
                                className="w-full h-auto rounded-lg border border-amber-500/30 bg-amber-900/20"
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <p className="text-amber-200 mb-4">{currentStep.content}</p>
                            <div className="flex justify-between items-center mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                                    disabled={step === 0}
                                    className="border-amber-500/50 bg-amber-900/30 text-amber-300 hover:bg-amber-800/50 disabled:opacity-50"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4"/>
                                    Previous
                                </Button>

                                {step < tutorialSteps.length - 1 ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep((prev) => Math.min(tutorialSteps.length - 1, prev + 1))}
                                        className="border-amber-500/50 bg-amber-900/30 text-amber-300 hover:bg-amber-800/50"
                                    >
                                        Next
                                        <ArrowRight className="ml-2 h-4 w-4"/>
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={onClose}
                                        className="border-green-500/50 bg-green-900/30 text-green-300 hover:bg-green-800/50"
                                    >
                                        Get Started
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center p-4 border-t border-amber-500/30">
                    <div className="flex space-x-2">
                        {tutorialSteps.map((_, i) => (
                            <button
                                key={i}
                                aria-label={`Go to step ${i + 1}`}
                                className={`w-2 h-2 rounded-full ${i === step ? "bg-amber-500" : "bg-amber-500/30"}`}
                                onClick={() => setStep(i)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

