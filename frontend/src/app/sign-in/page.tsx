import { LoginForm } from "@/components/pages/sign-in";

export const metadata = {
  title: "Login - My App",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Sign In</h2>
        <LoginForm />
      </div>
    </div>
  );
}
