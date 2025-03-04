import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme, type Theme } from "@/components/theme-provider"
import { useState, useEffect } from "react"

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState<Theme>(theme)
    useEffect(() => {
        setTheme(currentTheme)
    }, [theme])

    const handleTheme = () => {
        const newTheme = currentTheme === "light" ? "dark" : "light";
        setCurrentTheme(newTheme);
        setTheme(newTheme);
    };
    return (
        <Button variant="ghost" size="icon" onClick={handleTheme} aria-label="Toggle Theme">
            {currentTheme === "light" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            ) : (
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            )}
        </Button>
    );
}
