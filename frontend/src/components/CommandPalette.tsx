import React, { useState, useEffect } from "react";
import {
  Search,
  Code2,
  GitBranch,
  Network,
  Cpu,
  ShieldAlert,
  BookOpen,
  Sparkles,
  Layers,
  Trash2,
  X
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onLoadDemo: () => void;
  onPurge: () => void;
  onAskQuestion: (q: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onLoadDemo,
  onPurge,
  onAskQuestion
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: "overview", label: "Open Repository Dashboard", icon: Layers, action: () => onSelectTab("overview") },
    { id: "archify", label: "Open Archify Architecture Diagrams", icon: Cpu, action: () => onSelectTab("archify") },
    { id: "tree", label: "Explore Interactive Source Tree & AST", icon: Code2, action: () => onSelectTab("tree") },
    { id: "graph", label: "Open Repository Knowledge Graph", icon: Network, action: () => onSelectTab("graph") },
    { id: "chat", label: "Ask Grounded AI (RAG Chat)", icon: Sparkles, action: () => onSelectTab("chat") },
    { id: "git", label: "Open Git GUI & Churn Timeline", icon: GitBranch, action: () => onSelectTab("git") },
    { id: "health", label: "Inspect Codebase Health & Security Scan", icon: ShieldAlert, action: () => onSelectTab("health") },
    { id: "onboarding", label: "Generate New Developer Onboarding Guide", icon: BookOpen, action: () => onSelectTab("onboarding") },
    { id: "auth_q", label: "Ask AI: Where is authentication implemented?", icon: Sparkles, action: () => { onSelectTab("chat"); onAskQuestion("Where is authentication implemented?"); } },
    { id: "demo", label: "Switch to Demo Repository (Nexus Platform)", icon: Sparkles, action: onLoadDemo },
    { id: "purge", label: "Purge Stored Repository Intelligence (Privacy)", icon: Trash2, action: onPurge },
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl mx-4 rounded-xl bg-card border border-cardBorder shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-cardBorder">
          <Search className="w-4 h-4 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command or question (e.g. 'archify', 'auth', 'health')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500 font-mono"
          />
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-cardBorder text-xs text-left transition font-sans group"
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-accent-cyan" />
                  <span className="flex-1">{cmd.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Select</span>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              No matching commands. Try "architecture", "chat", or "demo".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-cardBorder bg-background/50 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigation: ↑ ↓ Enter</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
