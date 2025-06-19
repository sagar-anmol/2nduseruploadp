// middleware.js

import NextAuth from 'next-auth';
import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // ❌ Skip /api/auth/* (needed for next-auth to work)
  if (pathname.startsWith('/api/auth')) {
    return;
  }

  // 🔐 Redirect unauthenticated users
  if (!req.auth) {
    const url = req.url.replace(req.nextUrl.pathname, '/');
    return Response.redirect(url);
  }
});

// ✅ Only apply middleware to these paths
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
