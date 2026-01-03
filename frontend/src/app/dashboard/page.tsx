import { AuthGuard } from "@/components/core";
import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <div className="mb-6">
            <p className="text-gray-600">
              Welcome back, <strong>{session?.user?.name}</strong>!
            </p>
            <p className="text-sm text-gray-500">Role: {session?.user?.role}</p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
