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

    // Update proximities on mouse move
    useEffect(() => {
      if (letterRefs.current.length === 0 || !containerRef.current) return
        
      const updateProximities = () => {
        if (!containerRef.current) return
        const containerRect = containerRef.current.getBoundingClientRect()
        
        const newProximities = [...letterProximities]
        
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
          newProximities[index] = proximity
        })
        
        setLetterProximities(newProximities)
      }
      
      const animationFrame = requestAnimationFrame(function animate() {
        updateProximities()
        requestAnimationFrame(animate)
      })
      
      return () => {
        cancelAnimationFrame(animationFrame)
      }
    }, [containerRef, mousePositionRef, letterProximities, radius, falloff])

    const words = label.split(" ")
    let letterIndex = 0

    // Improved interpolation for colors and other values
    const getStylesForLetter = (proximity: number): Record<string, string | number> => {
      const result: Record<string, string | number> = {}
      
      Object.entries(styles).forEach(([key, value]) => {
        // Skip if value is undefined
        if (!value || value.from === undefined || value.to === undefined) return;
        
        const fromValue = value.from;
        const toValue = value.to;
        
        if (typeof fromValue === 'number' && typeof toValue === 'number') {
          // Linear interpolation for numeric values
          result[key] = fromValue + (toValue - fromValue) * proximity
        } else if (
          typeof fromValue === 'string' && typeof toValue === 'string' && 
          fromValue.startsWith('#') && toValue.startsWith('#')
        ) {
          // Color interpolation for hex colors
          if (proximity <= 0) {
            result[key] = fromValue
          } else if (proximity >= 1) {
            result[key] = toValue
          } else {
            // Simple color implementation - just switch at 50%
            result[key] = proximity > 0.5 ? toValue : fromValue
          }
        } else {
          // Default handling for other types - ensure they're both strings or numbers
          result[key] = proximity > 0.5 ? toValue : fromValue
        }
      })
      
      return result
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
              const letterStyle = 
                currentLetterIndex < letterProximities.length
                ? getStylesForLetter(letterProximities[currentLetterIndex])
                : getStylesForLetter(0) // Default to 0 proximity if not initialized yet
              
              return (
                <motion.span
                  key={currentLetterIndex}
                  ref={(el: HTMLSpanElement | null) => {
                    letterRefs.current[currentLetterIndex] = el
                  }}
                  className="inline-block"
                  aria-hidden="true"
                  style={letterStyle}
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