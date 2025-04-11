import { useEffect, useRef } from "react"

interface MousePosition {
  x: number
  y: number
}

export function useMousePositionRef(containerRef: React.RefObject<HTMLElement | null>) {
  const mousePosition = useRef<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      
      // Calculate position relative to the container
      mousePosition.current = {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top
      }
    }

    // Initialize with center position
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      mousePosition.current = {
        x: rect.width / 2,
        y: rect.height / 2
      }
    }

    window.addEventListener("mousemove", updateMousePosition)
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [containerRef])

  return mousePosition
} 