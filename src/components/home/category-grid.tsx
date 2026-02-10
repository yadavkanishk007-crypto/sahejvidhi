import Link from "next/link"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Book, Gavel, Scale, Briefcase, Users, Building, FileText, Laptop, Leaf, Home } from "lucide-react"

// Map specific categories to icons
const iconMap: Record<string, any> = {
    "Criminal Law": Gavel,
    "Civil Law": Scale,
    "Constitutional Law": Book,
    "Corporate Law": Building,
    "Family Law": Users,
    "Labour Law": Briefcase,
    "Taxation Law": FileText,
    "Cyber Law": Laptop,
    "Environmental Law": Leaf,
    "Property Law": Home,
}

const STATIC_CATEGORIES = [
    { name: "Civil Law", slug: "civil-law" },
    { name: "Constitutional Law", slug: "constitutional-law" },
    { name: "Corporate Law", slug: "corporate-law" },
    { name: "Criminal Law", slug: "criminal-law" },
    { name: "Cyber Law", slug: "cyber-law" },
    { name: "Environmental Law", slug: "environmental-law" },
    { name: "Family Law", slug: "family-law" },
    { name: "Labour Law", slug: "labour-law" },
    { name: "Property Law", slug: "property-law" },
    { name: "Taxation Law", slug: "taxation-law" },
]

export async function CategoryGrid() {
    const supabase = await createClient()
    const { data: dbCategories } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('name')

    // Use DB categories if available, otherwise fallback to static list for display
    const categories = (dbCategories && dbCategories.length > 0) ? dbCategories : STATIC_CATEGORIES

    return (
        <section className="container px-4 md:px-6 py-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {categories.map((category: any) => {
                    const Icon = iconMap[category.name] || Scale
                    // Handle both DB object (id) and Static object (slug)
                    const href = category.id ? `/categories/${category.slug || category.id}` : `/categories/${category.slug}`

                    return (
                        <Link key={category.name} href={href} className="hover:no-underline">
                            <Card className="h-full transition-all hover:bg-muted/50 hover:shadow-md hover:border-[#d97706]/50 group">
                                <CardHeader className="flex flex-col items-center text-center space-y-4 p-6">
                                    <div className="p-3 bg-primary/5 rounded-full group-hover:bg-[#d97706]/10 transition-colors">
                                        <Icon className="h-8 w-8 text-primary group-hover:text-[#d97706] transition-colors" />
                                    </div>
                                    <CardTitle className="text-base font-medium group-hover:text-[#d97706] transition-colors">{category.name}</CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
