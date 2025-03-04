import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Github} from "lucide-react" //change this to the correct icon library

export default function Footer() {
    return (
        <footer className="w-full border-t dark:border-gray-500 border-gray-700 bg-background py-5">
            <div className="container grid gap-8 px-4 md:px-6 lg:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold">Learn Basics</span>
                    </Link>
                    <p className="text-sm text-muted-foreground">Tu aplicacion para programar en directo.</p>
                    <div className="flex gap-4 mt-2">
                        <Link to="#">
                            <Button variant="ghost" size="icon" aria-label="GitHub">
                                <Github className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="grid gap-2">
                    <p className="text-xs text-muted-foreground text-center">
                        © {new Date().getFullYear()}. Casi todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    )
}

