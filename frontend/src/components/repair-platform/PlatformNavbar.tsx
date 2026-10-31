import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Search,
  Layers,
  ChevronDown,
  Menu,
  X,
  Zap,
  FolderGit2,
  Target,
  Lightbulb,
  Wrench,
  ShieldCheck,
  FileCheck2,
  Network,
  Activity,
  Code2,
  GitBranch,
  Package,
  BookOpen,
  Cpu,
  BarChart3,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const GithubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export interface PlatformNavbarProps {
  currentRepoUrl?: string;
  isAnalyzing?: boolean;
  onStartDemo: () => void;
  onOpenAnalysisInput: () => void;
  onToggleDeepWorkspace: () => void;
  isDeepWorkspaceActive: boolean;
  activeSection: string;
  onSelectWorkspaceTab?: (tabId: string) => void;
  activeWorkspaceTab?: string;
  onOpenCommandPalette?: () => void;
}

export const PlatformNavbar: React.FC<PlatformNavbarProps> = ({
  currentRepoUrl,
  isAnalyzing,
  onStartDemo,
  onOpenAnalysisInput,
  onToggleDeepWorkspace,
  isDeepWorkspaceActive,
  activeSection,
  onSelectWorkspaceTab,
  activeWorkspaceTab,
  onOpenCommandPalette,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [pipelineDropdownOpen, setPipelineDropdownOpen] = useState<boolean>(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState<boolean>(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const pipelineRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on scroll or outside click
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        pipelineRef.current &&
        !pipelineRef.current.contains(e.target as Node)
      ) {
        setPipelineDropdownOpen(false);
      }
      if (
        workspaceRef.current &&
        !workspaceRef.current.contains(e.target as Node)
      ) {
        setWorkspaceDropdownOpen(false);
      }
      if (
        moreRef.current &&
        !moreRef.current.contains(e.target as Node)
      ) {
        setMoreDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPipelineDropdownOpen(false);
        setWorkspaceDropdownOpen(false);
        setMoreDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // 1. ALL AUTONOMOUS REPAIR PIPELINE FEATURES
  const pipelineFeatures = [
    {
      id: "platform-capabilities",
      title: "3D Core Capabilities",
      subtitle: "Six interactive self-healing engines",
      href: "#platform-capabilities",
      icon: Sparkles,
      badge: "3D Interactive",
    },
    {
      id: "repository-analysis",
      title: "Repository Analysis",
      subtitle: "Shallow clone & AST symbol indexing",
      href: "#repository-analysis",
      icon: FolderGit2,
      badge: "Phase 01",
    },
    {
      id: "neural-visualizer",
      title: "Neural Codebase Map",
      subtitle: "Live dependency traversal & radar scan",
      href: "#neural-visualizer",
      icon: Network,
      badge: "Real-time",
    },
    {
      id: "ai-workflow",
      title: "9-Stage AI Workflow",
      subtitle: "Full lifecycle autonomous repair pipeline",
      href: "#ai-workflow",
      icon: Activity,
      badge: "Orchestration",
    },
    {
      id: "fault-localization",
      title: "Fault Localization (SBFL)",
      subtitle: "Ochiai mathematical suspiciousness (0.94)",
      href: "#fault-localization",
      icon: Target,
      badge: "Phase 02",
    },
    {
      id: "multi-hypothesis",
      title: "Multi-Hypothesis Reasoning",
      subtitle: "Bayesian root-cause candidate branching",
      href: "#multi-hypothesis",
      icon: Lightbulb,
      badge: "Phase 03",
    },
    {
      id: "code-repair",
      title: "Automated Code Repair",
      subtitle: "Split-screen IDE & AST diff synthesis",
      href: "#code-repair",
      icon: Wrench,
      badge: "Phase 04",
    },
    {
      id: "overfitting-detection",
      title: "Anti-Overfitting Protection",
      subtitle: "Guards against test-suite overfitting",
      href: "#overfitting-detection",
      icon: ShieldCheck,
      badge: "Validation",
    },
    {
      id: "patch-verification",
      title: "Patch Verification",
      subtitle: "Mutation testing & invariant check gates",
      href: "#patch-verification",
      icon: CheckCircle2,
      badge: "Phase 05",
    },
    {
      id: "reviewer-dashboard",
      title: "Reviewer PR Dashboard",
      subtitle: "Explainable causal narrative & PR draft",
      href: "#reviewer-dashboard",
      icon: FileCheck2,
      badge: "Phase 06",
    },
    {
      id: "how-it-works",
      title: "How It Works",
      subtitle: "Platform architecture & methodology",
      href: "#how-it-works",
      icon: Layers,
      badge: "Architecture",
    },
  ];

  // 2. ALL DEEP REPOSITORY INTELLIGENCE TOOLS
  const workspaceTools = [
    {
      id: "repair",
      title: "Interactive Repair Tab",
      subtitle: "Live repair execution, console logs & diffs",
      icon: Wrench,
      accent: "text-cyan-400",
    },
    {
      id: "overview",
      title: "Repository Overview",
      subtitle: "Health metrics, language stats & summary",
      icon: Cpu,
      accent: "text-purple-400",
    },
    {
      id: "archify",
      title: "Architecture & Diagrams",
      subtitle: "Automated Mermaid system architecture",
      icon: Layers,
      accent: "text-blue-400",
    },
    {
      id: "tree",
      title: "Source Tree Explorer",
      subtitle: "File browser, syntax viewer & AST symbols",
      icon: Code2,
      accent: "text-emerald-400",
    },
    {
      id: "graph",
      title: "Knowledge Graph",
      subtitle: "2D interactive caller-callee dependency graph",
      icon: Network,
      accent: "text-cyan-400",
    },
    {
      id: "chat",
      title: "RAG Code Assistant",
      subtitle: "Semantic code retrieval & contextual AI chat",
      icon: Sparkles,
      accent: "text-purple-400",
    },
    {
      id: "git",
      title: "Git Lineage & Commits",
      subtitle: "Branch maps, commit lineage & authors",
      icon: GitBranch,
      accent: "text-amber-400",
    },
    {
      id: "dependencies",
      title: "Package Dependencies",
      subtitle: "Direct & transitive package dependency audit",
      icon: Package,
      accent: "text-blue-400",
    },
    {
      id: "health",
      title: "Health & Security Audit",
      subtitle: "Vulnerability flags & cyclomatic complexity",
      icon: ShieldCheck,
      accent: "text-red-400",
    },
    {
      id: "onboarding",
      title: "Developer Onboarding",
      subtitle: "Automated guide, entry points & dev setup",
      icon: BookOpen,
      accent: "text-emerald-400",
    },
  ];

  const handleNavClick = (href: string) => {
    setPipelineDropdownOpen(false);
    setWorkspaceDropdownOpen(false);
    setMoreDropdownOpen(false);
    setMobileMenuOpen(false);

    if (isDeepWorkspaceActive) {
      onToggleDeepWorkspace();
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWorkspaceTabSelect = (tabId: string) => {
    setPipelineDropdownOpen(false);
    setWorkspaceDropdownOpen(false);
    setMoreDropdownOpen(false);
    setMobileMenuOpen(false);

    if (onSelectWorkspaceTab) {
      onSelectWorkspaceTab(tabId);
    } else if (!isDeepWorkspaceActive) {
      onToggleDeepWorkspace();
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#080b16] border-b border-white/10 shadow-2xl shadow-black/80"
          : "bg-[#070913] border-b border-white/10 shadow-lg shadow-black/40"
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          STRICT 3-COLUMN GRID: [ LEFT: BRAND ] [ CENTER: NAV ] [ RIGHT: ACTIONS ]
          Grid eliminates arbitrary absolute positioning to guarantee zero overlaps!
      ─────────────────────────────────────────────────────────────── */}
      <div className="w-full h-16 px-3 sm:px-4 lg:px-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 xl:gap-3 2xl:gap-4">
        
        {/* ─────────────────────────────────────────────────────────────
            1. LEFT — BRANDING SECTION (Vertically centered)
        ─────────────────────────────────────────────────────────────── */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0 min-w-0">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#hero");
            }}
            className="flex items-center space-x-2 group shrink-0 cursor-pointer"
          >
            {/* Logo Icon */}
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-[1px] shadow-md shadow-purple-500/20 group-hover:shadow-cyan-400/35 transition duration-300 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d111d] rounded-[7px] flex items-center justify-center">
                <span className="font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-xs">
                  &lt;◉&gt;
                </span>
              </div>
            </div>

            {/* RepoRAG Name */}
            <span className="font-bold tracking-tight text-white font-sans text-sm sm:text-base leading-none whitespace-nowrap">
              RepoRAG
            </span>
          </a>

          {/* AUTONOMOUS AI REPAIR Badge */}
          <span className="hidden sm:inline-flex items-center text-[9px] xl:text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold tracking-wider whitespace-nowrap shrink-0">
            AUTONOMOUS AI REPAIR
          </span>

          {/* Agent Status Indicator (Visible on desktop) */}
          <div
            className="hidden xl:flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300 whitespace-nowrap shrink-0 ml-0.5"
            title={isAnalyzing ? "Agent is actively analyzing codebase" : "Agent: Active & Ready"}
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isAnalyzing ? "bg-cyan-400" : "bg-emerald-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  isAnalyzing ? "bg-cyan-500" : "bg-emerald-500"
                }`}
              />
            </span>
            <span className="text-slate-300 font-medium">
              {isAnalyzing ? "Analyzing..." : "Active & Ready"}
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. CENTER — MAIN NAVIGATION (Properly centered in column 2)
        ─────────────────────────────────────────────────────────────── */}
        <nav
          className="hidden lg:flex items-center justify-center space-x-1 xl:space-x-1.5 2xl:space-x-2 min-w-0"
          aria-label="Main Navigation"
        >
          {/* Home */}
          <button
            onClick={() => handleNavClick("#hero")}
            className={`h-8 px-2 xl:px-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 flex items-center ${
              activeSection === "hero"
                ? "text-purple-300 bg-purple-500/15 border border-purple-500/30 shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            Home
          </button>

          {/* 3D Engines */}
          <button
            onClick={() => handleNavClick("#platform-capabilities")}
            className={`h-8 flex items-center space-x-1.5 px-2 xl:px-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${
              activeSection === "platform-capabilities"
                ? "text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>3D Engines</span>
          </button>

          {/* Repair Pipeline Dropdown */}
          <div ref={pipelineRef} className="relative shrink-0">
            <button
              onClick={() => {
                setPipelineDropdownOpen(!pipelineDropdownOpen);
                setWorkspaceDropdownOpen(false);
                setMoreDropdownOpen(false);
              }}
              className={`h-8 flex items-center space-x-1 px-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${
                pipelineDropdownOpen
                  ? "text-purple-300 bg-purple-500/20 border border-purple-500/40"
                  : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span>Repair Pipeline</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                  pipelineDropdownOpen ? "rotate-180 text-purple-400" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu - 100% Solid Background, Zero Bleed-Through */}
            {pipelineDropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[520px] max-w-[calc(100vw-2rem)] bg-[#0b0e1b] border border-purple-500/30 rounded-2xl p-3.5 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.98),0_0_35px_rgba(139,92,246,0.25)] z-[100] animate-in fade-in slide-in-from-top-2">
                <div className="px-2 pb-2.5 mb-2 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
                      Autonomous Repair Pipeline
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                    {pipelineFeatures.length} Stages
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {pipelineFeatures.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.href)}
                        className="flex items-start space-x-2.5 p-2.5 rounded-xl transition text-left cursor-pointer border bg-[#12162a] hover:bg-[#18203c] border-white/5 hover:border-purple-500/30 text-slate-300 hover:text-white group"
                      >
                        <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5 text-purple-400 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-semibold text-slate-100 group-hover:text-white leading-tight truncate">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-slate-400 group-hover:text-slate-300 leading-snug mt-1 line-clamp-2">
                            {item.subtitle}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Workspace Tools Dropdown */}
          <div ref={workspaceRef} className="relative shrink-0">
            <button
              onClick={() => {
                setWorkspaceDropdownOpen(!workspaceDropdownOpen);
                setPipelineDropdownOpen(false);
                setMoreDropdownOpen(false);
              }}
              className={`h-8 flex items-center space-x-1 px-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${
                workspaceDropdownOpen || isDeepWorkspaceActive
                  ? "text-cyan-300 bg-cyan-500/20 border border-cyan-500/40"
                  : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Workspace Tools</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 ml-0.5 border border-cyan-500/30 font-semibold">
                10
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                  workspaceDropdownOpen ? "rotate-180 text-cyan-400" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu - 100% Solid Background, Zero Bleed-Through */}
            {workspaceDropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[520px] max-w-[calc(100vw-2rem)] bg-[#0b0e1b] border border-cyan-500/30 rounded-2xl p-3.5 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.98),0_0_35px_rgba(6,182,212,0.25)] z-[100] animate-in fade-in slide-in-from-top-2">
                <div className="px-2 pb-2.5 mb-2 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                      Deep Intelligence Workspace
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                    10 Tools
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {workspaceTools.map((tool) => {
                    const Icon = tool.icon;
                    const isActiveTab =
                      isDeepWorkspaceActive && activeWorkspaceTab === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => handleWorkspaceTabSelect(tool.id)}
                        className={`flex items-start space-x-2.5 p-2.5 rounded-xl transition text-left cursor-pointer border ${
                          isActiveTab
                            ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-200 shadow-sm"
                            : "bg-[#12162a] hover:bg-[#18203c] border-white/5 hover:border-cyan-500/30 text-slate-300 hover:text-white group"
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0 mt-0.5">
                          <Icon className={`w-3.5 h-3.5 ${tool.accent}`} />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-semibold text-slate-100 group-hover:text-white leading-tight truncate">
                            {tool.title}
                          </span>
                          <span className="text-[11px] text-slate-400 group-hover:text-slate-300 leading-snug mt-1 line-clamp-2">
                            {tool.subtitle}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* More Dropdown (Secondary Navigation & Tools) */}
          <div ref={moreRef} className="relative shrink-0">
            <button
              onClick={() => {
                setMoreDropdownOpen(!moreDropdownOpen);
                setPipelineDropdownOpen(false);
                setWorkspaceDropdownOpen(false);
              }}
              className={`h-8 flex items-center space-x-1 px-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${
                moreDropdownOpen ||
                activeSection === "success-metrics" ||
                activeSection === "about" ||
                isDeepWorkspaceActive
                  ? "text-purple-300 bg-purple-500/20 border border-purple-500/40"
                  : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span>More</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                  moreDropdownOpen ? "rotate-180 text-purple-400" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu - 100% Solid Background, Zero Bleed-Through, Opens Inward */}
            {moreDropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-[300px] max-w-[calc(100vw-2rem)] bg-[#0b0e1b] border border-purple-500/30 rounded-2xl p-3 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.98),0_0_35px_rgba(139,92,246,0.2)] z-[100] animate-in fade-in slide-in-from-top-2">
                <div className="px-2 pb-2 mb-2 border-b border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-purple-300 font-bold">
                    Platform Tools &amp; Info
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    Secondary
                  </span>
                </div>

                <div className="space-y-1.5">
                  {/* 1. Metrics */}
                  <button
                    onClick={() => handleNavClick("#success-metrics")}
                    className={`w-full flex items-center space-x-2.5 p-2 rounded-xl transition text-left cursor-pointer border ${
                      activeSection === "success-metrics"
                        ? "bg-purple-500/15 border-purple-500/40 text-purple-200"
                        : "bg-[#12162a] hover:bg-[#18203c] border-white/5 hover:border-purple-500/30 text-slate-300 hover:text-white group"
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
                      <BarChart3 className="w-4 h-4 text-purple-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-100 group-hover:text-white leading-tight">
                        Success Metrics
                      </span>
                      <span className="text-[11px] text-slate-400 leading-snug mt-0.5 truncate">
                        Empirical benchmarks &amp; accuracy
                      </span>
                    </div>
                  </button>

                  {/* 2. About */}
                  <button
                    onClick={() => handleNavClick("#about")}
                    className={`w-full flex items-center space-x-2.5 p-2 rounded-xl transition text-left cursor-pointer border ${
                      activeSection === "about"
                        ? "bg-purple-500/15 border-purple-500/40 text-purple-200"
                        : "bg-[#12162a] hover:bg-[#18203c] border-white/5 hover:border-purple-500/30 text-slate-300 hover:text-white group"
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
                      <BookOpen className="w-4 h-4 text-purple-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-100 group-hover:text-white leading-tight">
                        About Platform
                      </span>
                      <span className="text-[11px] text-slate-400 leading-snug mt-0.5 truncate">
                        SDG mission &amp; methodology
                      </span>
                    </div>
                  </button>

                  {/* 3. Deep Workspace Mode Toggle */}
                  <button
                    onClick={() => {
                      setMoreDropdownOpen(false);
                      onToggleDeepWorkspace();
                    }}
                    className={`w-full flex items-center space-x-2.5 p-2 rounded-xl transition text-left cursor-pointer border ${
                      isDeepWorkspaceActive
                        ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-200 shadow-sm"
                        : "bg-[#12162a] hover:bg-[#18203c] border-white/5 hover:border-cyan-500/30 text-slate-300 hover:text-white group"
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
                      <Layers className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-100 group-hover:text-white leading-tight">
                          {isDeepWorkspaceActive ? "Showcase View" : "Deep Workspace"}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {isDeepWorkspaceActive ? "ACTIVE" : "MODE"}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 leading-snug mt-0.5 truncate">
                        {isDeepWorkspaceActive ? "Switch back to Platform Showcase" : "Access all 10 diagnostic tabs"}
                      </span>
                    </div>
                  </button>

                  {/* 4. GitHub Connection */}
                  <a
                    href={currentRepoUrl || "https://github.com"}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMoreDropdownOpen(false)}
                    className="w-full flex items-center space-x-2.5 p-2 rounded-xl transition text-left cursor-pointer border bg-[#12162a] hover:bg-[#18203c] border-white/5 hover:border-cyan-500/30 text-slate-300 hover:text-white group"
                  >
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 shrink-0">
                      <GithubIcon className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-100 group-hover:text-white leading-tight">
                          GitHub Connection
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono leading-snug mt-0.5 truncate">
                        {currentRepoUrl ? currentRepoUrl.replace("https://github.com/", "") : "View repository"}
                      </span>
                    </div>
                  </a>
                </div>

                {/* Agent Status Row */}
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between px-1 text-[10px] font-mono text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isAnalyzing ? "bg-cyan-400" : "bg-emerald-400"
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                          isAnalyzing ? "bg-cyan-500" : "bg-emerald-500"
                        }`}
                      />
                    </span>
                    <span className="text-slate-300 font-medium">
                      {isAnalyzing ? "Agent: Analyzing..." : "Agent: Active & Ready"}
                    </span>
                  </div>
                  <span className="text-purple-400/80">Autonomous</span>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* ─────────────────────────────────────────────────────────────
            3. RIGHT — ACTION BUTTONS (Essential actions only, zero crowding)
        ─────────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end space-x-1.5 sm:space-x-2 shrink-0">
          {/* Desktop Only Actions (lg and above) */}
          <div className="hidden lg:flex items-center space-x-1.5 xl:space-x-2 shrink-0">
            {/* Search (⌘K) */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="h-8 flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer shrink-0 whitespace-nowrap"
                title="Global Command Palette (Cmd + K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] px-1 py-0.2 rounded bg-white/10 text-slate-300 font-mono">
                  ⌘K
                </span>
              </button>
            )}

            {/* Demo & Buggy Repo */}
            <button
              onClick={onStartDemo}
              className="h-8 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-medium transition cursor-pointer shrink-0 whitespace-nowrap"
              title="Instant Local Buggy Repo Test"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="font-mono">Demo Buggy Repo</span>
            </button>
          </div>

          {/* Analyze Repo (Visible on all desktop/tablet sizes, guaranteed within bounds) */}
          <button
            onClick={onOpenAnalysisInput}
            className="h-8 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-md shadow-purple-600/20 hover:shadow-cyan-500/30 transition cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Analyze</span>
          </button>

          {/* Mobile / Tablet Responsive Drawer Toggle (< lg) */}
          <div className="flex lg:hidden items-center space-x-1.5 shrink-0">
            <button
              onClick={onToggleDeepWorkspace}
              className={`h-8 w-8 p-1.5 rounded-lg text-xs border flex items-center justify-center shrink-0 ${
                isDeepWorkspaceActive
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-white/5 text-slate-300 border-white/10"
              }`}
              title="Toggle Deep Workspace"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-8 w-8 p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MOBILE & TABLET RESPONSIVE DRAWER (< lg)
          Ensures 100% of features remain accessible without any clipping
      ─────────────────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#080b16] px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 z-50">
          {/* Status & Search Row */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">
                {isAnalyzing ? "Agent: Analyzing..." : "Agent: Active & Ready"}
              </span>
            </div>
            {onOpenCommandPalette && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCommandPalette();
                }}
                className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <Search className="w-3 h-3" />
                <span>Search ⌘K</span>
              </button>
            )}
          </div>

          {/* Core Navigation Quick Links */}
          <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-medium">
            <button
              onClick={() => handleNavClick("#hero")}
              className="py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:text-white"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("#platform-capabilities")}
              className="py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:text-cyan-200"
            >
              3D Engines
            </button>
            <button
              onClick={() => handleNavClick("#success-metrics")}
              className="py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:text-white"
            >
              Metrics
            </button>
            <button
              onClick={() => handleNavClick("#about")}
              className="py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:text-white"
            >
              About
            </button>
          </div>

          {/* GitHub Connection */}
          <a
            href={currentRepoUrl || "https://github.com"}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white font-mono"
          >
            <div className="flex items-center space-x-2">
              <GithubIcon className="w-4 h-4 text-cyan-400" />
              <span>GitHub Connection</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>

          {/* 1. Autonomous Repair Pipeline Stages */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-purple-300 font-bold px-1">
              Autonomous Repair Pipeline ({pipelineFeatures.length} Stages)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {pipelineFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className="flex items-center space-x-2.5 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left text-xs text-slate-300"
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Deep Repository Intelligence Tools */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold px-1">
              Deep Repository Workspace ({workspaceTools.length} Tools)
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {workspaceTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleWorkspaceTabSelect(tool.id)}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left text-xs text-slate-300"
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${tool.accent}`} />
                    <span className="truncate">{tool.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartDemo();
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Demo &amp; Buggy Repo</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAnalysisInput();
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-semibold cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Analyze Repository</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
