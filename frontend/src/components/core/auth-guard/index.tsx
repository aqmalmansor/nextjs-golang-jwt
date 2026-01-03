"use client"; // Client component for interactivity

import { useSession, signOut } from "next-auth/react";
import { FC, PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation"; // App Router import

export const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Handle refresh token failure
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (session?.error === "RefreshAccessTokenError") {
    return (
      <div className="text-center mt-8">
        Session expired. Redirecting to login...
      </div>
    );
  }

  return children;
};
