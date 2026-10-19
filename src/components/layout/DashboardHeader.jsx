import { Bell, CircleHelp, Search, UserRound, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardHeader({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Server logout failed; local session was cleared.", error);
    } finally {
      setLoggingOut(false);
    }
  }
  return (
    <header className="flex h-[48px] shrink-0 items-center justify-between border-b border-[#ddd] bg-white px-4">
      <div className="flex min-w-0 items-center gap-5">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="whitespace-nowrap text-[18px] font-extrabold tracking-tight text-black">
          Nexus POS
        </h1>

        <div className="hidden h-[30px] w-[185px] items-center border border-[#ddd] px-2 sm:flex">
          <Search className="mr-2 h-3.5 w-3.5 text-[#555]" />
          <Input
            placeholder="Search..."
            aria-label="Search"
            className="h-full border-0 bg-transparent px-0 text-[11px] shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden h-8 w-8 sm:inline-flex"
          aria-label="Help"
        >
          <CircleHelp className="h-4 w-4" />
        </Button>

        <div className="mx-1 hidden h-6 w-px bg-[#ddd] sm:block" />

        <Avatar className="h-6 w-6">
          <AvatarFallback className="bg-[#ddd]">
            <UserRound className="h-4 w-4 text-black" />
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          disabled={loggingOut}
          title={`Sign out ${user?.username || ""}`}
          className="text-[10px] font-medium tracking-wide text-[#444] hover:text-black"
          onClick={handleLogout}
        >
          {loggingOut ? "SIGNING OUT..." : "LOGOUT"}
        </button>
      </div>
    </header>
  );
}
