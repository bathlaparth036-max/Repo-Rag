import React from "react";
import { RepositoryIntelligence } from "../types";
import { Terminal, Sparkles, Command, ShieldAlert, Cpu, GitBranch } from "lucide-react";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface NavbarProps {
  currentRepo: RepositoryIntelligence | null;
  onOpenCommandPalette: () => void;
  onLoadDemo: () => void;
  onReset: () => void;
  isSidepanelMode: boolean;
  onToggleSidepanelMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRepo,
  onOpenCommandPalette,
  onLoadDemo,
  onReset,
  isSidepanelMode,
  onToggleSidepanelMode
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-cardBorder bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-indigo to-accent-cyan flex items-center justify-center font-mono font-bold text-white shadow-lg shadow-accent-cyan/20">
            &lt;◉&gt;
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-tight text-white font-mono text-base">RepoRAG</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30">
                v1.0 Engine
              </span>
            </div>
            {!isSidepanelMode && (
              <span className="text-xs text-slate-400 hidden sm:inline">
                Understand Any Repository. Ask Anything.
              </span>
            )}
          </div>
        </div>

        {/* Current Active Repo Badge */}
        {currentRepo && (
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-card border border-cardBorder text-xs text-slate-300">
            <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-white">{currentRepo.full_name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-accent-cyan font-mono">{currentRepo.default_branch}</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Indexed
            </span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-card hover:bg-cardBorder border border-cardBorder text-slate-300 hover:text-white text-xs transition"
            title="Open Command Palette (Cmd + K)"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cmd + K</span>
          </button>

          {!currentRepo && (
            <button
              onClick={onLoadDemo}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-medium shadow-md shadow-indigo-500/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Demo</span>
            </button>
          )}

          <button
            onClick={onToggleSidepanelMode}
            className={`px-2.5 py-1.5 rounded-md text-xs font-mono transition border ${
              isSidepanelMode
                ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan"
                : "bg-card border-cardBorder text-slate-400 hover:text-white"
            }`}
            title="Toggle Chrome Side Panel Simulation Mode"
          >
            SidePanel
          </button>

          {currentRepo && (
            <a
              href={currentRepo.html_url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-md text-slate-400 hover:text-white bg-card border border-cardBorder hover:bg-cardBorder transition"
              title="Open GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
