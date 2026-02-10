"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Scale, Search, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    const routes = [
        { href: "/", label: "Home" },
        { href: "/categories", label: "Browse Law" },
        { href: "/courts", label: "Courts" },
        { href: "/about", label: "About" },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-[#0f172a] dark:bg-[#000000] text-white backdrop-blur supports-[backdrop-filter]:bg-[#0f172a]/95 dark:supports-[backdrop-filter]:bg-[#000000]/95">
            <div className="container flex h-16 items-center">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="mr-2 md:hidden text-white hover:bg-white/10 hover:text-white">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-[#0f172a] dark:bg-[#000000] text-white border-r-border">
                        <nav className="flex flex-col gap-4 mt-8">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={`text-lg font-medium transition-colors hover:text-[#d97706] ${pathname === route.href
                                        ? "text-[#d97706]"
                                        : "text-white/80"
                                        }`}
                                >
                                    {route.label}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
                <Link href="/" className="mr-8 flex items-center space-x-2">
                    <Scale className="h-6 w-6 text-[#d97706]" />
                    <span className="hidden font-bold sm:inline-block text-xl text-white">Sahej <span className="text-[#d97706]">Vidhi</span></span>
                </Link>
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`transition-colors hover:text-[#d97706] ${pathname === route.href ? "text-[#d97706]" : "text-white/80"
                                }`}
                        >
                            {route.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            // @ts-ignore
                            const query = e.target[0].value
                            if (query) {
                                window.location.href = `/search?q=${encodeURIComponent(query)}`
                            }
                        }}>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search articles..."
                                    className="h-9 md:w-[300px] lg:w-[400px] pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-[#d97706] dark:bg-white/5"
                                />
                            </div>
                        </form>
                    </div>
                    <ModeToggle />
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/10">
                                    <Avatar className="h-8 w-8 border border-white/20">
                                        <AvatarImage src="/avatars/01.png" alt={user.email} />
                                        <AvatarFallback className="bg-[#0f172a] text-white">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">User</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {user.user_metadata?.role === 'admin' && (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin/dashboard">Admin Dashboard</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                <DropdownMenuItem onClick={handleSignOut}>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : null}
                </div>
            </div>
        </header>
    )
}
