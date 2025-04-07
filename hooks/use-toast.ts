type ToastVariant = "default" | "success" | "destructive"

interface ToastProps {
    title: string
    description: string
    variant?: ToastVariant
    duration?: number
}

interface Toast extends ToastProps {
    id: string
}

// Simple toast implementation
export const toast = ({title, description, variant = "default", duration = 3000}: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toastContainer = document.getElementById("toast-container")

    if (!toastContainer) {
        // Create toast container if it doesn't exist
        const container = document.createElement("div")
        container.id = "toast-container"
        container.className = "fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md"
        document.body.appendChild(container)
    }

    // Create toast element
    const toastElement = document.createElement("div")
    toastElement.id = `toast-${id}`
    toastElement.className = `
    p-4 rounded-lg shadow-lg border-2 transform transition-all duration-300 ease-in-out translate-x-0
    ${
        variant === "success"
            ? "bg-green-900/80 border-green-500/50 text-green-100"
            : variant === "destructive"
                ? "bg-red-900/80 border-red-500/50 text-red-100"
                : "bg-amber-900/80 border-amber-500/50 text-amber-100"
    }
  `

    // Add title
    const titleElement = document.createElement("div")
    titleElement.className = "font-medium"
    titleElement.textContent = title
    toastElement.appendChild(titleElement)

    // Add description
    const descElement = document.createElement("div")
    descElement.className = "text-sm opacity-90"
    descElement.textContent = description
    toastElement.appendChild(descElement)

    // Add to container
    document.getElementById("toast-container")?.appendChild(toastElement)

    // Animate in
    setTimeout(() => {
        toastElement.classList.add("translate-x-0")
        toastElement.classList.remove("translate-x-full")
    }, 10)

    // Remove after duration
    setTimeout(() => {
        toastElement.classList.add("translate-x-full")
        toastElement.classList.add("opacity-0")

        setTimeout(() => {
            toastElement.remove()
        }, 300)
    }, duration)

    return id
}

