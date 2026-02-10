import { createClient } from "@/lib/supabase/server"

export default async function DebugSlugPage() {
    const supabase = await createClient()
    const targetSlug = "defesr3gw4t-5713"

    // 1. Fetch by Slug (Simulate Article Page)
    const { data: bySlug, error: slugError } = await supabase
        .from('content')
        .select('*, profiles(full_name), categories(name, slug, id), courts(name)')
        .eq('slug', targetSlug)
        .single()

    // 2. Fetch by ID (Falback check)
    // We need the ID of that article first, let's just search by title "defesr3gw4t" to find it
    const { data: byTitle } = await supabase
        .from('content')
        .select('id, title, slug')
        .eq('title', 'defesr3gw4t')
        .single()

    return (
        <div className="p-10 space-y-8">
            <h1 className="text-2xl font-bold">Slug Debug: {targetSlug}</h1>

            <section className="p-4 border rounded">
                <h2 className="font-bold mb-2">1. Main Query Result</h2>
                {slugError ? (
                    <div className="text-red-500 font-bold">Error: {slugError.message}</div>
                ) : (
                    <div className="text-green-600">
                        Success! <br />
                        <pre className="text-xs text-black mt-2 bg-gray-100 p-2">{JSON.stringify(bySlug, null, 2)}</pre>
                    </div>
                )}
            </section>

            <section className="p-4 border rounded">
                <h2 className="font-bold mb-2">2. Article Details (from Title Search)</h2>
                <pre className="text-xs text-black mt-2 bg-gray-100 p-2">{JSON.stringify(byTitle, null, 2)}</pre>
            </section>
        </div>
    )
}
