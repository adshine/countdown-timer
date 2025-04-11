"use client"

import React, { CSSProperties, forwardRef, useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useMousePositionRef } from "@/hooks/use-mouse-position-ref"

// Helper type that makes all properties of CSSProperties accept number | string
type CSSPropertiesWithValues = {
  [K in keyof CSSProperties]: string | number
}

interface StyleValue<T extends keyof CSSPropertiesWithValues> {
  from: CSSPropertiesWithValues[T]
  to: CSSPropertiesWithValues[T]
}

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string
  styles: Partial<{
    [K in keyof CSSPropertiesWithValues]: StyleValue<K>
  }>
  containerRef: React.RefObject<HTMLDivElement | null>
  radius?: number
  falloff?: "linear" | "exponential" | "gaussian"
}

const TextCursorProximity = forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      label,
      styles,
      containerRef,
      radius = 50,
      falloff = "linear",
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
    const mousePositionRef = useMousePositionRef(containerRef)
    const [letterProximities, setLetterProximities] = useState<number[]>([])
    const animationFrameIdRef = useRef<number>(0)
    
    // Initialize letter proximities
    useEffect(() => {
      const letterCount = label.replace(/\s/g, "").length
      setLetterProximities(Array(letterCount).fill(0))
    }, [label])

    const calculateDistance = (
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ): number => {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }

    const calculateFalloff = (distance: number): number => {
      const normalizedDistance = Math.min(Math.max(1 - distance / radius, 0), 1)

      switch (falloff) {
        case "exponential":
          return Math.pow(normalizedDistance, 2)
        case "gaussian":
          return Math.exp(-Math.pow(distance / (radius / 2), 2) / 2)
        case "linear":
        default:
          return normalizedDistance
      }
    }

    // Update proximities on animation frame
    useEffect(() => {
      if (!containerRef.current) return
      
      const updateProximities = () => {
        if (!containerRef.current) return
        const containerRect = containerRef.current.getBoundingClientRect()
        
        const newProximities = [...letterProximities]
        let hasChanged = false
        
        letterRefs.current.forEach((letterRef, index) => {
          if (!letterRef) return
          
          const rect = letterRef.getBoundingClientRect()
          const letterCenterX = rect.left + rect.width / 2 - containerRect.left
          const letterCenterY = rect.top + rect.height / 2 - containerRect.top
          
          const distance = calculateDistance(
            mousePositionRef.current.x,
            mousePositionRef.current.y,
            letterCenterX,
            letterCenterY
          )
          
          const proximity = calculateFalloff(distance)
          
          // Only update if there's a meaningful change
          if (Math.abs(newProximities[index] - proximity) > 0.01) {
            newProximities[index] = proximity
            hasChanged = true
          }
        })
        
        // Only trigger re-render if proximities actually changed
        if (hasChanged) {
          setLetterProximities(newProximities)
        }
      }
      
      const animate = () => {
        updateProximities()
        animationFrameIdRef.current = requestAnimationFrame(animate)
      }
      
      animationFrameIdRef.current = requestAnimationFrame(animate)
      
      return () => {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }, [containerRef, letterProximities, radius, falloff])

    const words = label.split(" ")
    let letterIndex = 0

    // Helper to interpolate styles based on proximity
    const interpolateStyle = (
      key: string, 
      from: string | number, 
      to: string | number, 
      proximity: number
    ): string | number => {
      // Handle numeric values
      if (typeof from === "number" && typeof to === "number") {
        return from + (to - from) * proximity
      }
      
      // Handle color values (simple implementation)
      if (typeof from === "string" && typeof to === "string") {
        // Simple approach - just switch at 50% proximity
        return proximity > 0.5 ? to : from
      }
      
      return from // Default fallback
    }

    return (
      <span
        ref={ref}
        className={`${className} inline`}
        onClick={onClick}
        {...props}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split("").map((letter) => {
              const currentLetterIndex = letterIndex++
              const proximity = letterProximities[currentLetterIndex] || 0
              
              // Create interpolated styles for this letter
              const letterStyles: Record<string, string | number> = {}
              
              Object.entries(styles).forEach(([key, value]) => {
                if (value && 
                   'from' in value && 
                   'to' in value && 
                   value.from !== undefined && 
                   value.to !== undefined) {
                  // Now we're sure from and to are defined string or number values
                  const fromValue = value.from as string | number;
                  const toValue = value.to as string | number;
                  letterStyles[key] = interpolateStyle(key, fromValue, toValue, proximity);
                }
              })

              return (
                <motion.span
                  key={currentLetterIndex}
                  ref={(el: HTMLSpanElement | null) => {
                    letterRefs.current[currentLetterIndex] = el
                  }}
                  className="inline-block"
                  aria-hidden="true"
                  style={letterStyles}
                >
                  {letter}
                </motion.span>
              )
            })}
            {wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
        <span className="sr-only">{label}</span>
      </span>
    )
  }
)

TextCursorProximity.displayName = "TextCursorProximity"
export default TextCursorProximity 