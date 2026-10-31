import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Search,
  Target,
  Wrench,
  ShieldCheck,
  GitPullRequest,
  Sparkles,
} from "lucide-react";

interface FloatingNavDockProps {
  activeSection: string;
}

export const FloatingNavDock: React.FC<FloatingNavDockProps> = ({ activeSection }) => {
  const [currentSection, setCurrentSection] = useState(activeSection || "hero");

  // Keep internal state synchronized with activeSection prop
  useEffect(() => {
    if (activeSection) {
      setCurrentSection(activeSection);
    }
  }, [activeSection]);

  const navItems = [
    {
      id: "hero",
      label: "Dashboard",
      href: "#hero",
      icon: LayoutDashboard,
    },
    {
      id: "repository-analysis",
      label: "Repository Analysis",
      href: "#repository-analysis",
      icon: Search,
    },
    {
      id: "fault-localization",
      label: "Fault Localization",
      href: "#fault-localization",
      icon: Target,
    },
    {
      id: "code-repair",
      label: "Code Repair",
      href: "#code-repair",
      icon: Wrench,
    },
    {
      id: "patch-verification",
      label: "Verification",
      href: "#patch-verification",
      icon: ShieldCheck,
    },
    {
      id: "reviewer-dashboard",
      label: "Review",
      href: "#reviewer-dashboard",
      icon: GitPullRequest,
    },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    e.preventDefault();
    setCurrentSection(id);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP FLOATING VERTICAL NAVIGATION DOCK (RIGHT SIDE)
      ─────────────────────────────────────────────────────────────── */}
      <aside
        aria-label="Floating Section Navigation"
        className="hidden md:flex fixed right-5 lg:right-7 top-1/2 -translate-y-1/2 z-50 flex-col items-end gap-2.5 select-none"
      >
        <div className="glass-dock p-2 rounded-full flex flex-col items-center gap-2 border border-purple-500/25 shadow-2xl shadow-purple-950/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href, item.id)}
                className={`group relative flex items-center justify-end rounded-full p-2.5 transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer ${
                  isActive
                    ? "neon-purple-glow bg-purple-600/30 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-purple-500/15"
                } hover:scale-105 active:scale-95`}
                aria-label={`Navigate to ${item.label}`}
                title={item.label}
              >
                {/* Horizontal Expandable Label Revealed On Hover */}
                <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:mr-2.5 transition-all duration-300 ease-out text-xs font-mono font-medium text-slate-200 group-hover:text-purple-200">
                  {item.label}
                </span>

                {/* Minimalist White Icon with Muted Purple Accent */}
                <div className="relative flex items-center justify-center shrink-0">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isActive
                        ? "text-purple-300 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                        : "text-slate-200 group-hover:text-purple-300 group-hover:scale-110"
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE COMPACT BOTTOM NAVIGATION BAR
      ─────────────────────────────────────────────────────────────── */}
      <nav
        aria-label="Mobile Navigation Dock"
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3 py-2 rounded-full glass-dock border border-purple-500/30 shadow-2xl shadow-black/80 max-w-[94vw] overflow-x-auto"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleScrollTo(e, item.href, item.id)}
              className={`flex items-center justify-center p-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "neon-purple-glow bg-purple-600/35 text-white scale-105"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-purple-300" : "text-slate-200"
                }`}
              />
            </a>
          );
        })}
      </nav>
    </>
  );
};
