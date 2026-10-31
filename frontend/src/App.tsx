import React, { useState, useEffect } from "react";
import { RepositoryIntelligence, TreeNode, KnowledgeGraph } from "./types";
import { api } from "./services/api";
import { Navbar } from "./components/Navbar";
import { CommandPalette } from "./components/CommandPalette";
import { HeroInput } from "./components/HeroInput";
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
  X
} from "lucide-react";

export function App() {
  const [currentRepo, setCurrentRepo] = useState<RepositoryIntelligence | null>(null);
  const [sourceTree, setSourceTree] = useState<TreeNode | null>(null);
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraph | null>(null);
  const [diagrams, setDiagrams] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedFileForTree, setSelectedFileForTree] = useState<string>("");
  const [presetChatQuestion, setPresetChatQuestion] = useState<string>("");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidepanelMode, setIsSidepanelMode] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);

  const tabs = [
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
      setActiveTab("overview");
    } catch (err) {
      console.error("Failed to load repo data:", err);
    }
  };

  const handleExploreDemo = async () => {
    setLoadingInitial(true);
    try {
      const demoRepo = await api.getDemoRepo();
      await loadRepositoryData(demoRepo.id);
    } catch (err) {
      console.error("Failed to load demo:", err);
    } finally {
      setLoadingInitial(false);
    }
  };

  const handlePurge = async () => {
    if (currentRepo) {
      await api.purgeRepository(currentRepo.id);
      setCurrentRepo(null);
      setSourceTree(null);
      setKnowledgeGraph(null);
      setDiagrams({});
      setActiveTab("overview");
    }
  };

  const handleSelectFile = (path: string) => {
    setSelectedFileForTree(path);
    setActiveTab("tree");
  };

  return (
    <div className={`min-h-screen bg-background text-slate-100 flex flex-col font-sans selection:bg-accent-cyan selection:text-black ${isSidepanelMode ? "max-w-[420px] mx-auto border-x border-cardBorder shadow-2xl" : ""}`}>
      {/* Header */}
      <Navbar
        currentRepo={currentRepo}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onLoadDemo={handleExploreDemo}
        onReset={() => setCurrentRepo(null)}
        isSidepanelMode={isSidepanelMode}
        onToggleSidepanelMode={() => setIsSidepanelMode(!isSidepanelMode)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {!currentRepo ? (
          <HeroInput
            onAnalyzeSuccess={(repoId) => loadRepositoryData(repoId)}
            onExploreDemo={handleExploreDemo}
          />
        ) : (
          <div className="space-y-6">
            {/* AI Voice Assistant Narrator HUD */}
            <VoiceAssistantHUD
              repo={currentRepo}
              onAskVoiceQuestion={(question) => {
                setPresetChatQuestion(question);
                setActiveTab("chat");
              }}
              autoStartNarrative={true}
            />

            {/* Tab Navigation Navigation Bar */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-card border border-cardBorder overflow-x-auto text-xs font-mono">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg shrink-0 transition ${
                      active
                        ? "bg-accent-cyan/20 border border-accent-cyan/40 text-accent-cyan font-bold"
                        : "text-slate-400 hover:text-white hover:bg-cardBorder/40"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Views */}
            {activeTab === "overview" && (
              <OverviewTab
                repo={currentRepo}
                onSelectFile={handleSelectFile}
                onSwitchTab={setActiveTab}
              />
            )}

            {activeTab === "archify" && (
              <ArchifyTab diagrams={diagrams} repoName={currentRepo.repository_name} />
            )}

            {activeTab === "tree" && sourceTree && (
              <SourceTreeTab
                tree={sourceTree}
                repositoryId={currentRepo.id}
                importantFiles={currentRepo.important_files}
                selectedPath={selectedFileForTree}
              />
            )}

            {activeTab === "graph" && knowledgeGraph && (
              <KnowledgeGraphTab
                graph={knowledgeGraph}
                onSelectNodeFile={handleSelectFile}
              />
            )}

            {activeTab === "chat" && (
              <RAGChatTab
                repositoryId={currentRepo.id}
                onSelectFile={handleSelectFile}
                presetQuestion={presetChatQuestion}
              />
            )}

            {activeTab === "git" && (
              <GitTab
                commits={currentRepo.recent_commits}
                defaultBranch={currentRepo.default_branch}
                onSelectFile={handleSelectFile}
              />
            )}

            {activeTab === "dependencies" && (
              <DependenciesTab dependencies={currentRepo.dependencies} />
            )}

            {activeTab === "health" && (
              <HealthTab
                repositoryId={currentRepo.id}
                health={currentRepo.health}
                importantFiles={currentRepo.important_files}
                onSelectFile={handleSelectFile}
                aiUsage={currentRepo.ai_usage}
              />
            )}

            {activeTab === "onboarding" && (
              <OnboardingTab repo={currentRepo} onSelectFile={handleSelectFile} />
            )}
          </div>
        )}
      </main>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(t) => {
          if (!currentRepo) handleExploreDemo();
          setActiveTab(t);
        }}
        onLoadDemo={handleExploreDemo}
        onPurge={handlePurge}
        onAskQuestion={(q) => {
          setPresetChatQuestion(q);
          setActiveTab("chat");
        }}
      />
    </div>
  );
}

export default App;
