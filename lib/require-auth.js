// lib/require-auth.js

import { auth } from 'next-auth'; // ✅ App Router-compatible

export async function requireAuth() {
  const session = await auth(); // no need for `req`

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}
