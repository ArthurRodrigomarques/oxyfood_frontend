import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-orange-50 via-white to-emerald-50 p-4">
      <div className="w-full max-w-[400px]">
        <LoginForm />
      </div>
    </div>
  );
}
