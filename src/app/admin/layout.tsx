"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FilePlus, Settings, LogOut, FileText, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    // If on login page, render without admin sidebar
    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/admin/login")
        router.refresh()
    }

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/upload", label: "Create Content", icon: FilePlus },
        { href: "/admin/content", label: "Manage Content", icon: FileText },
        { href: "/admin/categories", label: "Manage Categories", icon: Layers },
    ]

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 lg:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <span className="">Sahej Vidhi Admin</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === item.href
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                        }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-auto p-4">
                        <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                {/* Mobile header could go here */}
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
