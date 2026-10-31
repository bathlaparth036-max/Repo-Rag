import React, { useState } from "react";
import { GlassButton } from "./GlassButton";
import {
  FolderGit2,
  Search,
  Wrench,
  ShieldCheck,
  GitPullRequest,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface MainDashboardActionsProps {
  onConnectGitHub?: () => void;
  onStartAnalysis?: () => void;
  onGenerateRepair?: () => void;
  onRunVerification?: () => void;
  onReviewPatch?: () => void;
}

export const MainDashboardActions: React.FC<MainDashboardActionsProps> = ({
  onConnectGitHub,
  onStartAnalysis,
  onGenerateRepair,
  onRunVerification,
  onReviewPatch,
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = (name: string, callback?: () => void, targetId?: string) => {
    setActiveAction(name);
    if (callback) {
      callback();
    } else if (targetId) {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    showToast(`Triggered: ${name}`);
    setTimeout(() => setActiveAction(null), 1200);
  };

  return (
    <div className="w-full my-6 p-4 rounded-2xl bg-[#0c0f1d]/75 border border-purple-500/25 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-3 border-b border-white/5 gap-2 text-xs font-mono">
        <div className="flex items-center space-x-2 text-purple-300">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="font-bold uppercase tracking-wider text-[11px]">
            Autonomous Repair Quick-Action Bar
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          Glassmorphism Interactive Developer Actions
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* 1. Connect GitHub Repository (Glass with Purple Border) */}
        <GlassButton
          variant="glass"
          icon={FolderGit2}
          onClick={() => handleAction("Connect GitHub Repository", onConnectGitHub, "repository-analysis")}
          isLoading={activeAction === "Connect GitHub Repository"}
        >
          Connect GitHub Repository
        </GlassButton>

        {/* 2. Start Analysis (Primary Vibrant Purple Gradient with Glow) */}
        <GlassButton
          variant="primary"
          icon={Search}
          onClick={() => handleAction("Start Analysis", onStartAnalysis, "repository-analysis")}
          isLoading={activeAction === "Start Analysis"}
        >
          Start Analysis
        </GlassButton>

        {/* 3. Generate Repair (Primary / Glass Action) */}
        <GlassButton
          variant="glass"
          icon={Wrench}
          onClick={() => handleAction("Generate Repair", onGenerateRepair, "code-repair")}
          isLoading={activeAction === "Generate Repair"}
        >
          Generate Repair
        </GlassButton>

        {/* 4. Run Verification (Verified Neon-Green Accent) */}
        <GlassButton
          variant="verified"
          icon={ShieldCheck}
          onClick={() => handleAction("Run Verification", onRunVerification, "patch-verification")}
          isLoading={activeAction === "Run Verification"}
        >
          Run Verification
        </GlassButton>

        {/* 5. Review Patch (Glass with Purple Accents) */}
        <GlassButton
          variant="glass"
          icon={GitPullRequest}
          onClick={() => handleAction("Review Patch", onReviewPatch, "reviewer-dashboard")}
          isLoading={activeAction === "Review Patch"}
        >
          Review Patch
        </GlassButton>
      </div>

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="mt-3 p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-300 font-mono text-xs flex items-center space-x-2 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
