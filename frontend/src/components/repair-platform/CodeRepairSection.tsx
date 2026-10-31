import React, { useState } from "react";
import {
  Code2,
  GitCompare,
  Check,
  X,
  FileCode,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { GlassButton } from "./GlassButton";

interface PatchOption {
  id: string;
  name: string;
  risk: "Low" | "Medium" | "High";
  score: number;
  isRecommended: boolean;
  explanation: string;
  originalLines: { num: number; code: string; type: "normal" | "removed" }[];
  patchedLines: { num: number; code: string; type: "normal" | "added" }[];
}

export const CodeRepairSection: React.FC = () => {
  const [activeSolutionId, setActiveSolutionId] = useState<string>("sol-1");
  const [activeFile, setActiveFile] = useState<string>("main.py");
  const [applied, setApplied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"split" | "unified">("split");
  const [copied, setCopied] = useState<boolean>(false);

  const patches: PatchOption[] = [
    {
      id: "sol-1",
      name: "Solution 1: Explicit Zero Guard (Recommended)",
      risk: "Low",
      score: 94,
      isRecommended: true,
      explanation:
        "Inserts an explicit pre-condition guard checking whether `b == 0`. When zero, it raises a descriptive `ValueError(\"Cannot divide by zero\")` to satisfy API contracts and prevent unhandled interpreter crashes.",
      originalLines: [
        { num: 9, code: "def divide(a: float, b: float) -> float:", type: "normal" },
        { num: 10, code: '    """Divide a by b."""', type: "normal" },
        { num: 11, code: "    # BUG: No zero-division guard", type: "removed" },
        { num: 12, code: "    return a / b", type: "removed" },
      ],
      patchedLines: [
        { num: 9, code: "def divide(a: float, b: float) -> float:", type: "normal" },
        { num: 10, code: '    """Divide a by b."""', type: "normal" },
        { num: 11, code: "    if b == 0:", type: "added" },
        { num: 12, code: '        raise ValueError("Cannot divide by zero")', type: "added" },
        { num: 13, code: "    return a / b", type: "added" },
      ],
    },
    {
      id: "sol-2",
      name: "Solution 2: Safe Optional Return None",
      risk: "Medium",
      score: 78,
      isRecommended: false,
      explanation:
        "Returns None on zero division. Modifies return type to `Optional[float]`. While safe against crashes, it changes the function signature contract and may require callers to check for None.",
      originalLines: [
        { num: 9, code: "def divide(a: float, b: float) -> float:", type: "normal" },
        { num: 10, code: '    """Divide a by b."""', type: "normal" },
        { num: 11, code: "    # BUG: No zero-division guard", type: "removed" },
        { num: 12, code: "    return a / b", type: "removed" },
      ],
      patchedLines: [
        { num: 9, code: "def divide(a: float, b: float) -> Optional[float]:", type: "added" },
        { num: 10, code: '    """Divide a by b."""', type: "normal" },
        { num: 11, code: "    if b == 0:", type: "added" },
        { num: 12, code: "        return None", type: "added" },
        { num: 13, code: "    return a / b", type: "normal" },
      ],
    },
  ];

  const currentPatch = patches.find((p) => p.id === activeSolutionId) || patches[0];

  const handleApply = () => {
    setApplied(true);
    setTimeout(() => setApplied(false), 3500);
  };

  const handleCopyDiff = () => {
    const diff = `--- a/main.py\n+++ b/main.py\n@@ -11,2 +11,3 @@\n-    # BUG: No zero-division guard\n-    return a / b\n+    if b == 0:\n+        raise ValueError("Cannot divide by zero")\n+    return a / b`;
    navigator.clipboard.writeText(diff);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="code-repair" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-4">
            <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Code Repair &amp; Diff Studio</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Verified AST Code Repair
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-400 font-sans">
            Explore AI-synthesized patches with side-by-side AST line comparisons. Each patch is
            validated against original tests and new synthesized regression assertions.
          </p>
        </div>

        {/* Patch Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {patches.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveSolutionId(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition flex items-center space-x-2 cursor-pointer border ${
                  activeSolutionId === p.id
                    ? "bg-[#141a2e] border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10"
                    : "bg-[#0b0e1b] border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{p.name}</span>
                {p.isRecommended && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ★ Best
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* View controls */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            <button
              onClick={handleCopyDiff}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Copied Diff!" : "Copy Diff"}</span>
            </button>

            <div className="flex rounded-lg bg-white/5 border border-white/10 p-0.5">
              <button
                onClick={() => setViewMode("split")}
                className={`px-2.5 py-1 rounded text-[11px] transition cursor-pointer ${
                  viewMode === "split"
                    ? "bg-cyan-500/20 text-cyan-300 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Split IDE
              </button>
              <button
                onClick={() => setViewMode("unified")}
                className={`px-2.5 py-1 rounded text-[11px] transition cursor-pointer ${
                  viewMode === "unified"
                    ? "bg-cyan-500/20 text-cyan-300 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Unified
              </button>
            </div>
          </div>
        </div>

        {/* IDE Chrome Container */}
        <div className="bg-[#0b0e1b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden font-mono text-xs">
          {/* File Tabs Top Bar */}
          <div className="bg-[#080a13] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#111628] border border-white/10 text-cyan-300 font-bold">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>{activeFile}</span>
              </div>
              <span className="text-slate-500 hidden sm:inline text-[11px]">
                Python 3.11+ • AST Validated
              </span>
            </div>

            <div className="flex items-center space-x-3 text-[11px]">
              <span className="text-slate-400">
                Risk: <strong className="text-emerald-400">{currentPatch.risk}</strong>
              </span>
              <span>•</span>
              <span className="text-slate-400">
                Score: <strong className="text-cyan-400">{currentPatch.score}/100</strong>
              </span>
            </div>
          </div>

          {/* Code Body: Split or Unified */}
          {viewMode === "split" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-[#070912]">
              {/* Left: Original Code */}
              <div className="p-4 space-y-1 overflow-x-auto">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 flex items-center justify-between">
                  <span className="text-red-400">Original Buggy Code</span>
                  <span>Branch: main</span>
                </div>
                {currentPatch.originalLines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`py-0.5 px-2 rounded flex items-center space-x-3 leading-relaxed ${
                      line.type === "removed"
                        ? "bg-red-500/15 text-red-300 font-semibold border-l-2 border-red-500"
                        : "text-slate-400"
                    }`}
                  >
                    <span className="text-slate-600 select-none w-5 text-right text-[11px]">
                      {line.num}
                    </span>
                    <span className="flex-1 whitespace-pre">{line.code}</span>
                  </div>
                ))}
              </div>

              {/* Right: AI Patched Code */}
              <div className="p-4 space-y-1 overflow-x-auto bg-[#080b15]">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 flex items-center justify-between">
                  <span className="text-emerald-400">AI Synthesized Patch</span>
                  <span className="text-emerald-400 font-mono">Syntax: Valid</span>
                </div>
                {currentPatch.patchedLines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`py-0.5 px-2 rounded flex items-center space-x-3 leading-relaxed ${
                      line.type === "added"
                        ? "bg-emerald-500/15 text-emerald-300 font-semibold border-l-2 border-emerald-400"
                        : "text-slate-400"
                    }`}
                  >
                    <span className="text-slate-600 select-none w-5 text-right text-[11px]">
                      {line.num}
                    </span>
                    <span className="flex-1 whitespace-pre">{line.code}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Unified Diff View */
            <div className="p-4 bg-[#070912] overflow-x-auto text-xs leading-relaxed space-y-1">
              <div className="text-slate-500 mb-2">@@ -9,4 +9,5 @@ def divide(a: float, b: float):</div>
              <div className="text-slate-400 px-2"> def divide(a: float, b: float) -&gt; float:</div>
              <div className="text-slate-400 px-2">     &quot;&quot;&quot;Divide a by b.&quot;&quot;&quot;</div>
              <div className="bg-red-500/15 text-red-300 px-2 border-l-2 border-red-500">
                - # BUG: No zero-division guard
              </div>
              <div className="bg-red-500/15 text-red-300 px-2 border-l-2 border-red-500">
                - return a / b
              </div>
              <div className="bg-emerald-500/15 text-emerald-300 px-2 border-l-2 border-emerald-400 font-semibold">
                + if b == 0:
              </div>
              <div className="bg-emerald-500/15 text-emerald-300 px-2 border-l-2 border-emerald-400 font-semibold">
                + raise ValueError(&quot;Cannot divide by zero&quot;)
              </div>
              <div className="bg-emerald-500/15 text-emerald-300 px-2 border-l-2 border-emerald-400 font-semibold">
                + return a / b
              </div>
            </div>
          )}

          {/* Patch Explanation & Action Footer */}
          <div className="p-4 bg-[#080a13] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <span className="text-slate-400 font-semibold block text-[11px]">
                Why this change addresses root cause:
              </span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {currentPatch.explanation}
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <GlassButton
                variant="verified"
                icon={applied ? CheckCircle2 : Check}
                onClick={handleApply}
                disabled={applied}
              >
                {applied ? "Patch Applied to Workspace!" : "Apply Patch to Workspace"}
              </GlassButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
