import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect users to login page
  },
});

export function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log('Middleware running on path:', pathname);
  console.log('Cookies:', request.cookies.toString());
  
  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/signup'];
  const isPublicPath = publicPaths.includes(pathname);

  const token = request.cookies.get('token')?.value || '';

  // Redirect to login if accessing protected route without token
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if user is already logged in and trying to access public routes
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure matcher for middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
