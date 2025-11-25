import { ReportsView } from "@/components/admin/reports/reports-view";
import { Sidebar } from "@/components/admin/sidebar";

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          <ReportsView />
        </div>
      </main>
    </div>
  );
}
