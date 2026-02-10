import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Gavel, Globe, ArrowLeft, Home, ChevronRight, Scale } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

// Static Data for Lookup (Same as CourtsPage)
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

interface PageProps {
    params: Promise<{ slug: string }>
}

async function getCourtContent(courtId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('content')
        .select('*, profiles(full_name)')
        .eq('court_id', courtId)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
    return data || []
}

async function getCourtDbRecord(name: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('courts')
        .select('*')
        .ilike('name', name) // Case insensitive match
        .single()
    return data
}

export default async function CourtDetailsPage({ params }: PageProps) {
    const { slug } = await params
    const courtInfo = COURTS_DATA.find(c => c.slug === slug)

    if (!courtInfo) {
        return notFound()
    }

    // Try to find the DB record to get ID for filtering content
    // We match by name since we don't have slugs in DB yet (likely)
    const dbCourt = await getCourtDbRecord(courtInfo.name)

    const content = dbCourt ? await getCourtContent(dbCourt.id) : []

    return (
        <div className="container py-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted-foreground mb-8">
                <Link href="/" className="hover:text-foreground flex items-center">
                    <Home className="h-4 w-4 mr-1" /> Home
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <Link href="/courts" className="hover:text-foreground">
                    Courts
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-foreground font-medium">{courtInfo.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row gap-6 mb-10 items-start">
                <div className="bg-primary/5 p-4 rounded-lg">
                    <Scale className="h-10 w-10 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 ">{courtInfo.name}</h1>
                    <div className="flex gap-4 mt-4">
                        <Button variant="outline" size="sm" asChild>
                            <a href={courtInfo.url} target="_blank" rel="noopener noreferrer">
                                <Globe className="mr-2 h-4 w-4" /> Official Website
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Gavel className="mr-2 h-6 w-6" /> Judgments & Orders
            </h2>

            {content.length > 0 ? (
                <div className="grid gap-4">
                    {content.map((item) => (
                        <ContentItem key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="p-12 border rounded-lg border-dashed text-center">
                    <h3 className="text-lg font-medium">No judgments found</h3>
                    <p className="text-muted-foreground mt-2">
                        There are currently no judgments or orders listed for {courtInfo.name}.
                    </p>
                </div>
            )}
        </div>
    )
}

function ContentItem({ item }: { item: any }) {
    return (
        <Card className="hover:bg-muted/30 transition-colors">
            <Link href={`/articles/${item.slug || item.id}`} className="block h-full">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                                {item.type === 'judgment' ? 'Judgment' : 'Order'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                {item.published_at ? format(new Date(item.published_at), 'PPP') : ''}
                            </span>
                        </div>
                    </div>
                    <CardTitle className="text-lg text-blue-600 hover:underline hover:text-blue-800">
                        {item.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                        {item.summary || "Click to read more..."}
                    </CardDescription>
                </CardHeader>
            </Link>
        </Card>
    )
}
