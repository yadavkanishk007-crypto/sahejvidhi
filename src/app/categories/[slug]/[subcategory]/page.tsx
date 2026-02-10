import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { FileText, Gavel, ChevronRight, Home, Folder } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface PageProps {
    params: Promise<{ slug: string; subcategory: string }>
}

async function getCategory(slug: string) {
    const supabase = await createClient()
    let { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single()
    return data
}

// Reuse logic but check parent_id to ensure hierarchy
async function getSubcategory(parentSlug: string, subSlug: string) {
    const supabase = await createClient()
    // First get parent
    const parent = await getCategory(parentSlug)
    if (!parent) return null

    // Then get subcat with that parent
    const { data: subcat } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', subSlug)
        .eq('parent_id', parent.id)
        .single()

    return subcat ? { ...subcat, parent } : null
}

async function getContent(categoryId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('content')
        .select('*, profiles(full_name)')
        .eq('category_id', categoryId)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
    return data || []
}

export default async function SubcategoryPage({ params }: PageProps) {
    const { slug, subcategory: subcategorySlug } = await params
    const subcategory = await getSubcategory(slug, subcategorySlug)

    if (!subcategory) return notFound()

    const content = await getContent(subcategory.id)

    return (
        <div className="container py-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted-foreground mb-8">
                <Link href="/" className="hover:text-foreground flex items-center">
                    <Home className="h-4 w-4 mr-1" /> Home
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <Link href="/categories" className="hover:text-foreground">
                    Categories
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <Link href={`/categories/${subcategory.parent.slug}`} className="hover:text-foreground">
                    {subcategory.parent.name}
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-foreground font-medium">{subcategory.name}</span>
            </nav>

            <h1 className="text-3xl font-bold tracking-tight mb-2">{subcategory.name}</h1>
            <p className="text-muted-foreground mb-8">Browse articles and judgments in {subcategory.name}.</p>

            <div className="grid gap-6">
                {content.length > 0 ? (
                    <div className="grid gap-4">
                        {content.map((item) => (
                            <ContentItem key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 border rounded-lg border-dashed text-center">
                        <h3 className="text-lg font-medium">No content found</h3>
                        <p className="text-muted-foreground mt-2">
                            There are no articles or judgments in this subcategory yet.
                        </p>
                    </div>
                )}
            </div>
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
                            <BagdeForType type={item.type} />
                            <span className="text-xs text-muted-foreground">
                                {item.published_at ? format(new Date(item.published_at), 'PPP') : ''}
                            </span>
                        </div>
                        {item.is_featured && <Badge variant="default" className="text-xs">Featured</Badge>}
                    </div>
                    <CardTitle className="text-lg text-blue-600 hover:underline hover:text-blue-800">
                        {item.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                        {item.summary || "Click to read more..."}
                    </CardDescription>
                    <div className="text-xs text-muted-foreground mt-2">
                        {item.profiles?.full_name && `By ${item.profiles.full_name}`}
                    </div>
                </CardHeader>
            </Link>
        </Card>
    )
}

function BagdeForType({ type }: { type: string }) {
    switch (type) {
        case 'judgment':
            return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Judgment</Badge>
        case 'order':
            return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Order</Badge>
        case 'case_summary':
            return <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">Summary</Badge>
        default:
            return <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">Article</Badge>
    }
}
