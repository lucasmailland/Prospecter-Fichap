import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
    accessToken?: string
    provider?: string
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }

  interface JWT {
    role?: string
    accessToken?: string
    provider?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    accessToken?: string
    provider?: string
  }
} 