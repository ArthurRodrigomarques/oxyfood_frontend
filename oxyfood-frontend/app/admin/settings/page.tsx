import { SettingsView } from "@/components/admin/settings/settings-view";
import { Sidebar } from "@/components/admin/sidebar";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          <SettingsView />
        </div>
      </main>
    </div>
  );
}
