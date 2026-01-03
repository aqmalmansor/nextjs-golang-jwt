import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken || token.refreshToken,
      accessTokenExpires: Date.now() + refreshedTokens.expiresIn * 1000,
    };
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// Authenticate user with your external API
async function authenticateUser(email: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return null;
    }

    // Your API should return:
    // {
    //   user: { id, name, email, role },
    //   accessToken: "jwt-token",
    //   refreshToken: "refresh-token",
    //   expiresIn: 3600
    // }
    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const authResult = await authenticateUser(
          credentials.email.toString(),
          credentials.password.toString()
        );

        if (!authResult) return null;

        return {
          id: authResult.user.id,
          name: authResult.user.name,
          email: authResult.user.email,
          role: authResult.user.role,
          accessToken: authResult.accessToken,
          refreshToken: authResult.refreshToken,
          accessTokenExpires: Date.now() + authResult.expiresIn * 1000,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      // Initial sign-in
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
        };
      }

      // Token hasn't expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Token expired, refresh it
      return await refreshAccessToken(token);
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      // Send properties to client
      session.user.id = token.id;
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// App Router requires explicit exports
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
