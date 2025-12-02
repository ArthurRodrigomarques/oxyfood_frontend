import { RegisterForm } from "@/components/register/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-orange-50 via-white to-emerald-50 p-4">
      <div className="w-full max-w-[400px]">
        <RegisterForm />
      </div>
    </div>
  );
}
