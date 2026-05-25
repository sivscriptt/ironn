"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

type Tab = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const TABS: Tab[] = [
  {
    href: "/",
    label: "Today",
    icon: (
      <Icon>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </Icon>
    ),
  },
  {
    href: "/train",
    label: "Train",
    icon: (
      <Icon>
        <path d="M6.5 6.5 17.5 17.5" />
        <path d="M21 21l-1-1" />
        <path d="M3 3l1 1" />
        <path d="M18 22 22 18" />
        <path d="M2 6 6 2" />
        <path d="M3 10l7-7" />
        <path d="M14 21l7-7" />
      </Icon>
    ),
  },
  {
    href: "/eat",
    label: "Eat",
    icon: (
      <Icon>
        <path d="M11 12H3" />
        <path d="M16 6H3" />
        <path d="M16 18H3" />
        <path d="M18 9v3" />
        <path d="M18 15h.01" />
      </Icon>
    ),
  },
  {
    href: "/stats",
    label: "Stats",
    icon: (
      <Icon>
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 2 6-6" />
      </Icon>
    ),
  },
  {
    href: "/plan",
    label: "Plan",
    icon: (
      <Icon>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </Icon>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-border z-40">
      <div className="max-w-[480px] mx-auto px-1 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] flex">
        {TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 relative"
            >
              <div
                className={`transition-colors duration-150 ${active ? "text-accent" : "text-muted"}`}
              >
                {tab.icon}
              </div>
              <span
                className={`text-[0.62rem] font-medium tracking-tight transition-colors duration-150 ${active ? "text-text" : "text-muted"}`}
              >
                {tab.label}
              </span>
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute -top-px h-[2px] w-8 bg-accent rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
