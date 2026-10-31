import React, { useState } from "react";
import {
  Lightbulb,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shield,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  FileCode,
} from "lucide-react";

interface HypothesisItem {
  id: string;
  title: string;
  fileLocation: string;
  explanation: string;
  evidence: string;
  confidence: number; // 0 to 1
  validationMethod: string;
  status: "VERIFIED" | "VALIDATED" | "EXPLORING" | "REJECTED";
  riskLevel: "Low" | "Medium" | "High";
  branchColor: string;
}

export const MultiHypothesisSection: React.FC = () => {
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string>("hypo-1");

  const hypotheses: HypothesisItem[] = [
    {
      id: "hypo-1",
      title: "Missing Guard for Zero Divisor in divide()",
      fileLocation: "main.py:12",
      explanation:
        "The divide() function takes parameters (a, b) and performs arithmetic division `a / b` directly without evaluating whether `b == 0.0`. When `b == 0`, CPython raises ZeroDivisionError crashing any caller expecting numeric return or typed exception.",
      evidence:
        "Test `tests/test_main.py::test_divide_by_zero` fails with unhandled `ZeroDivisionError: float division by zero`. AST shows no If-node checking denominator.",
      confidence: 0.94,
      validationMethod:
        "Synthesize explicit `if b == 0: raise ValueError(...)` pre-condition and execute test_divide_by_zero in isolated container.",
      status: "VERIFIED",
      riskLevel: "Low",
      branchColor: "from-purple-500 to-cyan-400",
    },
    {
      id: "hypo-2",
      title: "Zero Division on Empty Collection in calculate_average()",
      fileLocation: "main.py:19",
      explanation:
        "The function calculates `total = sum(numbers)` and divides by `len(numbers)`. If an empty list `[]` is provided, `len(numbers)` is 0, causing `0 / 0` which raises ZeroDivisionError.",
      evidence:
        "Pytest test trace: `calculate_average([])` throws `ZeroDivisionError: float division by zero` on line 19.",
      confidence: 0.88,
      validationMethod:
        "Add boundary condition check `if not numbers: return 0.0` or raise empty error. Re-run test suite.",
      status: "VERIFIED",
      riskLevel: "Low",
      branchColor: "from-indigo-500 to-purple-400",
    },
    {
      id: "hypo-3",
      title: "Bare Except Swallows Critical Process Signals in parse_user_config()",
      fileLocation: "main.py:28",
      explanation:
        "The function uses a bare `except:` block. In Python, bare except catches `BaseException`, inadvertently intercepting `KeyboardInterrupt`, `SystemExit`, and out-of-memory signals.",
      evidence:
        "Static AST parsing flags bare `ExceptHandler(type=None)`. Ruff static analyzer rule E722: 'Do not use bare `except`'.",
      confidence: 0.76,
      validationMethod:
        "Refactor to catch specific `(json.JSONDecodeError, ValueError)` and ensure SIGINT passes through cleanly.",
      status: "VALIDATED",
      riskLevel: "Medium",
      branchColor: "from-cyan-500 to-emerald-400",
    },
  ];

  const current = hypotheses.find((h) => h.id === selectedHypothesisId) || hypotheses[0];

  return (
    <section id="multi-hypothesis" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-4">
            <GitBranch className="w-3.5 h-3.5 text-purple-400" />
            <span>Multi-Hypothesis Reasoning Engine</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Hypothesis Tree Exploration
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-400 font-sans">
            Rather than jumping to conclusions, the agent branches into competing root-cause
            hypotheses, evaluates code evidence, computes Bayesian confidence, and systematically
            validates each through targeted sandbox experiments.
          </p>
        </div>

        {/* Interactive Branching Visualization Tree */}
        <div className="bg-[#0b0e1b] rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl mb-8">
          {/* Root Bug Node */}
          <div className="flex flex-col items-center">
            <div className="px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 font-mono text-xs font-bold flex items-center space-x-2 shadow-lg shadow-red-500/10">
              <Target className="w-4 h-4 text-red-400" />
              <span>Root Fault Site: main.py (ZeroDivision &amp; Exception Handling)</span>
            </div>

            {/* Connecting Trunk Line */}
            <div className="w-0.5 h-8 bg-gradient-to-b from-red-500 to-purple-500 my-1" />

            {/* Branching Junction */}
            <div className="relative w-full max-w-3xl">
              <div className="h-0.5 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 opacity-60 rounded-full" />
            </div>

            {/* 3 Branch Leaves */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
              {hypotheses.map((h, idx) => {
                const isSelected = selectedHypothesisId === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHypothesisId(h.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#141829] border-purple-400 shadow-xl shadow-purple-500/15 scale-[1.02]"
                        : "bg-[#0d101e] border-white/10 hover:border-white/20 hover:bg-[#101326]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                          Branch #{idx + 1}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            h.status === "VERIFIED"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : "bg-purple-500/15 text-purple-300 border-purple-500/30"
                          }`}
                        >
                          {h.status}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-white font-mono mb-2 line-clamp-2">
                        {h.title}
                      </h3>

                      <p className="text-[11px] text-slate-400 font-sans line-clamp-3">
                        {h.explanation}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{h.fileLocation}</span>
                      <span className="text-cyan-400 font-bold">
                        {(h.confidence * 100).toFixed(0)}% Conf.
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Hypothesis Deep Dive Panel */}
        <div className="bg-[#0e1222] rounded-2xl border border-purple-500/30 p-6 md:p-8 shadow-2xl font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 mb-6 gap-3">
            <div>
              <div className="flex items-center space-x-2 text-purple-400 font-semibold mb-1">
                <Lightbulb className="w-4 h-4" />
                <span>Selected Root-Cause Hypothesis</span>
              </div>
              <h3 className="text-base font-bold text-white font-sans">{current.title}</h3>
            </div>

            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                Confidence: {(current.confidence * 100).toFixed(0)}%
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                {current.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">
                  Root Cause Explanation:
                </span>
                <p className="text-slate-200 font-sans text-sm leading-relaxed bg-[#080a12] p-3.5 rounded-xl border border-white/5">
                  {current.explanation}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">
                  Target Code Location:
                </span>
                <div className="flex items-center space-x-2 text-cyan-400 bg-[#080a12] p-2.5 rounded-xl border border-white/5">
                  <FileCode className="w-4 h-4" />
                  <span>{current.fileLocation}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">
                  Supporting Code &amp; Test Evidence:
                </span>
                <p className="text-slate-300 font-mono text-xs bg-[#080a12] p-3.5 rounded-xl border border-white/5 leading-relaxed">
                  {current.evidence}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">
                  Validation &amp; Verification Protocol:
                </span>
                <p className="text-emerald-400 font-mono text-xs bg-[#080a12] p-3 rounded-xl border border-emerald-500/20 leading-relaxed">
                  &gt; {current.validationMethod}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
