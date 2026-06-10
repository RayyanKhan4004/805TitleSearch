"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import Icon from "./icon";

interface NavbarProps {
  onDashboardClick?: () => void;
}

export default function Navbar({ onDashboardClick }: NavbarProps) {
  const { logout, user } = useAuth();
  const router = useRouter();

  return (
    <header
      className="bg-header flex items-center gap-2.5 px-4 h-[42px] shrink-0 z-10"
      style={{ boxShadow: "var(--shadow-header)" }}
    >
      <div className="flex items-center gap-1.5 mr-2">
        <Icon name="building" size={15} style={{ color: "var(--logo-accent)" }} />
        <div>
          <div className="text-header-text text-[12px] font-extrabold tracking-wide">
            805Title
          </div>
          <div className="text-[var(--logo-accent)] text-[8px] tracking-[0.18em] font-bold">
            SEARCH
          </div>
        </div>
      </div>
      {[
        { label: "Dashboard", onClick: onDashboardClick },
        { label: "Code Book", onClick: () => router.push("/code-book") },
      ].map(({ label, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="border-none text-[11px] font-medium px-2 py-1 rounded-[5px] cursor-pointer bg-transparent text-sidebar-icon hover:text-header-text transition-colors"
        >
          {label}
        </button>
      ))}
      <div className="flex-1 mx-2">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-header-muted flex">
            <Icon name="search" size={12} />
          </span>
          <input
            placeholder="Quick Search (APN, Address, Order, Instrument…)"
            className="w-full pl-7.5 pr-2.5 py-1.25 rounded-md text-[11px] outline-none box-border"
            style={{
              background: "var(--header-search-bg)",
              border: "1px solid var(--header-search-border)",
              color: "var(--header-search-text)",
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="relative cursor-pointer text-sidebar-icon">
          <Icon name="bell" size={15} />
          <span className="absolute -top-1 -right-1 bg-[var(--ui-notification-bg)] text-[var(--ui-notification-text)] text-[8px] font-bold w-3.25 h-3.25 rounded-full flex items-center justify-center">
            0
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          <div className="w-6.5 h-6.5 rounded-full bg-[var(--ui-avatar-bg)] flex items-center justify-center text-[var(--ui-avatar-text)] text-[10px] font-bold">
            {user
              ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
              : "U"}
          </div>
          <div>
            <div className="text-header-text text-[11px] font-semibold">
              {user ? `${user.firstName} ${user.lastName}` : "User"}
            </div>
            <div className="text-header-muted text-[9px]">Online</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="bg-transparent border-none text-sidebar-icon hover:text-header-text cursor-pointer transition-colors p-1"
          title="Sign out"
        >
          <Icon name="arrowRight" size={14} />
        </button>
      </div>
    </header>
  );
}
