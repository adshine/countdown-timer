"use client"

import { useRef } from "react"
import TextCursorProximity from "@/components/ui/text-cursor-proximity"

const ASCII = ["\u270E", "\u2710", "\u2711", "\u2711"]

export default function WorkshopPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      ref={containerRef}
    >
      <div 
        className="relative w-full h-full overflow-hidden flex flex-col justify-start items-start text-white cursor-pointer"
        style={{ 
          backgroundColor: "#0000FF", // Swiss design blue
        }}
      >
        <div className="flex flex-col pt-12 pl-12 sm:pt-16 sm:pl-16">
          <TextCursorProximity
            label="DIGITAL"
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-swiss tracking-tighter font-light"
            styles={{
              transform: {
                from: "scale(1)",
                to: "scale(1.4)",
              },
              color: { 
                from: "#FFFFFF", 
                to: "#FFF9E0" // Cream color - more faithful to the Swiss design image
              },
            }}
            falloff="gaussian"
            radius={100}
            containerRef={containerRef}
          />
          <TextCursorProximity
            label="WORKSHOP"
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-swiss tracking-tighter font-light"
            styles={{
              transform: {
                from: "scale(1)",
                to: "scale(1.4)",
              },
              color: { 
                from: "#FFFFFF", 
                to: "#FFF9E0" // Cream color - more faithful to the Swiss design image
              },
            }}
            falloff="gaussian"
            radius={100}
            containerRef={containerRef}
          />
        </div>

        <div className="absolute bottom-6 flex w-full justify-between px-12">
          {ASCII.map((pencil, i) => (
            <span 
              key={i} 
              className="text-3xl opacity-80"
              style={{ fontFamily: "serif" }}
            >
              {pencil}
            </span>
          ))}
        </div>

        <TextCursorProximity
          className="absolute top-6 right-12 text-sm font-swiss"
          label="15/01/2025"
          styles={{
            transform: {
              from: "scale(1)",
              to: "scale(1.4)",
            },
            color: { 
              from: "#FFFFFF", 
              to: "#FFF9E0" // Cream color - more faithful to the Swiss design image
            },
          }}
          falloff="linear"
          radius={15}
          containerRef={containerRef}
        />
      </div>
    </div>
  )
} 