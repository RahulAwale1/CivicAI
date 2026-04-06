"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { removeAdminToken } from "@/lib/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/cities", label: "Cities" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/jobs", label: "Jobs" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white p-4">
      <div className="mb-6 text-xl font-semibold">CivicAI Admin</div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm ${
                active
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => {
          removeAdminToken();
          window.location.href = "/admin/login";
        }}
        className="mt-8 rounded-lg border px-3 py-2 text-sm"
      >
        Logout
      </button>
    </aside>
  );
}