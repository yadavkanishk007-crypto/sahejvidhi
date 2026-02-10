import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (
        !user &&
        request.nextUrl.pathname.startsWith('/admin') &&
        !request.nextUrl.pathname.startsWith('/admin/login')
    ) {
        // no user, potentially respond by redirecting the user to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
    }

    // Check for admin role if user exists and trying to access admin area
    if (user && request.nextUrl.pathname.startsWith('/admin')) {
        // Fetch profile to check role
        // Note: This adds a DB call to middleware which might be expensive. 
        // Better to use Custom Claims in JWT, but for now we'll query the profile or metadata.
        // Using metadata is faster if we sync it.
        // The user requirement says: "Assign admin role through Supabase user metadata."

        const role = user.user_metadata.role;
        if (role !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/' // Redirect unauthorized users to home
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
