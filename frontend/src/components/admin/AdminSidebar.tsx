"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { removeAdminToken } from "@/lib/auth";
import ThemeToggle from "@/components/common/ThemeToggle";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/cities", label: "Cities" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/jobs", label: "Jobs" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
        CivicAI Admin
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm ${
                active
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <ThemeToggle />
      </div>

      <button
        onClick={() => {
          removeAdminToken();
          window.location.href = "/admin/login";
        }}
        className="mt-4 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        Logout
      </button>
    </aside>
  );
}