import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Folder, ChevronRight } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
    title: "Browse Categories - Sahej Vidhi",
    description: "Explore legal categories and topics.",
}

export default async function CategoriesPage() {
    const supabase = await createClient()
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('name')

    return (
        <div className="container py-10">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Browse Law</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories?.map((category) => (
                    <Link key={category.id} href={`/categories/${category.slug || category.id}`}>
                        <Card className="hover:bg-muted/50 transition-colors">
                            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                                <Folder className="mr-4 h-8 w-8 text-blue-500 fill-blue-500/20" />
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{category.name}</CardTitle>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
                {(!categories || categories.length === 0) && (
                    <div className="col-span-full text-center text-muted-foreground py-12 border rounded-lg border-dashed">
                        No categories found.
                    </div>
                )}
            </div>
        </div>
    )
}
