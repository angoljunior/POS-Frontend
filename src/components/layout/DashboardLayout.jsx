import { useState } from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "./AppSidebar";
import DashboardHeader from "./DashboardHeader";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen border-t-[6px] border-[#6854ed] bg-white">
      <div className="flex h-[calc(100vh-6px)] overflow-hidden">
        <div className="hidden lg:block">
          <AppSidebar />
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-[180px] border-r-0 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <AppSidebar onNavigate={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />

          <main className="min-h-0 flex-1 overflow-y-auto bg-white p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
