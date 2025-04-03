"use client"

import {useEffect, useState} from "react"

// Define standard breakpoints (can be customized)
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface BreakpointConfig {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
}

// Default breakpoints based on common frameworks
const DEFAULT_BREAKPOINTS: BreakpointConfig = {
    xs: 480,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
}

interface ResponsiveOptions {
    breakpoints?: Partial<BreakpointConfig>;
    throttleMs?: number;
    ssrFallback?: boolean; // For SSR environments
}

export function useResponsive(options: ResponsiveOptions = {}) {
    // Merge custom breakpoints with defaults
    const breakpoints = {...DEFAULT_BREAKPOINTS, ...options.breakpoints};
    const throttleMs = options.throttleMs || 100;

    // State for all breakpoints
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        breakpoint: 'md' as Breakpoint,
        isBelow: {} as Record<Breakpoint, boolean>,
        isAbove: {} as Record<Breakpoint, boolean>,
    });

    useEffect(() => {
        // Skip if SSR and fallback option is set
        if (typeof window === 'undefined') return;

        let throttleTimeout: NodeJS.Timeout | null = null;

        const updateScreenSize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Determine current breakpoint
            let currentBreakpoint: Breakpoint = '2xl';
            if (width < breakpoints.xs) currentBreakpoint = 'xs';
            else if (width < breakpoints.sm) currentBreakpoint = 'sm';
            else if (width < breakpoints.md) currentBreakpoint = 'md';
            else if (width < breakpoints.lg) currentBreakpoint = 'lg';
            else if (width < breakpoints.xl) currentBreakpoint = 'xl';

            // Calculate which breakpoints the current width is below/above
            const isBelow = {
                xs: width < breakpoints.xs,
                sm: width < breakpoints.sm,
                md: width < breakpoints.md,
                lg: width < breakpoints.lg,
                xl: width < breakpoints.xl,
                '2xl': width < breakpoints['2xl']
            };

            const isAbove = {
                xs: width >= breakpoints.xs,
                sm: width >= breakpoints.sm,
                md: width >= breakpoints.md,
                lg: width >= breakpoints.lg,
                xl: width >= breakpoints.xl,
                '2xl': width >= breakpoints['2xl']
            };

            setScreenSize({
                width,
                height,
                isMobile: width < breakpoints.md,
                isTablet: width >= breakpoints.md && width < breakpoints.lg,
                isDesktop: width >= breakpoints.lg,
                breakpoint: currentBreakpoint,
                isBelow,
                isAbove
            });
        };

        const handleResize = () => {
            if (throttleMs <= 0) {
                updateScreenSize();
                return;
            }

            if (throttleTimeout) clearTimeout(throttleTimeout);

            throttleTimeout = setTimeout(() => {
                updateScreenSize();
                throttleTimeout = null;
            }, throttleMs);
        };

        // Initial check
        updateScreenSize();

        // Add event listener with throttling
        window.addEventListener("resize", handleResize);

        // Clean up
        return () => {
            window.removeEventListener("resize", handleResize);
            if (throttleTimeout) clearTimeout(throttleTimeout);
        };
    }, [options.ssrFallback, throttleMs,
        breakpoints.xs, breakpoints.sm, breakpoints.md,
        breakpoints.lg, breakpoints.xl, breakpoints['2xl']]);

    return screenSize;
}

// Keep the original hook for backwards compatibility
export function useMobile(customBreakpoint?: number) {
    const {width} = useResponsive();
    const breakpoint = customBreakpoint ?? 768;

    return width < breakpoint;
}

