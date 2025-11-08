import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Fixed width on desktop, hidden on mobile */}
      <div className="hidden md:flex md:w-64 md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar - Handled by Sidebar component itself */}
      <div className="md:hidden">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Content Area - Full width on desktop, adjusted on mobile */}
        <div className="flex-1 overflow-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
