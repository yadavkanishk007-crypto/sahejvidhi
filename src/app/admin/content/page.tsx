"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Trash2, Edit, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function ManageContentPage() {
    const [content, setContent] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('content')
            .select(`
                *,
                categories (name)
            `)
            .neq('status', 'deleted')
            .order('created_at', { ascending: false })

        if (data) setContent(data)
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        setDeleting(id)
        try {
            // 1. Soft Delete: Update status to 'deleted'
            const { error: dbError } = await supabase
                .from('content')
                .update({ status: 'deleted' })
                .eq('id', id)

            if (dbError) throw dbError

            // Update local state
            setContent(prev => prev.filter(item => item.id !== id))
        } catch (error) {
            console.error("Error deleting content:", error)
            alert("Failed to delete content")
        } finally {
            setDeleting(null)
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'article': return 'default'
            case 'judgment': return 'destructive'
            case 'order': return 'secondary'
            default: return 'outline'
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Manage Content</h1>
                <Link href="/admin/upload">
                    <Button>Add New Content</Button>
                </Link>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {content.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No content found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            content.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium max-w-[300px]">
                                        <div className="truncate" title={item.title}>{item.title}</div>
                                        <div className="text-xs text-muted-foreground truncate">{item.slug}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getTypeColor(item.type) as any}>{item.type}</Badge>
                                    </TableCell>
                                    <TableCell>{item.categories?.name || '-'}</TableCell>
                                    <TableCell>{item.author_name || '-'}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/articles/${item.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" title="View">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                        {deleting === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete "{item.title}" from the database.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive hover:bg-destructive/90">
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
