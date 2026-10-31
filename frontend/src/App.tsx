import React, { useState, useEffect } from "react";
import { RepositoryIntelligence, TreeNode, KnowledgeGraph } from "./types";
import { api } from "./services/api";

// Platform Showcase Components
import { PlatformNavbar } from "./components/repair-platform/PlatformNavbar";
import { HeroSection } from "./components/repair-platform/HeroSection";
import { RepositoryAnalysisSection } from "./components/repair-platform/RepositoryAnalysisSection";
import { CinematicVisualizer } from "./components/repair-platform/CinematicVisualizer";
import { AIWorkflowSection } from "./components/repair-platform/AIWorkflowSection";
import { FaultLocalizationSection } from "./components/repair-platform/FaultLocalizationSection";
import { MultiHypothesisSection } from "./components/repair-platform/MultiHypothesisSection";
import { CodeRepairSection } from "./components/repair-platform/CodeRepairSection";
import { PatchOverfittingSection } from "./components/repair-platform/PatchOverfittingSection";
import { PatchVerificationSection } from "./components/repair-platform/PatchVerificationSection";
import { SuccessMetricsSection } from "./components/repair-platform/SuccessMetricsSection";
import { ReviewerDashboardSection } from "./components/repair-platform/ReviewerDashboardSection";
import { HowItWorksSection } from "./components/repair-platform/HowItWorksSection";
import { AboutSection } from "./components/repair-platform/AboutSection";
import { PlatformFooter } from "./components/repair-platform/PlatformFooter";
import { FloatingNavDock } from "./components/repair-platform/FloatingNavDock";
import { PlatformFeatureCards } from "./components/repair-platform/PlatformFeatureCards";

// Existing Deep Workspace Components (100% Preserved)
import { CommandPalette } from "./components/CommandPalette";
import { OverviewTab } from "./components/OverviewTab";
import { ArchifyTab } from "./components/ArchifyTab";
import { SourceTreeTab } from "./components/SourceTreeTab";
import { KnowledgeGraphTab } from "./components/KnowledgeGraphTab";
import { RAGChatTab } from "./components/RAGChatTab";
import { GitTab } from "./components/GitTab";
import { DependenciesTab } from "./components/DependenciesTab";
import { HealthTab } from "./components/HealthTab";
import { OnboardingTab } from "./components/OnboardingTab";
import { VoiceAssistantHUD } from "./components/VoiceAssistantHUD";
import { RepairTab } from "./components/RepairTab";

import {
  Layers,
  Cpu,
  Code2,
  Network,
  Sparkles,
  GitBranch,
  ShieldAlert,
  BookOpen,
  Package,
  Wrench,
  ArrowLeft,
  Terminal,
  ExternalLink,
  ChevronRight,
  Zap,
} from "lucide-react";

export function App() {
  // Navigation & Mode State
  const [isDeepWorkspaceActive, setIsDeepWorkspaceActive] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  // Repository & Analysis Data State
  const [currentRepo, setCurrentRepo] = useState<RepositoryIntelligence | null>(null);
  const [sourceTree, setSourceTree] = useState<TreeNode | null>(null);
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraph | null>(null);
  const [diagrams, setDiagrams] = useState<Record<string, string>>({});
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<string>("repair");
  const [selectedFileForTree, setSelectedFileForTree] = useState<string>("");
  const [presetChatQuestion, setPresetChatQuestion] = useState<string>("");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Analysis Progress State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string>("");
  const [analysisStatus, setAnalysisStatus] = useState<string>("");
  const [activeStageIndex, setActiveStageIndex] = useState<number>(7);

  const STAGE_INDEX_MAP: Record<string, number> = {
    IDLE: 0,
    VALIDATING: 1,
    FETCHING: 1,
    SCANNING: 2,
    PARSING: 3,
    INDEXING: 4,
    EMBEDDING: 5,
    GRAPH_BUILDING: 6,
    ANALYZING: 7,
    READY: 8,
    FAILED: 0,
  };

  // Deep Workspace Tab Definitions
  const workspaceTabs = [
    { id: "repair", label: "Auto Repair", icon: Wrench },
    { id: "overview", label: "Overview", icon: Layers },
    { id: "archify", label: "Archify", icon: Cpu },
    { id: "tree", label: "Source Tree", icon: Code2 },
    { id: "graph", label: "Knowledge Graph", icon: Network },
    { id: "chat", label: "RAG Chat", icon: Sparkles },
    { id: "git", label: "Git Map", icon: GitBranch },
    { id: "dependencies", label: "Dependencies", icon: Package },
    { id: "health", label: "Health & Security", icon: ShieldAlert },
    { id: "onboarding", label: "Onboarding", icon: BookOpen },
  ];

  // Scroll Spy for Navbar Active State
  useEffect(() => {
    const sectionIds = [
      "hero",
      "platform-capabilities",
      "repository-analysis",
      "fault-localization",
      "code-repair",
      "success-metrics",
      "about",
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Loads repository artifacts once analyzed
  const loadRepositoryData = async (repoId: string) => {
    try {
      const [repo, tree, graph, diags] = await Promise.all([
        api.getRepository(repoId),
        api.getSourceTree(repoId),
        api.getKnowledgeGraph(repoId),
        api.getDiagrams(repoId),
      ]);
      setCurrentRepo(repo);
      setSourceTree(tree);
      setKnowledgeGraph(graph);
      setDiagrams(diags);
    } catch (err) {
      console.error("Failed to load repo data:", err);
    }
  };

  const handleExploreDemo = async () => {
    setIsAnalyzing(true);
    setAnalysisError("");
    try {
      const demoRepo = await api.getDemoRepo();
      await loadRepositoryData(demoRepo.id);
      setActiveStageIndex(8);
    } catch (err) {
      console.warn("Backend demo repo API not reached, using simulated state:", err);
      // Create local simulated repo context so UI doesn't break
      setCurrentRepo({
        id: "demo-buggy-repo",
        owner: "antigravity",
        repository_name: "demo-buggy-repo",
        full_name: "antigravity/demo-buggy-repo",
        html_url: "https://github.com/demo/buggy-repo",
        description: "Autonomous software repair benchmark demonstration repository",
        default_branch: "main",
        is_private: false,
        stars: 128,
        forks: 34,
        languages: { Python: 88, Shell: 12 },
        frameworks: ["pytest"],
        dependencies: [
          {
            name: "pytest",
            version: "^8.0.0",
            ecosystem: "pypi",
            is_dev: true,
            risk_level: "low",
          },
        ],
        file_count: 4,
        directory_count: 2,
        contributor_count: 3,
        commit_count: 14,
        architecture: {
          style: "Modular Python Package",
          description: "Calculator and data processor with intentional demonstration bugs",
          entry_points: ["main.py"],
          services: ["CalculationEngine"],
          databases: [],
          apis: [],
          data_flow: "main.py -> utils.py -> test suite",
        },
        health: {
          overall: 78,
          architecture: 85,
          maintainability: 74,
          documentation: 80,
          testing: 70,
          security: 82,
          is_ai_estimated: false,
          summary: "Moderate maintainability. Fault localized at main.py:12.",
        },
        important_files: [],
        recent_commits: [],
        status: "READY",
        progress_percentage: 100,
        status_message: "Demo repository analyzed & verified",
        overview_summary: "4 source files indexed with 2 bugs identified and repaired.",
        summary_30s: "Autonomous repair benchmark with ZeroDivisionError.",
        summary_2m: "",
        summary_5m: "",
      });
      setActiveStageIndex(8);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartAnalysis = async (url: string, branch: string, token: string) => {
    setIsAnalyzing(true);
    setAnalysisError("");
    setAnalysisStatus("Validating repository target...");
    setActiveStageIndex(0);

    try {
      if (url === "demo" || url.toLowerCase() === "local") {
        setAnalysisStatus("Loading instant local benchmark repository...");
        await handleExploreDemo();
        try {
          await api.startRepair("demo", token || undefined, branch || undefined);
        } catch {
          /* ignore if offline */
        }
        setAnalysisStatus("Demo repository loaded & verified.");
        return;
      }

      // Real GitHub Repository
      setAnalysisStatus("Validating GitHub repository...");
      const val = await api.validateRepo(url);

      if (val.is_cached) {
        setAnalysisStatus("Repository loaded from cache!");
        setActiveStageIndex(8);
        await loadRepositoryData(val.repository_id);
        try {
          await api.startRepair(url, token || undefined, branch || undefined);
        } catch (repErr) {
          console.warn("Autonomous repair start notice:", repErr);
        }
        setAnalysisStatus("Repository intelligence index complete!");
        return;
      }

      // Start asynchronous ingestion pipeline on backend
      setAnalysisStatus("Queuing ingestion pipeline...");
      setActiveStageIndex(1);
      const job = await api.startAnalysis(url, token || undefined);

      // Poll until analysis reaches READY or FAILED
      await new Promise<void>((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 180; // 3 minutes timeout max
        const pollTimer = setInterval(async () => {
          attempts++;
          try {
            const status = await api.getJobStatus(job.job_id);
            if (status.message) {
              setAnalysisStatus(status.message);
            }
            if (status.stage && STAGE_INDEX_MAP[status.stage] !== undefined) {
              setActiveStageIndex(STAGE_INDEX_MAP[status.stage]);
            }

            if (status.stage === "READY" || status.progress === 100) {
              clearInterval(pollTimer);
              setAnalysisStatus("Repository intelligence index complete!");
              setActiveStageIndex(8);
              await loadRepositoryData(status.repository_id);
              try {
                await api.startRepair(url, token || undefined, branch || undefined);
              } catch (repErr) {
                console.warn("Autonomous repair start notice:", repErr);
              }
              resolve();
            } else if (status.stage === "FAILED") {
              clearInterval(pollTimer);
              reject(new Error(status.error || status.message || "Repository analysis failed."));
            } else if (attempts >= maxAttempts) {
              clearInterval(pollTimer);
              reject(new Error("Analysis timed out. Please check network connectivity or try again."));
            }
          } catch (pollErr: any) {
            clearInterval(pollTimer);
            reject(pollErr);
          }
        }, 1000);
      });
    } catch (e: any) {
      console.error("Repository analysis error:", e);
      setAnalysisError(e.message || "Failed to analyze repository. Check the URL or rate limits.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectFile = (path: string) => {
    setSelectedFileForTree(path);
    setActiveWorkspaceTab("tree");
  };

  const currentRepoInfo = currentRepo
    ? {
        name: currentRepo.full_name,
        branch: currentRepo.default_branch,
        isPrivate: currentRepo.is_private,
        language: Object.keys(currentRepo.languages)[0] || "Python",
        filesCount: currentRepo.file_count,
        testFramework: currentRepo.frameworks[0] || "pytest",
      }
    : null;

  return (
    <div className="min-h-screen bg-[#080a11] text-slate-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-black">
      {/* Global Navigation Bar */}
      <PlatformNavbar
        currentRepoUrl={currentRepo?.html_url}
        isAnalyzing={isAnalyzing}
        onStartDemo={() => {
          handleExploreDemo();
          const el = document.getElementById("repository-analysis");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenAnalysisInput={() => {
          const el = document.getElementById("repository-analysis");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onToggleDeepWorkspace={() => setIsDeepWorkspaceActive(!isDeepWorkspaceActive)}
        isDeepWorkspaceActive={isDeepWorkspaceActive}
        activeSection={activeSection}
        onSelectWorkspaceTab={(tabId) => {
          setIsDeepWorkspaceActive(true);
          if (!currentRepo && tabId !== "repair") {
            handleExploreDemo();
          }
          setActiveWorkspaceTab(tabId);
        }}
        activeWorkspaceTab={activeWorkspaceTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Mode Switcher View */}
      {isDeepWorkspaceActive ? (
        /* DEEP WORKSPACE MODE (Overview, Tree, Archify, Graph, RAG Chat, Git, Dependencies, Health, Onboarding) */
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6 animate-in fade-in">
          {/* Back to Platform Showcase Banner */}
          <div className="p-4 rounded-2xl bg-[#0d1222] border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsDeepWorkspaceActive(false)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Showcase</span>
              </button>
              <span className="text-slate-500">|</span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                Deep Code Intelligence Workspace
              </span>
            </div>

            {currentRepo && (
              <div className="text-xs font-mono text-slate-300 flex items-center space-x-2">
                <span className="text-slate-500">Active Target:</span>
                <span className="text-white font-bold">{currentRepo.full_name}</span>
                <span className="text-emerald-400">({currentRepo.default_branch})</span>
              </div>
            )}
          </div>

          {/* AI Voice Assistant Narrator HUD (When repo loaded) */}
          {currentRepo && (
            <VoiceAssistantHUD
              repo={currentRepo}
              onAskVoiceQuestion={(question) => {
                setPresetChatQuestion(question);
                setActiveWorkspaceTab("chat");
              }}
              autoStartNarrative={false}
            />
          )}

          {/* Tab Navigation Bar */}
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#0d1222] border border-white/10 overflow-x-auto text-xs font-mono">
            {workspaceTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeWorkspaceTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (!currentRepo && tab.id !== "repair") {
                      handleExploreDemo();
                    }
                    setActiveWorkspaceTab(tab.id);
                  }}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg shrink-0 transition cursor-pointer ${
                    active
                      ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Views */}
          {activeWorkspaceTab === "repair" && (
            <RepairTab initialRepoUrl={currentRepo?.html_url || "demo"} />
          )}

          {activeWorkspaceTab === "overview" && currentRepo && (
            <OverviewTab
              repo={currentRepo}
              onSelectFile={handleSelectFile}
              onSwitchTab={setActiveWorkspaceTab}
            />
          )}

          {activeWorkspaceTab === "archify" && currentRepo && (
            <ArchifyTab diagrams={diagrams} repoName={currentRepo.repository_name} />
          )}

          {activeWorkspaceTab === "tree" && currentRepo && sourceTree && (
            <SourceTreeTab
              tree={sourceTree}
              repositoryId={currentRepo.id}
              importantFiles={currentRepo.important_files}
              selectedPath={selectedFileForTree}
            />
          )}

          {activeWorkspaceTab === "graph" && currentRepo && knowledgeGraph && (
            <KnowledgeGraphTab
              graph={knowledgeGraph}
              onSelectNodeFile={handleSelectFile}
            />
          )}

          {activeWorkspaceTab === "chat" && currentRepo && (
            <RAGChatTab
              repositoryId={currentRepo.id}
              onSelectFile={handleSelectFile}
              presetQuestion={presetChatQuestion}
            />
          )}

          {activeWorkspaceTab === "git" && currentRepo && (
            <GitTab
              commits={currentRepo.recent_commits}
              defaultBranch={currentRepo.default_branch}
              onSelectFile={handleSelectFile}
            />
          )}

          {activeWorkspaceTab === "dependencies" && currentRepo && (
            <DependenciesTab dependencies={currentRepo.dependencies} />
          )}

          {activeWorkspaceTab === "health" && currentRepo && (
            <HealthTab
              repositoryId={currentRepo.id}
              health={currentRepo.health}
              importantFiles={currentRepo.important_files}
              onSelectFile={handleSelectFile}
              aiUsage={currentRepo.ai_usage}
            />
          )}

          {activeWorkspaceTab === "onboarding" && currentRepo && (
            <OnboardingTab repo={currentRepo} onSelectFile={handleSelectFile} />
          )}
        </main>
      ) : (
        /* PLATFORM EXPERIENCE MODE (Complete 14 Multi-Section Showcase) */
        <main className="flex-1 w-full flex flex-col">
          {/* Section B: Hero Section */}
          <HeroSection
            onAnalyzeClick={() => {
              const el = document.getElementById("repository-analysis");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            onExploreHowItWorksClick={() => {
              const el = document.getElementById("how-it-works");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            onTryDemo={() => {
              handleExploreDemo();
              const el = document.getElementById("repository-analysis");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Section B.5: Core Platform Capabilities (6 Animated 3D Interactive Cards) */}
          <PlatformFeatureCards />

          {/* Section C: Repository Analysis Ingestion */}
          <RepositoryAnalysisSection
            onAnalyze={handleStartAnalysis}
            isLoading={isAnalyzing}
            statusMessage={analysisStatus}
            errorMessage={analysisError}
            currentRepoInfo={currentRepoInfo}
          />

          {/* Section D: Cinematic Repository Analysis Animation (Neural Network Map) */}
          <CinematicVisualizer
            isAnalyzing={isAnalyzing}
            activeStageIndex={activeStageIndex}
          />

          {/* Section E: AI Analysis Workflow (9 Stages) */}
          <AIWorkflowSection currentStageIndex={activeStageIndex} />

          {/* Section F: Spectrum-Based Fault Localization (Ochiai SBFL) */}
          <FaultLocalizationSection />

          {/* Section G: Multi-Hypothesis Reasoning */}
          <MultiHypothesisSection />

          {/* Section H: AI Code Repair Split-Screen IDE */}
          <CodeRepairSection />

          {/* Section I: Patch-Overfitting Detection */}
          <PatchOverfittingSection />

          {/* Section J: Multi-Tier Patch Verification */}
          <PatchVerificationSection />

          {/* Section K: Success Metrics Dashboard */}
          <SuccessMetricsSection />

          {/* Section L: Reviewer Dashboard & Approval */}
          <ReviewerDashboardSection />

          {/* Section M: How It Works Pipeline */}
          <HowItWorksSection />

          {/* Section N: About the Project (SDG 9 & 16) */}
          <AboutSection />

          {/* Section O: Contact & Footer */}
          <PlatformFooter />
        </main>
      )}

      {/* Floating Vertical Navigation Dock (Right side on desktop, bottom dock on mobile) */}
      {!isDeepWorkspaceActive && <FloatingNavDock activeSection={activeSection} />}

      {/* Floating Deep Workspace Quick Access Pill (When in Showcase mode, docked at bottom left on desktop) */}
      {!isDeepWorkspaceActive && (
        <div className="hidden sm:block fixed bottom-6 left-6 z-40 animate-in fade-in slide-in-from-bottom-4">
          <button
            onClick={() => setIsDeepWorkspaceActive(true)}
            className="flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-[#0c0f1d]/85 hover:bg-[#121629] border border-purple-500/30 text-purple-200 font-mono text-xs font-bold shadow-2xl shadow-purple-950/40 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group hover:border-purple-400"
          >
            <Layers className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
            <span>Deep Workspace &amp; Graphs</span>
            <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
          </button>
        </div>
      )}

      {/* Global Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(t) => {
          setIsDeepWorkspaceActive(true);
          if (!currentRepo && t !== "repair") handleExploreDemo();
          setActiveWorkspaceTab(t);
        }}
        onLoadDemo={handleExploreDemo}
        onPurge={() => {
          setCurrentRepo(null);
          setSourceTree(null);
          setKnowledgeGraph(null);
          setDiagrams({});
          setIsDeepWorkspaceActive(false);
        }}
        onAskQuestion={(q) => {
          setIsDeepWorkspaceActive(true);
          setPresetChatQuestion(q);
          setActiveWorkspaceTab("chat");
        }}
      />
    </div>
  );
}

export default App;
