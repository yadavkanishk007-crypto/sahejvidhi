import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Analytics placeholders - fetching real counts
    const { count: articleCount } = await supabase.from('content').select('*', { count: 'exact', head: true }).eq('type', 'article')
    const { count: judgmentCount } = await supabase.from('content').select('*', { count: 'exact', head: true }).eq('type', 'judgment')
    const { count: orderCount } = await supabase.from('content').select('*', { count: 'exact', head: true }).eq('type', 'order')

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{articleCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Judgments Uploaded</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{judgmentCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Court Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderCount || 0}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
