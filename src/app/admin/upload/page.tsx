"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// ... (imports remain the same)
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, FileText, CheckCircle, Database } from "lucide-react"

// duplicate data for seeding
const DEFAULT_COURTS = [
    { name: "Supreme Court of India", slug: "supreme-court-of-india" },
    { name: "Allahabad High Court", slug: "allahabad-high-court" },
    { name: "Andhra Pradesh High Court", slug: "andhra-pradesh-high-court" },
    { name: "Bombay High Court", slug: "bombay-high-court" },
    { name: "Calcutta High Court", slug: "calcutta-high-court" },
    { name: "Chhattisgarh High Court", slug: "chhattisgarh-high-court" },
    { name: "Delhi High Court", slug: "delhi-high-court" },
    { name: "Gauhati High Court", slug: "gauhati-high-court" },
    { name: "Gujarat High Court", slug: "gujarat-high-court" },
    { name: "Himachal Pradesh High Court", slug: "himachal-pradesh-high-court" },
    { name: "Jammu & Kashmir High Court", slug: "jammu-kashmir-high-court" },
    { name: "Jharkhand High Court", slug: "jharkhand-high-court" },
    { name: "Karnataka High Court", slug: "karnataka-high-court" },
    { name: "Kerala High Court", slug: "kerala-high-court" },
    { name: "Madhya Pradesh High Court", slug: "madhya-pradesh-high-court" },
    { name: "Madras High Court", slug: "madras-high-court" },
    { name: "Manipur High Court", slug: "manipur-high-court" },
    { name: "Meghalaya High Court", slug: "meghalaya-high-court" },
    { name: "Orissa High Court", slug: "orissa-high-court" },
    { name: "Patna High Court", slug: "patna-high-court" },
    { name: "Punjab and Haryana High Court", slug: "punjab-haryana-high-court" },
    { name: "Rajasthan High Court", slug: "rajasthan-high-court" },
    { name: "Sikkim High Court", slug: "sikkim-high-court" },
    { name: "Telangana High Court", slug: "telangana-high-court" },
    { name: "Tripura High Court", slug: "tripura-high-court" },
    { name: "Uttarakhand High Court", slug: "uttarakhand-high-court" },
]

export default function UploadPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [title, setTitle] = useState("")
    const [contentType, setContentType] = useState("article") // article, judgment, order
    const [categoryId, setCategoryId] = useState("")
    const [subCategoryId, setSubCategoryId] = useState("")
    const [courtId, setCourtId] = useState("")
    const [body, setBody] = useState("")
    const [summary, setSummary] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [isFeatured, setIsFeatured] = useState(false)

    // Dynamic Subcategory State
    const [isCreatingSubcategory, setIsCreatingSubcategory] = useState(false)
    const [newSubcategoryName, setNewSubcategoryName] = useState("")

    // Dynamic Court State
    const [isCreatingCourt, setIsCreatingCourt] = useState(false)
    const [newCourtName, setNewCourtName] = useState("")
    const [seeding, setSeeding] = useState(false)

    // Data
    const [categories, setCategories] = useState<any[]>([])
    const [courts, setCourts] = useState<any[]>([])

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        fetchData()
    }, [])

    const [userDebug, setUserDebug] = useState<any>(null)

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUserDebug(user)
        const { data: catData } = await supabase.from('categories').select('*').order('name')
        const { data: courtData } = await supabase.from('courts').select('*').order('name')
        if (catData) setCategories(catData)
        if (courtData) setCourts(courtData)
    }

    const handleSeedCourts = async () => {
        setSeeding(true)
        try {
            const { data: existingCourts } = await supabase.from('courts').select('name')
            const existingNames = new Set(existingCourts?.map(c => c.name) || [])

            const toInsert = DEFAULT_COURTS
                .filter(c => !existingNames.has(c.name))
                .map(c => ({ name: c.name })) // Only insert name, DB might auto-generate ID, slug not in schema

            if (toInsert.length === 0) {
                setSuccess("All default courts already exist.")
                setTimeout(() => setSuccess(null), 3000)
                return
            }

            const { error } = await supabase.from('courts').insert(toInsert)
            if (error) throw error

            setSuccess(`Successfully added ${toInsert.length} courts.`)
            fetchData()
        } catch (err: any) {
            setError("Failed to seed courts: " + err.message)
        } finally {
            setSeeding(false)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const user = (await supabase.auth.getUser()).data.user
            if (!user) throw new Error("Not authenticated")

            let finalSubCategoryId = subCategoryId
            let finalCourtId = courtId

            console.log("Current User Metadata:", user.user_metadata) // DEBUG: Check if role is admin

            // Create new subcategory if requested
            if (isCreatingSubcategory && newSubcategoryName && categoryId) {
                const slug = newSubcategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                const { data: newCat, error: catError } = await supabase
                    .from('categories')
                    .insert({
                        name: newSubcategoryName,
                        slug: slug,
                        parent_id: categoryId
                    })
                    .select()
                    .single()

                if (catError) throw catError
                finalSubCategoryId = newCat.id
            }

            // Create new court if requested
            if (isCreatingCourt && newCourtName) {
                // Remove slug generation for DB as column likely missing
                const { data: newCourt, error: courtError } = await supabase
                    .from('courts')
                    .insert({
                        name: newCourtName
                    })
                    .select()
                    .single()

                if (courtError) throw courtError
                finalCourtId = newCourt.id
            }

            // Refresh data if we created anything new
            if (isCreatingSubcategory || isCreatingCourt) {
                fetchData()
            }

            let pdfUrl = null

            if (file) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${contentType}s/${fileName}`

                const { error: uploadError, data } = await supabase.storage
                    .from('documents')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('documents')
                    .getPublicUrl(filePath)

                pdfUrl = publicUrl
            }

            // Create Content Record
            const { error: insertError } = await supabase
                .from('content')
                .insert({
                    title,
                    type: contentType,
                    category_id: finalSubCategoryId || categoryId || null,
                    court_id: finalCourtId || null,
                    body,
                    summary,
                    pdf_url: pdfUrl,
                    is_featured: isFeatured,
                    created_by: user.id,
                    status: 'published',
                    published_at: new Date().toISOString(),
                    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)
                })

            if (insertError) throw insertError

            setSuccess("Content published successfully!")
            // Reset form
            setTitle("")
            setBody("")
            setFile(null)
            setNewSubcategoryName("")
            setNewCourtName("")
            setIsCreatingSubcategory(false)
            setIsCreatingCourt(false)
            setCourtId("")
        } catch (err: any) {
            setError(err.message || "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const parentCategories = categories.filter(c => !c.parent_id)

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create Content</h1>

            {userDebug && (
                <Alert className="mb-4 bg-yellow-50 border-yellow-200 text-yellow-800 text-xs">
                    <AlertTitle>Debug Info</AlertTitle>
                    <AlertDescription>
                        User: {userDebug.email} | Role: {userDebug.user_metadata?.role || 'None'} | ID: {userDebug.id}
                    </AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="write" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="write" onClick={() => setContentType('article')}>Write Article</TabsTrigger>
                    <TabsTrigger value="upload" onClick={() => setContentType('judgment')}>Upload Document (Judgment/Order)</TabsTrigger>
                </TabsList>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Content Details</CardTitle>
                        <CardDescription>Fill in the metadata for your content.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Enter title..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={categoryId} onValueChange={setCategoryId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {parentCategories.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <Label>Subcategory (Optional)</Label>
                                        {categoryId && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs text-blue-600"
                                                onClick={() => setIsCreatingSubcategory(!isCreatingSubcategory)}
                                            >
                                                {isCreatingSubcategory ? "Select Existing" : "Add New +"}
                                            </Button>
                                        )}
                                    </div>

                                    {isCreatingSubcategory ? (
                                        <Input
                                            placeholder="Enter subcategory name"
                                            value={newSubcategoryName}
                                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                                            required={isCreatingSubcategory}
                                            className="border-blue-300 focus-visible:ring-blue-400"
                                        />
                                    ) : (
                                        <Select value={subCategoryId} onValueChange={setSubCategoryId} disabled={!categoryId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Subcategory" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.filter(c => c.parent_id === categoryId).map(c => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <Label>Court (Optional)</Label>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button" // Important type="button" to prevent submit
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs text-green-600 px-2"
                                                onClick={handleSeedCourts}
                                                disabled={seeding}
                                                title="Populate standard High Courts"
                                            >
                                                {seeding ? <Loader2 className="h-3 w-3 animate-spin" /> : <Database className="h-3 w-3" />}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs text-blue-600"
                                                onClick={() => setIsCreatingCourt(!isCreatingCourt)}
                                            >
                                                {isCreatingCourt ? "Select Existing" : "Add New +"}
                                            </Button>
                                        </div>
                                    </div>

                                    {isCreatingCourt ? (
                                        <Input
                                            placeholder="Enter court name (e.g. Pune District Court)"
                                            value={newCourtName}
                                            onChange={(e) => setNewCourtName(e.target.value)}
                                            required={isCreatingCourt}
                                            className="border-blue-300 focus-visible:ring-blue-400"
                                        />
                                    ) : (
                                        <Select value={courtId} onValueChange={setCourtId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Court" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courts.map(c => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Content Type</Label>
                                    <Select value={contentType} onValueChange={setContentType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="article">Article</SelectItem>
                                            <SelectItem value="judgment">Judgment</SelectItem>
                                            <SelectItem value="order">Order</SelectItem>
                                            <SelectItem value="case_summary">Case Summary</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Summary (SEO)</Label>
                                <Textarea
                                    value={summary}
                                    onChange={e => setSummary(e.target.value)}
                                    placeholder="Brief summary..."
                                    className="h-20"
                                />
                            </div>

                            <TabsContent value="write" className="space-y-4 mt-0">
                                <div className="space-y-2">
                                    <Label>Body Content</Label>
                                    <div className="bg-background text-foreground">
                                        <Textarea
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            className="h-64 mb-4"
                                            placeholder="Write content here..."
                                        />
                                        <p className="text-xs text-muted-foreground">Basic HTML supported. Rich text editor temporarily disabled.</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-8">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={isFeatured}
                                        onChange={e => setIsFeatured(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="featured">Feature this article on Homepage</Label>
                                </div>
                            </TabsContent>

                            <TabsContent value="upload" className="space-y-4 mt-0">
                                <div className="space-y-2">
                                    <Label>Upload PDF</Label>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={e => setFile(e.target.files?.[0] || null)}
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Upload judgment or order copy.</p>
                                </div>
                            </TabsContent>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Publishing..." : "Publish Content"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    )
}
