import { ReportsView } from "@/components/admin/reports/reports-view";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";

export default function ReportsPage() {
  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Header Mobile */}
      <div className="md:hidden bg-white border-b p-4 flex items-center gap-3 shrink-0">
        <MobileSidebar />
        <span className="font-bold text-lg text-gray-800">Relatórios</span>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <ReportsView />
        </div>
      </div>
    </main>
  );
}
