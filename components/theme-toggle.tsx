"use client"
import {Moon, Sun} from "lucide-react"
import {useTheme} from "next-themes"

import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"

export function ThemeToggle() {
    const {setTheme} = useTheme()

    return (
        <TooltipProvider>
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-amber-500/50 bg-amber-900/30 hover:bg-amber-800/50"
                            >
                                <Sun
                                    className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-300"/>
                                <Moon
                                    className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-amber-300"/>
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Change theme</p>
                    </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="bg-game-card border-amber-500/50">
                    <DropdownMenuItem
                        onClick={() => setTheme("light")}
                        className="text-amber-200 focus:text-amber-100 focus:bg-amber-800/50"
                    >
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setTheme("dark")}
                        className="text-amber-200 focus:text-amber-100 focus:bg-amber-800/50"
                    >
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setTheme("system")}
                        className="text-amber-200 focus:text-amber-100 focus:bg-amber-800/50"
                    >
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </TooltipProvider>
    )
}

