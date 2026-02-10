import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"

export async function FeaturedArticles() {
    const supabase = await createClient()
    const { data: articles } = await supabase
        .from('content')
        .select('*, profiles(full_name), categories(name)')
        .eq('is_featured', true)
        // .eq('type', 'article') // Removed to allow all featured types (judgments, etc.)
        .eq('status', 'published') // Assuming a status field or using published_at not null
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(3)

    if (!articles || articles.length === 0) {
        return null // Don't show section if no featured articles
    }

    return (
        <section className="container px-4 md:px-6 py-12 bg-muted/20">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold tracking-tighter">Articles by Advocates</h2>
                <Button variant="ghost" asChild>
                    <Link href="/articles">View All</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <Card key={article.id} className="flex flex-col h-full">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className="mb-2">{article.categories?.name || "Legal"}</Badge>
                                <span className="text-xs text-muted-foreground">
                                    {article.published_at ? format(new Date(article.published_at), 'PPP') : ''}
                                </span>
                            </div>
                            <CardTitle className="line-clamp-2 hover:underline">
                                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                            </CardTitle>
                            <CardDescription className="line-clamp-1">
                                By {article.profiles?.full_name || "Unknown Author"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground line-clamp-3">
                                {article.summary || article.body?.substring(0, 150) + "..."}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/articles/${article.slug}`}>Read More</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    )
}
