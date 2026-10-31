import React, { useState } from "react";
import {
  Search,
  ArrowRight,
  GitBranch,
  Shield,
  Zap,
  Key,
  Globe,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileCode,
  FolderGit2,
  Sparkles,
} from "lucide-react";
import { GlassButton } from "./GlassButton";
import { MainDashboardActions } from "./MainDashboardActions";

interface RepositoryAnalysisSectionProps {
  onAnalyze: (url: string, branch: string, token: string) => Promise<void>;
  isLoading: boolean;
  statusMessage?: string;
  errorMessage?: string;
  currentRepoInfo?: {
    name: string;
    branch: string;
    isPrivate: boolean;
    language: string;
    filesCount: number;
    testFramework: string;
  } | null;
}

export const RepositoryAnalysisSection: React.FC<RepositoryAnalysisSectionProps> = ({
  onAnalyze,
  isLoading,
  statusMessage,
  errorMessage,
  currentRepoInfo,
}) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [token, setToken] = useState(localStorage.getItem("reporag_github_token") || "");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const presets = [
    { label: "🧪 Local Buggy Repo (Instant)", url: "demo", desc: "ZeroDivisionError & bare except bugs" },
    { label: "pallets/flask", url: "https://github.com/pallets/flask", desc: "Python WSGI Framework" },
    { label: "psf/requests", url: "https://github.com/psf/requests", desc: "HTTP Library for Python" },
    { label: "expressjs/express", url: "https://github.com/expressjs/express", desc: "Fast Node.js Web App" },
  ];

  const handleStartAnalysis = (urlOverride?: string) => {
    const target = (urlOverride || repoUrl).trim();
    if (!target) {
      setValidationError("Please enter a valid GitHub repository URL or select a preset demo.");
      return;
    }
    setValidationError(null);
    onAnalyze(target, branch, token);
  };

  const isPrivate = Boolean(token.trim());

  return (
    <section id="repository-analysis" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-4">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Repository Ingestion Engine</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Let&apos;s Understand Your Codebase
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
            Connect an unfamiliar public-interest repository and let the autonomous AI agent
            explore its AST architecture, test harnesses, fault locations, and dependency matrix.
          </p>
        </div>

        {/* Dedicated Glassmorphism Action Bar */}
        <div className="max-w-4xl mx-auto mb-6">
          <MainDashboardActions
            onConnectGitHub={() => {
              setShowAdvanced(true);
            }}
            onStartAnalysis={() => {
              handleStartAnalysis();
            }}
          />
        </div>

        {/* Ingestion Console Box */}
        <div className="bg-[#0e121e]/90 border border-purple-500/20 rounded-2xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl shadow-purple-950/20 max-w-4xl mx-auto">
          {/* Main URL Input */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => {
                    setRepoUrl(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="https://github.com/owner/repository or 'demo'"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090b14] border border-white/10 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition"
                  onKeyDown={(e) => e.key === "Enter" && handleStartAnalysis()}
                />
              </div>

              <GlassButton
                variant="primary"
                icon={Sparkles}
                onClick={() => handleStartAnalysis()}
                isLoading={isLoading}
                loadingText="Analyzing..."
                className="shrink-0 text-sm py-3 px-6"
              >
                Analyze Repository
              </GlassButton>
            </div>

            {/* Live Progress Status Box */}
            {isLoading && statusMessage && (
              <div className="flex items-center space-x-3 text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-2.5 rounded-lg animate-in fade-in">
                <Loader2 className="w-4 h-4 shrink-0 animate-spin text-cyan-400" />
                <span className="font-semibold">{statusMessage}</span>
              </div>
            )}

            {/* Validation or API Error Feedback */}
            {(validationError || errorMessage) && (
              <div className="flex items-center space-x-2 text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/30 px-3.5 py-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError || errorMessage}</span>
              </div>
            )}

            {/* Presets and Quick Try Bar */}
            <div className="pt-2">
              <span className="text-xs text-slate-400 font-mono block mb-2">
                Quick Preset Benchmarks:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setRepoUrl(preset.url);
                      handleStartAnalysis(preset.url);
                    }}
                    disabled={isLoading}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition flex items-center gap-1.5 cursor-pointer ${
                      preset.url === "demo"
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                        : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Options Bar */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
              <div className="flex items-center space-x-2">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  {isPrivate ? (
                    <>
                      <Lock className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400">Private Mode</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3 h-3 text-cyan-400" />
                      <span className="text-cyan-400">Public Repository</span>
                    </>
                  )}
                </span>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <span className="text-slate-400 hidden sm:inline">
                  Docker sandboxed execution
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-purple-400 hover:text-purple-300 transition flex items-center gap-1 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{showAdvanced ? "Hide Branch & Token Options" : "Branch & Token Options"}</span>
              </button>
            </div>

            {/* Advanced Dropdown */}
            {showAdvanced && (
              <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono animate-in fade-in">
                <div>
                  <label className="block text-slate-400 mb-1">Target Branch</label>
                  <div className="relative">
                    <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="main"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#090b14] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    GitHub Token (Optional for Private Repos)
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="password"
                      value={token}
                      onChange={(e) => {
                        setToken(e.target.value);
                        if (e.target.value.trim()) {
                          localStorage.setItem("reporag_github_token", e.target.value.trim());
                        } else {
                          localStorage.removeItem("reporag_github_token");
                        }
                      }}
                      placeholder="ghp_..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#090b14] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Repository Context Cards (When loaded or Demo mode) */}
        {currentRepoInfo && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-xl bg-[#0e121e]/80 border border-white/10 text-center font-mono">
              <span className="text-[11px] text-slate-400 block mb-1">Target Repository</span>
              <span className="text-sm font-bold text-white truncate block">
                {currentRepoInfo.name}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e121e]/80 border border-white/10 text-center font-mono">
              <span className="text-[11px] text-slate-400 block mb-1">Branch / Language</span>
              <span className="text-sm font-bold text-cyan-400">
                {currentRepoInfo.branch} • {currentRepoInfo.language}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e121e]/80 border border-white/10 text-center font-mono">
              <span className="text-[11px] text-slate-400 block mb-1">Indexed Files</span>
              <span className="text-sm font-bold text-purple-400">
                {currentRepoInfo.filesCount} Files
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e121e]/80 border border-white/10 text-center font-mono">
              <span className="text-[11px] text-slate-400 block mb-1">Test Runner</span>
              <span className="text-sm font-bold text-emerald-400">
                {currentRepoInfo.testFramework}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
