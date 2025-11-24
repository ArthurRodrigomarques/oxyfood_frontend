import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    // Fundo com gradiente suave (Laranja pálido -> Branco -> Verde pálido)
    // Isso imita o visual clean e moderno da sua referência
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-orange-50 via-white to-emerald-50 p-4">
      {/* Container centralizado com largura máxima */}
      <div className="w-full max-w-[400px]">
        <LoginForm />
      </div>
    </div>
  );
}
