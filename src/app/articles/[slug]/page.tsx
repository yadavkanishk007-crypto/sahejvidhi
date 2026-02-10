import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, User, FileText, Download, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"

interface PageProps {
    params: Promise<{ slug: string }>
}

async function getContent(slug: string) {
    const supabase = await createClient()

    // Try to find by slug
    let { data: content, error } = await supabase
        .from('content')
        .select('*, profiles(full_name), categories(name, slug, id), courts(name)')
        .eq('slug', slug)
        .single()

    if (error || !content) {
        // Fallback by ID
        const { data: contentById } = await supabase
            .from('content')
            .select('*, profiles(full_name), categories(name, slug, id), courts(name)')
            .eq('id', slug)
            .single()
        content = contentById
    }

    return content
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const content = await getContent(slug)
    if (!content) return { title: 'Content Not Found' }
    return {
        title: `${content.title} - Sahej Vidhi`,
        description: content.summary || `Read ${content.title} on Sahej Vidhi.`,
    }
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params
    const content = await getContent(slug)

    if (!content) {
        notFound()
    }

    return (
        <article className="container py-10 max-w-4xl">
            <div className="mb-8">
                <Button variant="ghost" size="sm" asChild className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
                    <Link href="/" className="flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                </Button>

                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="text-sm">
                        {content.type.toUpperCase().replace('_', ' ')}
                    </Badge>
                    {content.categories && (
                        <Badge variant="outline" className="text-sm">
                            <Link href={`/categories/${content.categories.slug || content.categories.id}`}>
                                {content.categories.name}
                            </Link>
                        </Badge>
                    )}
                    {content.courts && (
                        <Badge variant="outline" className="text-sm border-blue-200 bg-blue-50 text-blue-700">
                            {content.courts.name}
                        </Badge>
                    )}
                </div>

                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                    {content.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
                    <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span className="font-medium text-foreground">{content.profiles?.full_name || "Sahej Vidhi Team"}</span>
                    </div>
                    {content.published_at && (
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>{format(new Date(content.published_at), 'PPP')}</span>
                        </div>
                    )}
                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                </div>
            </div>

            <Separator className="mb-10" />

            {/* Main Content Body */}
            <div className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none mb-12">
                {content.body ? (
                    <div dangerouslySetInnerHTML={{ __html: content.body }} />
                ) : (
                    <p className="italic text-muted-foreground">No text content available.</p>
                )}
            </div>

            {/* PDF View/Download */}
            {content.pdf_url && (
                <Card className="bg-muted/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-full mr-4">
                            <FileText className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Official Document</h3>
                            <p className="text-sm text-muted-foreground">Download the full text PDF.</p>
                        </div>
                    </div>
                    <Button asChild>
                        <a href={content.pdf_url} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </a>
                    </Button>
                </Card>
            )}
        </article>
    )
}
