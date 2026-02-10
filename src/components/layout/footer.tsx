import { Scale } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#0f172a] text-white">
            <div className="container py-8 md:py-12">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
                        <Scale className="h-6 w-6 text-[#d97706]" />
                        <span className="font-bold text-lg">Sahej <span className="text-[#d97706]">Vidhi</span></span>
                    </div>
                    <p className="text-center text-sm text-white/60 md:text-left">
                        &copy; {new Date().getFullYear()} Sahej Vidhi. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
