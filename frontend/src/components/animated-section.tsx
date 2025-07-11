"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps {
    children: React.ReactNode
    className?: string
    delay?: number
}

export default function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true)
                    }, delay * 1000)
                    observer.unobserve(entry.target)
                }
            },
            {
                threshold: 0.1,
            },
        )

        const currentRef = ref.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [delay])

    return (
        <div
            ref={ref}
            className={cn(
                "transition-all duration-700 ease-in-out",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
                className,
            )}
        >
            {children}
        </div>
    )
}

