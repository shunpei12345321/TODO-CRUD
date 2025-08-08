import { updateSession } from "@/utils/supabase/middleware"

export async function middleware(request: any) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * 以下で始まるリクエストパス以外のすべてにマッチ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, signup (認証ページ)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup|auth).*)",
  ],
}
