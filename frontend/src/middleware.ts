import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Assume if there is no token in cookies/localstorage (middleware can't read localstorage easily)
  // We'll rely on client-side check mostly given the JWT is stored in localStorage by default plan,
  // but for proper middleware support we should ideally store token in cookies or have a way to check.
  
  // Since we implemented localStorage storage for tokens in AuthContext, 
  // server-side middleware won't have access to it directly unless we sync to cookies.
  // For now, allow navigation and let the client-side AuthContext kick back to login if needed.
  // However, for better UX on initial load, we can skip strict middleware check 
  // OR we can update the login flow to set a cookie as well.
  
  // Given the complexity constraints, I will leave this pass-through for now 
  // and rely on Client Components to redirect.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/submit/:path*'],
};
