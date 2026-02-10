import { createClient } from "@/lib/supabase/server"

export default async function DebugCategoryPage() {
    const supabase = await createClient()

    // 1. Get the category details for the ID found in the content
    const targetCategoryId = "996c48af-fba9-4937-a817-920c8380d6c9"

    const { data: category, error } = await supabase
        .from('categories')
        .select('*, parent:parent_id(*)') // Get parent details too if possible, or just join
        .eq('id', targetCategoryId)
        .single()

    // 2. Get ALL categories to map the hierarchy manually if needed
    const { data: allCategories } = await supabase
        .from('categories')
        .select('*')

    return (
        <div className="p-10 space-y-8">
            <h1 className="text-2xl font-bold">Category Debug</h1>

            <section className="p-4 border rounded">
                <h2 className="font-bold mb-2">Target Category Details (ID: {targetCategoryId})</h2>
                {error ? (
                    <div className="text-red-500">Error: {error.message}</div>
                ) : (
                    <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                        {JSON.stringify(category, null, 2)}
                    </pre>
                )}
            </section>

            <section className="p-4 border rounded">
                <h2 className="font-bold mb-2">All Categories</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-xs">
                    {JSON.stringify(allCategories, null, 2)}
                </pre>
            </section>
        </div>
    )
}
