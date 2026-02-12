"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function HeroSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                            Legal Knowledge made <span className="text-primary">Sahaj</span> (Simple)
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                            Access simplified Indian laws, judgments, and legal articles.
                            Empowering lawyers, students, and citizens.
                        </p>
                    </div>
                    <div className="w-full max-w-sm space-y-2">
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            // @ts-ignore
                            const query = e.target[0].value
                            if (query) {
                                window.location.href = `/search?q=${encodeURIComponent(query)}`
                            }
                        }} className="flex space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-8 max-w-lg flex-1"
                                    placeholder="Search for laws, judgments, or articles..."
                                    type="search"
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
