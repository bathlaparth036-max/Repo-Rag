import React, { useState } from "react";
import { Search, Sparkles, ArrowRight, GitBranch, Shield, Zap, AlertCircle, Key, Wrench } from "lucide-react";
import { api } from "../services/api";

interface HeroInputProps {
  onAnalyzeSuccess: (repoId: string) => void;
  onExploreDemo: () => void;
  onGoToRepair?: () => void;
}

export const HeroInput: React.FC<HeroInputProps> = ({
  onAnalyzeSuccess,
  onExploreDemo,
  onGoToRepair
}) => {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState(localStorage.getItem("reporag_github_token") || "");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a valid GitHub repository URL.");
      return;
    }

    setError(null);
    setLoading(true);
    setProgressPercent(10);
    setProgressMsg("Validating repository URL...");

    try {
      // 1. Validate
      const val = await api.validateRepo(url);
      if (val.is_cached) {
        setProgressPercent(100);
        setProgressMsg("Repository loaded from cache!");
        setTimeout(() => {
          onAnalyzeSuccess(val.repository_id);
          setLoading(false);
        }, 500);
        return;
      }

      // 2. Start ingestion job (with optional token)
      const currentToken = localStorage.getItem("reporag_github_token") || undefined;
      const job = await api.startAnalysis(url, currentToken);
      setProgressPercent(20);
      setProgressMsg("Ingestion job queued...");

      // 3. Poll progress
      const pollInterval = setInterval(async () => {
        try {
          const status = await api.getJobStatus(job.job_id);
          setProgressPercent(status.progress || 30);
          setProgressMsg(status.message || "Processing repository...");

          if (status.stage === "READY" || status.progress === 100) {
            clearInterval(pollInterval);
            setTimeout(() => {
              onAnalyzeSuccess(status.repository_id);
              setLoading(false);
            }, 500);
          } else if (status.stage === "FAILED") {
            clearInterval(pollInterval);
            setError(status.error || "Ingestion encountered an error.");
            setLoading(false);
          }
        } catch (pollErr) {
          clearInterval(pollInterval);
          setError("Failed to track analysis progress.");
          setLoading(false);
        }
      }, 1200);

    } catch (err: any) {
      setError(err.message || "Failed to analyze repository. Check URL or rate limits.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-12 md:py-20 flex flex-col items-center justify-center text-center px-4">
      {/* Badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-mono mb-6">
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
        <span>Autonomous GitHub Intelligence Platform</span>
      </div>

      {/* Hero Headings */}
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white max-w-4xl font-sans mb-4">
        Understand Any Repository.{" "}
        <span className="bg-gradient-to-r from-accent-indigo via-accent-cyan to-white bg-clip-text text-transparent">
          Ask Anything.
        </span>
      </h1>

      <p className="text-slate-400 text-sm md:text-base max-w-2xl font-sans mb-10 leading-relaxed">
        Transform any public GitHub repository into a living knowledge graph, interactive architecture map, 
        and grounded RAG intelligence engine.
      </p>

      {/* Main Form */}
      <div className="w-full max-w-2xl bg-card border border-cardBorder rounded-2xl p-2 md:p-3 shadow-2xl shadow-accent-cyan/5">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="https://github.com/owner/repository"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/80 border border-cardBorder text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent-cyan/50 font-mono transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-cyan hover:from-indigo-500 hover:to-cyan-400 text-black font-semibold text-xs tracking-wide uppercase transition shadow-lg shadow-accent-cyan/20 disabled:opacity-50"
          >
            <span>{loading ? "Analyzing..." : "Analyze"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Token Expander & Resilience Note */}
        <div className="mt-2.5 flex items-center justify-between px-2 text-[11px] font-mono text-slate-400">
          <button
            type="button"
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="hover:text-accent-cyan flex items-center gap-1.5 transition text-slate-400"
          >
            <Key className="w-3 h-3 text-accent-cyan" />
            <span>{showTokenInput ? "Hide GitHub Token" : "GitHub Token (Optional for Private Repos)"}</span>
          </button>
          <span className="text-slate-500 hidden sm:inline">⚡ Rate-limit free via Git shallow protocol</span>
        </div>

        {showTokenInput && (
          <div className="mt-2 p-2.5 rounded-xl bg-background/80 border border-cardBorder flex items-center gap-2 text-xs font-mono animate-in fade-in">
            <input
              type="password"
              placeholder="Paste GitHub PAT (e.g. ghp_...)"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                if (e.target.value.trim()) {
                  localStorage.setItem("reporag_github_token", e.target.value.trim());
                } else {
                  localStorage.removeItem("reporag_github_token");
                }
              }}
              className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-slate-500 font-mono text-xs"
            />
            {token && (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Token Active
              </span>
            )}
          </div>
        )}

        {/* Live Ingestion Progress Bar */}
        {loading && (
          <div className="mt-4 pt-3 border-t border-cardBorder px-2 text-left animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                {progressMsg}
              </span>
              <span className="text-accent-cyan font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-indigo via-accent-cyan to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Quick Demo & Repair Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <span className="text-xs text-slate-500 font-mono">Quick exploration:</span>
        <button
          onClick={onExploreDemo}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-cardBorder border border-cardBorder text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
          <span>reporag-demo/nexus-platform (Full-Stack AI)</span>
        </button>

        <button
          onClick={onGoToRepair}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-accent-cyan text-xs font-mono transition cursor-pointer"
        >
          <Wrench className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Launch Autonomous Repair Agent</span>
        </button>
      </div>

      {/* Value Pillars */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full text-left">
        <div className="p-4 rounded-xl bg-card/60 border border-cardBorder/60">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center text-accent-cyan mb-3">
            <GitBranch className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-white mb-1">Deep AST & Symbol Extraction</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extracts classes, interfaces, endpoints, imports, and calls across 12+ programming languages.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card/60 border border-cardBorder/60">
          <div className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center text-accent-purple mb-3">
            <Zap className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-white mb-1">Archify Architecture Engine</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Auto-generates Mermaid architecture, API flow, authentication sequences, and database schemas.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card/60 border border-cardBorder/60">
          <div className="w-8 h-8 rounded-lg bg-accent-emerald/10 flex items-center justify-center text-accent-emerald mb-3">
            <Shield className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-white mb-1">Grounded Zero-Hallucination RAG</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every answer is anchored by exact file paths, line ranges, AST symbols, and confidence scores.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card/60 border border-cardBorder/60">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3">
            <Wrench className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-white mb-1">Autonomous Software Repair</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-strategy bug detection, root-cause hypothesis generation, sandboxed test execution, and verified regression-free patches.
          </p>
        </div>
      </div>
    </div>
  );
};
