"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, Trash2, Plus, RefreshCw } from "lucide-react"

export default function ManageCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)

    // Form State
    const [newName, setNewName] = useState("")
    const [newSlug, setNewSlug] = useState("")
    const [parentId, setParentId] = useState<string>("none")

    const supabase = createClient()

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name')

        if (data) setCategories(data)
        setLoading(false)
    }

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        setNewName(name)
        setNewSlug(generateSlug(name))
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreateLoading(true)
        try {
            const { data, error } = await supabase
                .from('categories')
                .insert({
                    name: newName,
                    slug: newSlug,
                    parent_id: parentId === "none" ? null : parentId
                })
                .select()
                .single()

            if (error) throw error

            setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
            setIsCreateOpen(false)
            // Reset form
            setNewName("")
            setNewSlug("")
            setParentId("none")
        } catch (error: any) {
            console.error("Error creating category:", error)
            alert("Failed to create category: " + error.message)
        } finally {
            setCreateLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        setDeleting(id)
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id)

            if (error) throw error

            setCategories(prev => prev.filter(c => c.id !== id))
        } catch (error: any) {
            console.error("Error deleting category:", error)
            alert("Failed to delete category. Ensure it has no content linked to it.")
        } finally {
            setDeleting(null)
        }
    }

    // Helper to get parent name
    const getParentName = (pid: string | null) => {
        if (!pid) return "-"
        const parent = categories.find(c => c.id === pid)
        return parent ? parent.name : "Unknown Parent"
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    // Filter parent options to avoid circular references (simple: don't select self as parent) 
    // For deep circular checks, efficient graph traversal is needed, but for now simple check is enough.
    // Also we usually only want top-level parents for now based on current app structure (depth 1), 
    // but the DB supports hierarchy.
    const potentialParents = categories.filter(c => !c.parent_id)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Manage Categories</h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                            <DialogDescription>
                                Create a new category for organizing content.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Category Name</Label>
                                <Input
                                    value={newName}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Criminal Law"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input
                                    value={newSlug}
                                    onChange={e => setNewSlug(e.target.value)}
                                    placeholder="e.g. criminal-law"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Parent Category</Label>
                                <Select value={parentId} onValueChange={setParentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Parent (Optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None (Top Level)</SelectItem>
                                        {categories.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createLoading}>
                                    {createLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Category
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Parent Category</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                                <TableCell>{getParentName(category.parent_id)}</TableCell>
                                <TableCell className="text-right">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                {deleting === category.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete "{category.name}"? This action cannot be undone.
                                                    If this category contains subcategories or content, deletion might fail.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(category.id)} className="bg-destructive hover:bg-destructive/90">
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
