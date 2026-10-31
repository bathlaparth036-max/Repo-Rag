import React, { useState } from "react";
import {
  DownloadCloud,
  Code2,
  Share2,
  TestTube2,
  Target,
  Lightbulb,
  Wrench,
  ShieldCheck,
  CheckCircle,
  Loader2,
  Clock,
  Layers,
  ChevronRight,
  FileCheck2,
} from "lucide-react";

interface WorkflowStage {
  id: number;
  name: string;
  shortDesc: string;
  details: string;
  icon: React.ElementType;
  duration: string;
  status: "completed" | "running" | "pending" | "failed";
  outputBadge: string;
}

interface AIWorkflowSectionProps {
  currentStageIndex?: number;
}

export const AIWorkflowSection: React.FC<AIWorkflowSectionProps> = ({
  currentStageIndex = 7, // by default shows completed through patch verification
}) => {
  const [selectedStage, setSelectedStage] = useState<number>(4);

  const stages: WorkflowStage[] = [
    {
      id: 1,
      name: "Repository Ingestion",
      shortDesc: "Shallow clone, file tree discovery, ignore-rule filtering",
      details:
        "Shallow clones repo to isolated workspace. Filters out binary assets and vendor directories. Generates structural metadata and commit lineage.",
      icon: DownloadCloud,
      duration: "0.42s",
      status: currentStageIndex >= 1 ? "completed" : "pending",
      outputBadge: "4 files indexed",
    },
    {
      id: 2,
      name: "Codebase Understanding",
      shortDesc: "Multi-language AST parsing, symbol extraction, import resolution",
      details:
        "Parses Python AST and regex multi-language grammar. Extracts classes, methods, signatures, and cyclomatic complexity metrics.",
      icon: Code2,
      duration: "0.85s",
      status: currentStageIndex >= 2 ? "completed" : "pending",
      outputBadge: "8 symbols mapped",
    },
    {
      id: 3,
      name: "Dependency Mapping",
      shortDesc: "Builds cross-file knowledge graph connecting callers & callees",
      details:
        "Analyzes package dependencies and internal module imports to construct a 2D directed dependency knowledge graph.",
      icon: Share2,
      duration: "0.38s",
      status: currentStageIndex >= 3 ? "completed" : "pending",
      outputBadge: "6 graph edges",
    },
    {
      id: 4,
      name: "Test Execution",
      shortDesc: "Runs baseline test suite in sandboxed container with coverage",
      details:
        "Invokes pytest under isolated resource boundaries. Captures test execution logs, assertion failures, and line-level statement coverage.",
      icon: TestTube2,
      duration: "1.12s",
      status: currentStageIndex >= 4 ? "completed" : "pending",
      outputBadge: "2 failed, 6 passed",
    },
    {
      id: 5,
      name: "Spectrum Fault Localization",
      shortDesc: "Calculates Ochiai & Tarantula suspiciousness coefficients",
      details:
        "Correlates passing and failing execution traces. Flags main.py:12 with suspiciousness score of 0.94 due to exclusive execution in failing tests.",
      icon: Target,
      duration: "0.64s",
      status: currentStageIndex >= 5 ? "completed" : "pending",
      outputBadge: "Score: 0.94 (main.py:12)",
    },
    {
      id: 6,
      name: "Root-Cause Hypotheses",
      shortDesc: "LLM code reasoning generates candidate failure causes with evidence",
      details:
        "Explores multiple plausible hypotheses (missing zero guard, unhandled empty list). Assigns confidence levels and specifies validation criteria.",
      icon: Lightbulb,
      duration: "1.45s",
      status: currentStageIndex >= 6 ? "completed" : "pending",
      outputBadge: "2 Hypotheses (94% conf.)",
    },
    {
      id: 7,
      name: "Patch Generation",
      shortDesc: "Synthesizes cause-level AST diffs and modifies working copy",
      details:
        "Generates clean unified diffs targeting root cause rather than overfitting to specific test assertions. Validates Python AST syntax.",
      icon: Wrench,
      duration: "1.20s",
      status: currentStageIndex >= 7 ? "completed" : "pending",
      outputBadge: "1 verified solution",
    },
    {
      id: 8,
      name: "Patch Verification",
      shortDesc: "Regression testing, property testing, mutation testing in Docker",
      details:
        "Runs tests in sterile sandbox (--network=none). Verifies 8/8 tests pass, 0 regressions, and 88.9% mutation testing score.",
      icon: ShieldCheck,
      duration: "2.10s",
      status: currentStageIndex >= 8 ? "completed" : "running",
      outputBadge: "100% Passed • Verified",
    },
    {
      id: 9,
      name: "Analysis Complete",
      shortDesc: "Compiles reviewer-ready explanations, metrics, and PR summary",
      details:
        "Produces structured Markdown report with cause, fix explanation, test evidence, and one-click maintainer approval buttons.",
      icon: CheckCircle,
      duration: "0.22s",
      status: currentStageIndex >= 9 ? "completed" : "pending",
      outputBadge: "Ready for Review",
    },
  ];

  return (
    <section id="ai-workflow" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>9-Stage Autonomous Pipeline</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
            AI Analysis &amp; Repair Workflow
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-400 font-sans">
            Every repair follows a rigorous, multi-strategy engineering pipeline—from raw repository
            ingestion to isolated mutation verification and maintainer-ready explanations.
          </p>
        </div>

        {/* 9 Stages Grid / Interactive Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stages.map((stg) => {
            const Icon = stg.icon;
            const isSelected = selectedStage === stg.id;
            const isCompleted = stg.status === "completed";
            const isRunning = stg.status === "running";

            return (
              <div
                key={stg.id}
                onClick={() => setSelectedStage(stg.id)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#14192b] border-cyan-400/80 shadow-lg shadow-cyan-500/10 scale-[1.02]"
                    : "bg-[#0c101c] border-white/10 hover:border-white/20 hover:bg-[#101424]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-400"
                            : isRunning
                            ? "bg-purple-500/20 text-purple-400 animate-pulse"
                            : "bg-white/5 text-slate-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-bold text-white">
                        {stg.id}. {stg.name}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                        isCompleted
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : isRunning
                          ? "bg-purple-500/15 text-purple-300 border-purple-500/30 flex items-center gap-1"
                          : "bg-white/5 text-slate-400 border-white/10"
                      }`}
                    >
                      {isRunning && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                      {stg.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{stg.shortDesc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" /> {stg.duration}
                  </span>
                  <span className="text-cyan-400 font-medium">{stg.outputBadge}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Detail Inspection Box */}
        {selectedStage && (
          <div className="mt-8 p-5 md:p-6 rounded-2xl bg-[#0e1324] border border-cyan-500/30 shadow-xl font-mono text-xs text-slate-300 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-white/10 mb-3 gap-2">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">
                  Stage {selectedStage}: {stages[selectedStage - 1].name} Technical Audit Trail
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Execution Time: {stages[selectedStage - 1].duration}
              </span>
            </div>

            <p className="text-slate-300 font-sans text-sm leading-relaxed mb-3">
              {stages[selectedStage - 1].details}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-[11px]">
              <span className="text-slate-500">Pipeline State:</span>
              <span className="text-emerald-400">Verified Step</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-500">Result Metric:</span>
              <span className="text-cyan-400 font-bold">{stages[selectedStage - 1].outputBadge}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
