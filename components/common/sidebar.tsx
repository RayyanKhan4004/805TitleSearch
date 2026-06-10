"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import Icon from "./icon";

const NAV_ITEMS = [
  { name: "dashboard", label: "Dashboard", path: "/table" },
  { name: "file", label: "Code Book", path: "/code-book" },
  { name: "settings", label: "Admin", path: "/profile" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className="w-[52px] shrink-0 bg-header flex flex-col items-center py-3 px-1.5 gap-1 z-20"
      style={{ boxShadow: "var(--shadow-sidebar)" }}
    >
      <div className="w-9 h-9 bg-brand rounded-[10px] flex items-center justify-center mb-2.5">
        <Icon name="building" size={17} className="text-header-text" />
      </div>
      {NAV_ITEMS.map(({ name, label, path }) => {
        const active = pathname === path;
        return (
          <div
            key={name}
            title={label}
            onClick={() => router.push(path)}
            className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-[background] duration-150"
            style={{
              background: active ? "var(--brand-primary)" : "transparent",
              color: active ? "var(--sidebar-icon-active)" : "var(--sidebar-icon)",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = "var(--sidebar-hover)";
                e.currentTarget.style.color = "var(--sidebar-icon-active)";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--sidebar-icon)";
              }
            }}
          >
            <Icon name={name} size={16} />
          </div>
        );
      })}
      <div className="flex-1" />
      <Icon
        name="help"
        size={16}
        className="text-header-muted cursor-pointer mb-1.5"
      />
      <div
        onClick={() => router.push("/profile")}
        className="w-7 h-7 rounded-full bg-ui-avatar flex items-center justify-center text-ui-avatar-text text-[10px] font-bold cursor-pointer"
      >
        {user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U" : "U"}
      </div>
    </aside>
  );
}
