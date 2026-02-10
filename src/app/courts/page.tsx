import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Gavel, Building2, Scale } from "lucide-react"

export const metadata = {
    title: "Courts - Sahej Vidhi",
    description: "Access judgments and orders from Supreme Court and High Courts of India.",
}

const COURTS_DATA = [
    { name: "Allahabad High Court", url: "http://www.allahabadhighcourt.in/", slug: "allahabad-high-court" },
    { name: "Andhra Pradesh High Court", url: "https://aphc.gov.in/", slug: "andhra-pradesh-high-court" },
    { name: "Bombay High Court", url: "https://bombayhighcourt.nic.in/", slug: "bombay-high-court" },
    { name: "Calcutta High Court", url: "https://www.calcuttahighcourt.gov.in/", slug: "calcutta-high-court" },
    { name: "Chhattisgarh High Court", url: "https://highcourt.cg.gov.in/", slug: "chhattisgarh-high-court" },
    { name: "Delhi High Court", url: "https://delhihighcourt.nic.in/", slug: "delhi-high-court" },
    { name: "Gauhati High Court", url: "https://ghconline.gov.in/", slug: "gauhati-high-court" },
    { name: "Gujarat High Court", url: "https://gujarathighcourt.nic.in/", slug: "gujarat-high-court" },
    { name: "Himachal Pradesh High Court", url: "https://hphighcourt.nic.in/", slug: "himachal-pradesh-high-court" },
    { name: "Jammu & Kashmir High Court", url: "https://jkhighcourt.nic.in/", slug: "jammu-kashmir-high-court" },
    { name: "Jharkhand High Court", url: "https://jharkhandhighcourt.nic.in/", slug: "jharkhand-high-court" },
    { name: "Karnataka High Court", url: "https://karnatakajudiciary.kar.nic.in/", slug: "karnataka-high-court" },
    { name: "Kerala High Court", url: "https://hckerala.gov.in/", slug: "kerala-high-court" },
    { name: "Madhya Pradesh High Court", url: "https://mphc.gov.in/", slug: "madhya-pradesh-high-court" },
    { name: "Madras High Court", url: "https://www.hcmadras.tn.nic.in/", slug: "madras-high-court" },
    { name: "Manipur High Court", url: "https://hcmimphal.nic.in/", slug: "manipur-high-court" },
    { name: "Meghalaya High Court", url: "https://meghalayahighcourt.nic.in/", slug: "meghalaya-high-court" },
    { name: "Orissa High Court", url: "https://www.orissahighcourt.nic.in/", slug: "orissa-high-court" },
    { name: "Patna High Court", url: "https://patnahighcourt.gov.in/", slug: "patna-high-court" },
    { name: "Punjab and Haryana High Court", url: "https://highcourtchd.gov.in/", slug: "punjab-haryana-high-court" },
    { name: "Rajasthan High Court", url: "https://hcraj.nic.in/", slug: "rajasthan-high-court" },
    { name: "Sikkim High Court", url: "https://hcs.gov.in/", slug: "sikkim-high-court" },
    { name: "Telangana High Court", url: "https://tshc.gov.in/", slug: "telangana-high-court" },
    { name: "Tripura High Court", url: "https://thc.nic.in/", slug: "tripura-high-court" },
    { name: "Uttarakhand High Court", url: "https://highcourtofuttarakhand.gov.in/", slug: "uttarakhand-high-court" },
]

export default function CourtsPage() {
    return (
        <div className="container py-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-[#0f172a] dark:text-white">Indian Courts</h1>
            <p className="text-muted-foreground mb-12">Access judgments and orders from the Supreme Court and High Courts of India.</p>

            {/* Supreme Court Section */}
            <div className="mb-16 bg-[#fdf8f6] dark:bg-[#121212] border border-[#d97706]/20 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                <div className="bg-[#d97706]/10 p-6 rounded-full">
                    <Scale className="h-12 w-12 text-[#d97706]" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-serif font-bold mb-2 text-[#0f172a] dark:text-white">Supreme Court of India</h2>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
                        <Button variant="outline" className="border-[#d97706] text-[#d97706] hover:bg-[#d97706] hover:text-white" asChild>
                            <a href="https://main.sci.gov.in/" target="_blank" rel="noopener noreferrer">
                                Official Website <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                        <Button variant="secondary" asChild>
                            <Link href="/categories/constitutional-law">View Judgments</Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/search?court=supreme-court">Recent Orders</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* High Courts Section */}
            <section>
                <h2 className="text-2xl font-serif font-bold mb-8 flex items-center text-[#0f172a] dark:text-white">
                    <Building2 className="mr-3 h-6 w-6 text-[#d97706]" /> High Courts of India
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {COURTS_DATA.map((court) => (
                        <Card key={court.slug} className="hover:shadow-lg transition-all dark:bg-[#121212] dark:border-[#333]">
                            <CardHeader>
                                <CardTitle className="font-serif text-lg">{court.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                                        <a href={court.url} target="_blank" rel="noopener noreferrer">
                                            Website <ExternalLink className="ml-1 h-3 w-3" />
                                        </a>
                                    </Button>
                                    <Button variant="secondary" size="sm" className="h-8 text-xs bg-[#fdf8f6] text-[#d97706] hover:bg-[#d97706] hover:text-white dark:bg-[#333] dark:text-white dark:hover:bg-[#444]" asChild>
                                        <Link href={`/courts/${court.slug}`}>Judgments <Gavel className="ml-1 h-3 w-3" /></Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    )
}

