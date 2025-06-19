import { NextAuthConfig } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      async authorize(credentials) {
        const allowedEmail = 'admin@admin.com'

        if (credentials?.email === allowedEmail) {
          return {
            id: '1',
            name: 'Admin',
            email: allowedEmail
          }
        }

        // Returning null = show error to user
        return null
      }
    })
  ],
  pages: {
    signIn: '/' // Sign-in page path
  },
  trustHost: true
} satisfies NextAuthConfig

export default authConfig
