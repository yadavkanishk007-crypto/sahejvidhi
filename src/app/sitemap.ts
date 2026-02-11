import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()
    const { data: content } = await supabase.from('content').select('slug, updated_at, id')
    const { data: categories } = await supabase.from('categories').select('slug, id')

    const baseUrl = 'https://www.sahejvidhi.in' // Update with actual domain

    const contentEntries = content?.map((item) => ({
        url: `${baseUrl}/articles/${item.slug || item.id}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    })) || []

    const categoryEntries = categories?.map((item) => ({
        url: `${baseUrl}/categories/${item.slug || item.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    })) || []

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/courts`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        ...categoryEntries,
        ...contentEntries,
    ]
}
