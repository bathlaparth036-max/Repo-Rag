import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Activity,
  Layers,
  ArrowRight,
  TestTube,
  Check,
  Info,
} from "lucide-react";

export const PatchOverfittingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"generalization" | "invariants" | "comparison">(
    "generalization"
  );

  return (
    <section id="overfitting-detection" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs font-mono mb-4">
            <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" />
            <span>Anti-Overfitting &amp; Semantic Generalization</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Patch-Overfitting Detection
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-400 font-sans">
            In automated software repair, LLMs often produce patches that merely cheat or overfit to
            the specific failing test assertions. RepoRAG enforces semantic invariant verification
            to prove the underlying defect is actually repaired.
          </p>
        </div>

        {/* Overfitting Status Banner Card */}
        <div className="bg-[#0b0e1b] rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Gauge */}
            <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Generalization Assessment
              </span>
              <div className="text-4xl font-black font-mono text-emerald-400 flex items-center justify-center md:justify-start gap-2">
                <ShieldCheck className="w-9 h-9" />
                <span>94.2%</span>
              </div>
              <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                VERIFIED GENERAL REPAIR
              </span>
              <p className="text-xs text-slate-400 font-sans mt-3">
                Overfitting Risk: <strong className="text-emerald-400">Low (5.8%)</strong>. Patch
                satisfies both original tests and synthesized boundary assertions.
              </p>
            </div>

            {/* Right Pillars Breakdown */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-[#121629] border border-white/5 space-y-1.5">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Original Tests</span>
                </div>
                <div className="text-white text-sm font-bold">2/2 Fixed</div>
                <p className="text-[11px] text-slate-400 font-sans leading-tight">
                  Originally failing zero-division test cases now pass cleanly without regressions.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121629] border border-white/5 space-y-1.5">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <TestTube className="w-4 h-4" />
                  <span>Synthesized Tests</span>
                </div>
                <div className="text-white text-sm font-bold">6 New Tests Passed</div>
                <p className="text-[11px] text-slate-400 font-sans leading-tight">
                  Evaluated with extreme floating points, negative zeros (-0.0), and NaN inputs.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121629] border border-white/5 space-y-1.5">
                <div className="text-purple-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>Behavioral Purity</span>
                </div>
                <div className="text-white text-sm font-bold">100% Consistent</div>
                <p className="text-[11px] text-slate-400 font-sans leading-tight">
                  No side effects introduced; original module signatures and imports preserved.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive Contrast: Test-Fixing vs Defect-Repairing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Overfitting Pattern (Negative Example) */}
          <div className="p-5 rounded-2xl bg-[#120e18] border border-red-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-red-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Overfitted Patch Pattern (Rejected by AI Agent)</span>
            </div>
            <pre className="p-3 bg-[#0a070e] rounded-xl border border-red-500/20 text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
              <span className="text-slate-500"># Typical LLM overfit cheating pattern:</span>
              {"\n"}
              <span className="text-red-400">if a == 10 and b == 0:</span>
              {"\n"}
              <span className="text-red-400">
                {"    "}raise ValueError(&quot;Cannot divide by zero&quot;)
              </span>
              {"\n"}
              <span className="text-slate-400">return a / b</span>
            </pre>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              <strong className="text-red-400">Failure Mode:</strong> Hardcodes test-specific input
              values (e.g. 10 and 0). Passes the failing test suite but fails for any other input
              like <code className="text-red-300">divide(42, 0)</code>. RepoRAG&apos;s regression
              synthesis instantly catches and rejects this!
            </p>
          </div>

          {/* Cause-Level Repair (Positive Example) */}
          <div className="p-5 rounded-2xl bg-[#0b141e] border border-emerald-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cause-Level Semantic Repair (Verified by RepoRAG)</span>
            </div>
            <pre className="p-3 bg-[#060c14] rounded-xl border border-emerald-500/20 text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
              <span className="text-slate-500"># Generalized mathematical pre-condition:</span>
              {"\n"}
              <span className="text-emerald-400">if b == 0:</span>
              {"\n"}
              <span className="text-emerald-400">
                {"    "}raise ValueError(&quot;Cannot divide by zero&quot;)
              </span>
              {"\n"}
              <span className="text-slate-400">return a / b</span>
            </pre>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              <strong className="text-emerald-400">Verification Outcome:</strong> Guards against all
              zero denominators regardless of numerator value. Passes 500 randomized property-based
              fuzz tests.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
