import { SidebarContent } from "./sidebar-content";

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 border-r min-h-screen flex-col shadow-sm z-20 relative bg-white">
      <SidebarContent />
    </aside>
  );
}
