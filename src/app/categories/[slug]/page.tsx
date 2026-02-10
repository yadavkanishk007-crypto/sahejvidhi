import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Folder, FileText, Gavel, File, ChevronRight, Home } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface PageProps {
    params: Promise<{ slug: string }>
}

async function getCategory(slug: string) {
    const supabase = await createClient()

    // Try to find by slug first, then by ID (for robustness)
    let { data: category, error } = await supabase
        .from('categories')
        .select('*, parent:parent_id(*)')
        .eq('slug', slug)
        .single()

    if (error || !category) {
        // Fallback to check if slug is a valid uuid
        const { data: categoryById } = await supabase
            .from('categories')
            .select('*, parent:parent_id(*)')
            .eq('id', slug)
            .single()
        category = categoryById
    }

    return category
}

async function getSubcategories(categoryId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', categoryId)
        .order('name')
    return data || []
}

async function getCategoryContent(categoryId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('content')
        .select('*, profiles(full_name)')
        .eq('category_id', categoryId)
        .eq('status', 'published') // Assuming status field exists or use published_at
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })

    return data || []
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const category = await getCategory(slug)
    if (!category) return { title: 'Category Not Found' }
    return {
        title: `${category.name} - Sahej Vidhi`,
        description: `Browse laws, articles, and judgments related to ${category.name}.`,
    }
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params
    const category = await getCategory(slug)

    if (!category) {
        notFound()
    }

    const subcategories = await getSubcategories(category.id)

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
                <span className="text-foreground font-medium">{category.name}</span>
            </nav>

            <h1 className="text-4xl font-bold tracking-tight mb-8">{category.name}</h1>

            <div className="grid gap-8">
                {/* Subcategories */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Folder className="mr-2 h-5 w-5 text-blue-500" /> Subcategories
                    </h2>
                    {subcategories.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {subcategories.map((sub) => (
                                <Link key={sub.id} href={`/categories/${category.slug}/${sub.slug || sub.id}`}>
                                    <Card className="hover:bg-muted/50 transition-colors h-full">
                                        <CardHeader className="flex flex-row items-center space-y-0 p-4">
                                            <Folder className="mr-3 h-5 w-5 text-blue-500 fill-blue-500/20" />
                                            <div className="flex-1 font-medium">{sub.name}</div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 border rounded-lg border-dashed text-center">
                            <h3 className="text-lg font-medium">No subcategories found</h3>
                            <p className="text-muted-foreground mt-2">
                                There are currently no subcategories in {category.name}.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

function ContentItem({ item }: { item: any }) {
    const Icon = item.type === 'judgment' || item.type === 'order' ? Gavel : FileText

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
