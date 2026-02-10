import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Scale, BookOpen, Users, Gavel } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About Sahej Vidhi</h1>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Your comprehensive legal knowledge repository for Indian Law.
                                    Empowering lawyers, students, and researchers with accessible judgments and articles.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-[#0f172a]">Our Mission</h2>
                                <p className="text-muted-foreground">
                                    To democratize access to legal knowledge in India by providing a structured,
                                    easy-to-navigate platform for court judgments, legal articles, and expert insights.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-[#0f172a]">Founder</h2>
                                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                                    <div className="h-12 w-12 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xl">
                                        K
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Kalyan Singh</h3>
                                        <p className="text-sm text-muted-foreground">Founder, Sahej Vidhi</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-[#0f172a]">Contact & Support</h2>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-[#0f172a]">General Inquiries:</span>
                                        <a href="mailto:contact@sahejvidhi.com" className="text-[#d97706] hover:underline">contact@sahejvidhi.com</a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-[#0f172a]">Article Submissions:</span>
                                        <a href="mailto:submissions@sahejvidhi.com" className="text-[#d97706] hover:underline">submissions@sahejvidhi.com</a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-[#0f172a]">Support:</span>
                                        <a href="mailto:support@sahejvidhi.com" className="text-[#d97706] hover:underline">support@sahejvidhi.com</a>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-[#0f172a]">What We Offer</h2>
                                <ul className="grid gap-4">
                                    <li className="flex items-center gap-2">
                                        <Scale className="h-5 w-5 text-[#d97706]" />
                                        <span>Comprehensive Database of Judgments</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-[#d97706]" />
                                        <span>Expert Legal Articles</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-[#d97706]" />
                                        <span>Community for Legal Professionals</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Gavel className="h-5 w-5 text-[#d97706]" />
                                        <span>Updates from High Courts & Supreme Court</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Start Reading</h2>
                                <p className="max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed">
                                    Browse our extensive collection of judgments and legal articles.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Button asChild variant="secondary" size="lg">
                                    <Link href="/categories">Browse Library</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
