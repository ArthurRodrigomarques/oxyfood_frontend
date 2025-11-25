import { MenuManagement } from "@/components/admin/menu/menu-management";
import { Sidebar } from "@/components/admin/sidebar";

export default function AdminMenuPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <MenuManagement />
        </div>
      </main>
    </div>
  );
}
