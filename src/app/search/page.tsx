import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

export const metadata = {
    title: "Search Results - Sahej Vidhi",
    description: "Search results for laws, judgments, and legal articles.",
}

interface PageProps {
    searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: PageProps) {
    const query = searchParams.q
    const supabase = await createClient()

    let results: any[] = []

    if (query) {
        const { data, error } = await supabase
            .rpc('link_search', { query_text: query })

        if (!error && data) {
            results = data
        } else {
            // Fallback if RPC fails or not exists (simple text match)
            const { data: fallbackData } = await supabase
                .from('content')
                .select('*')
                .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
                .eq('status', 'published')
                .order('published_at', { ascending: false })
                .limit(20)

            results = fallbackData || []
        }
    }

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold tracking-tight mb-6 flex items-center">
                <Search className="mr-3 h-8 w-8" />
                Search Results for "{query || ''}"
            </h1>

            {results.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {results.map((item) => (
                        <Card key={item.id} className="hover:bg-muted/30 transition-colors">
                            <Link href={`/articles/${item.slug || item.id}`}>
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <BagdeForType type={item.type} />
                                        {item.categories && <Badge variant="outline">{item.categories.name}</Badge>}
                                    </div>
                                    <CardTitle className="text-lg text-blue-600 hover:underline">
                                        {item.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {item.summary || (item.body ? item.body.substring(0, 150) + "..." : "No summary available.")}
                                    </CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    {query ? "No results found. Try different keywords." : "Enter a search term to begin."}
                </div>
            )}
        </div>
    )
}

function BagdeForType({ type }: { type: string }) {
    switch (type) {
        case 'judgment':
            return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Judgment</Badge>
        case 'order':
            return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Order</Badge>
        default:
            return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Article</Badge>
    }
}
