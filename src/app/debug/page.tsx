import { createClient } from "@/lib/supabase/server"

export default async function DebugPage() {
    const supabase = await createClient()

    // 1. Test Categories Join
    const { data: catJoin, error: catError } = await supabase
        .from('content')
        .select('id, categories(name)')
        .limit(1)

    // 2. Test Courts Join
    const { data: courtJoin, error: courtError } = await supabase
        .from('content')
        .select('id, courts(name)')
        .limit(1)

    return (
        <div className="p-10 space-y-8">
            <h1 className="text-2xl font-bold">FK Relationship Debug</h1>

            <section className="p-4 border rounded">
                <h2 className="font-bold mb-2">Categories Join Test</h2>
                {catError ? (
                    <div className="text-red-500 font-bold">Error: {catError.message}</div>
                ) : (
                    <div className="text-green-600">
                        Success! <br />
                        <pre className="text-xs text-black mt-2">{JSON.stringify(catJoin, null, 2)}</pre>
                    </div>
                )}
            </section>

            <section className="p-4 border rounded">
                <h2 className="font-bold mb-2">Courts Join Test</h2>
                {courtError ? (
                    <div className="text-red-500 font-bold">Error: {courtError.message}</div>
                ) : (
                    <div className="text-green-600">
                        Success! <br />
                        <pre className="text-xs text-black mt-2">{JSON.stringify(courtJoin, null, 2)}</pre>
                    </div>
                )}
            </section>
        </div>
    )
}
