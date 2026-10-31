import React from "react";
import {
  ShieldCheck,
  TestTube,
  CheckCircle2,
  XCircle,
  Dna,
  Zap,
  Activity,
  Layers,
  Clock,
  Lock,
  Container,
} from "lucide-react";

export const PatchVerificationSection: React.FC = () => {
  const verificationPillars = [
    {
      title: "1. Original Test Suite",
      description: "Baseline pytest harness re-executed in pristine working directory copy.",
      metric: "8/8 Passed",
      subMetric: "0 Failures • 0 Errors",
      duration: "0.01s",
      status: "PASS",
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "2. Regression Test Synthesis",
      description:
        "AI-generated unit test suite explicitly checking edge cases (negative, null, extreme floats).",
      metric: "6/6 Passed",
      subMetric: "0 Regressions Introduced",
      duration: "0.04s",
      status: "PASS",
      color: "text-cyan-400",
      borderColor: "border-cyan-500/30",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "3. Property-Based Fuzz Testing",
      description:
        "Hypothesis randomized input generator injecting 500 edge permutations into divide().",
      metric: "500/500 Invariants Held",
      subMetric: "0 Assertion Failures",
      duration: "0.32s",
      status: "PASS",
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "4. Mutation Testing (MutPy / Cosmic-Ray)",
      description:
        "Artificial syntactic mutants injected (e.g. replacing != with ==, mutating literals).",
      metric: "88.9% Mutation Score",
      subMetric: "16 Killed • 2 Survived",
      duration: "0.85s",
      status: "HIGH CONFIDENCE",
      color: "text-indigo-400",
      borderColor: "border-indigo-500/30",
      bgColor: "bg-indigo-500/10",
    },
  ];

  return (
    <section id="patch-verification" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>4-Pillar Sandbox Verification</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Multi-Tier Patch Verification
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-400 font-sans">
            Every proposed repair passes through sterile container sandboxes with network
            isolation, property-based input generators, and mutation testing before it is declared
            verified.
          </p>
        </div>

        {/* Global Verification Verdict Banner */}
        <div className="bg-[#0b0e1b] rounded-2xl border border-emerald-500/40 p-6 md:p-8 shadow-2xl shadow-emerald-950/20 mb-8 font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-white font-sans">
                    Overall Validation Verdict:
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                    VERIFIED
                  </span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  Sterile Docker Sandbox: --network=none • memory=512m • timeout=120s
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-right">
              <div>
                <span className="text-slate-400 text-[11px] block">Total Duration</span>
                <span className="text-white font-bold text-sm">1.22s</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Regression Rate</span>
                <span className="text-emerald-400 font-bold text-sm">0.0%</span>
              </div>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {verificationPillars.map((p, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${p.borderColor} ${p.bgColor} space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{p.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-emerald-400 font-bold border border-emerald-500/20">
                    {p.status}
                  </span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className={`text-xl font-bold ${p.color}`}>{p.metric}</span>
                  <span className="text-slate-400 text-[11px]">({p.subMetric})</span>
                </div>

                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  {p.description}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Runtime: {p.duration}
                  </span>
                  <span className="text-emerald-400 font-medium">Sandbox Verified</span>
                </div>
              </div>
            ))}
          </div>

          {/* Before/After Test Summary Bar */}
          <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#121626] border border-white/5">
              <span className="text-[11px] text-red-400 uppercase font-bold block mb-1">
                Before Repair (Original Code)
              </span>
              <div className="text-slate-300">
                <strong className="text-emerald-400">6 passed</strong>,{" "}
                <strong className="text-red-400">2 failed</strong> (8 total)
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0e1a1e] border border-emerald-500/20">
              <span className="text-[11px] text-emerald-400 uppercase font-bold block mb-1">
                After Repair (Patched Sandbox)
              </span>
              <div className="text-slate-300">
                <strong className="text-emerald-400">8 passed</strong>,{" "}
                <strong className="text-slate-500">0 failed</strong> (100% Pass Rate)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
