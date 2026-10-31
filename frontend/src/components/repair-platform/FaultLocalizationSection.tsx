import React, { useState } from "react";
import {
  Target,
  FileCode,
  Bug,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
  ChevronRight,
  Code2,
  AlertTriangle,
  Info,
} from "lucide-react";

interface SuspiciousLocation {
  file: string;
  line: number;
  symbol: string;
  ochiaiScore: number;
  tarantulaScore: number;
  failingTestsExecuted: number;
  passingTestsExecuted: number;
  category: string;
  explanation: string;
  codeSnippet: string[];
}

export const FaultLocalizationSection: React.FC = () => {
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number>(0);

  const locations: SuspiciousLocation[] = [
    {
      file: "main.py",
      line: 12,
      symbol: "divide(a, b)",
      ochiaiScore: 0.94,
      tarantulaScore: 0.92,
      failingTestsExecuted: 2,
      passingTestsExecuted: 0,
      category: "ZeroDivisionError",
      explanation:
        "Statement 'return a / b' executed during 2 failing test runs (test_divide_by_zero) and 0 passing test runs. Has highest Ochiai failure correlation in the repository.",
      codeSnippet: [
        "def divide(a: float, b: float) -> float:",
        "    \"\"\"Divide a by b.\"\"\"",
        "    # BUG: No zero-division guard",
        "    return a / b  # <-- FLAGGED: Ochiai 0.94",
      ],
    },
    {
      file: "main.py",
      line: 19,
      symbol: "calculate_average(numbers)",
      ochiaiScore: 0.88,
      tarantulaScore: 0.85,
      failingTestsExecuted: 1,
      passingTestsExecuted: 1,
      category: "EmptyCollectionError",
      explanation:
        "Crashes with ZeroDivisionError when passed an empty list `[]`. len(numbers) evaluates to 0 without guard.",
      codeSnippet: [
        "def calculate_average(numbers: List[float]) -> float:",
        "    \"\"\"Calculate the average of a list of numbers.\"\"\"",
        "    # BUG: crashes on empty list (ZeroDivisionError)",
        "    total = sum(numbers)",
        "    return total / len(numbers)  # <-- FLAGGED: Ochiai 0.88",
      ],
    },
    {
      file: "main.py",
      line: 28,
      symbol: "parse_user_config(config_string)",
      ochiaiScore: 0.76,
      tarantulaScore: 0.72,
      failingTestsExecuted: 1,
      passingTestsExecuted: 2,
      category: "BareExceptPattern",
      explanation:
        "Bare 'except:' statement catches BaseException, SystemExit, and KeyboardInterrupt, concealing fatal runtime aborts.",
      codeSnippet: [
        "    try:",
        "        data = json.loads(config_string)",
        "        return data",
        "    except:  # <-- FLAGGED: Ochiai 0.76 (Bare except)",
        "        return {}",
      ],
    },
    {
      file: "main.py",
      line: 44,
      symbol: "merge_records(defaults, overrides)",
      ochiaiScore: 0.65,
      tarantulaScore: 0.60,
      failingTestsExecuted: 1,
      passingTestsExecuted: 3,
      category: "MutableDefaultArgument",
      explanation:
        "Default parameter 'overrides: dict = {}' persists state across repeated function invocations causing mutation contamination.",
      codeSnippet: [
        "def merge_records(defaults: dict, overrides: dict = {}) -> dict:",
        "    # BUG: mutable default argument — shared across calls",
        "    defaults.update(overrides)  # <-- FLAGGED: Ochiai 0.65",
        "    return defaults",
      ],
    },
  ];

  const current = locations[selectedLocationIndex];

  return (
    <section id="fault-localization" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono mb-4">
            <Target className="w-3.5 h-3.5 text-red-400" />
            <span>Spectrum-Based Fault Localization (SBFL)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Mathematical Fault Localization
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-400 font-sans">
            Instead of guessing, RepoRAG executes test suites with coverage tracing and applies the
            statistical <span className="text-white font-mono">Ochiai</span> metric to rank
            suspicious statements before triggering LLM repairs.
          </p>

          {/* Formula Callout */}
          <div className="mt-4 inline-block px-4 py-2 rounded-xl bg-[#0b0e1b] border border-white/10 text-xs font-mono text-slate-300 shadow-md">
            <span className="text-purple-400 font-semibold">Ochiai Formula:</span>{" "}
            <span className="text-slate-200">
              Suspiciousness(s) = failed(s) / &radic;(total_failed &times; (failed(s) + passed(s)))
            </span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Ranked Suspicious Locations Heatmap List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="font-semibold uppercase tracking-wider">Ranked Suspicious Sites</span>
              <span>Ochiai Score</span>
            </div>

            {locations.map((loc, idx) => {
              const isSelected = selectedLocationIndex === idx;
              const isCritical = loc.ochiaiScore >= 0.85;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedLocationIndex(idx)}
                  className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#141829] border-red-500/80 shadow-lg shadow-red-500/10"
                      : "bg-[#0c101c] border-white/10 hover:border-white/20 hover:bg-[#101424]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center font-mono text-[11px] text-slate-400 font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-mono text-xs font-bold text-white">
                        {loc.file}:{loc.line}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <Flame
                        className={`w-3.5 h-3.5 ${
                          isCritical ? "text-red-400 animate-pulse" : "text-yellow-400"
                        }`}
                      />
                      <span
                        className={`font-mono text-xs font-bold ${
                          isCritical ? "text-red-400" : "text-yellow-400"
                        }`}
                      >
                        {(loc.ochiaiScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 font-mono pl-7 mb-2">
                    {loc.symbol}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pl-7 pt-1.5 border-t border-white/5">
                    <span className="text-red-400">Failed Tests: {loc.failingTestsExecuted}</span>
                    <span className="text-slate-400">Passed Tests: {loc.passingTestsExecuted}</span>
                    <span className="text-purple-400">{loc.category}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Code Preview & Ochiai Diagnostics */}
          <div className="lg:col-span-7 space-y-4">
            {/* Editor Box */}
            <div className="bg-[#0b0e1b] rounded-2xl border border-white/10 p-5 shadow-2xl font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-white">{current.file}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">Line {current.line}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">
                  SBFL Hotspot
                </span>
              </div>

              {/* Code Snippet lines */}
              <div className="bg-[#060810] rounded-xl p-4 border border-white/5 space-y-1 overflow-x-auto text-slate-300">
                {current.codeSnippet.map((codeLine, li) => {
                  const isFlaggedLine = codeLine.includes("FLAGGED");
                  return (
                    <div
                      key={li}
                      className={`py-1 px-2 rounded flex items-center space-x-3 ${
                        isFlaggedLine
                          ? "bg-red-500/15 text-red-300 border-l-2 border-red-500 font-semibold"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <span className="text-slate-600 select-none w-5 text-right text-[10px]">
                        {current.line - 2 + li}
                      </span>
                      <span className="flex-1 whitespace-pre">{codeLine}</span>
                    </div>
                  );
                })}
              </div>

              {/* Statistical Test Coverage Matrix */}
              <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-lg bg-[#121629]">
                  <span className="text-slate-500 block">Ochiai Coefficient</span>
                  <span className="text-sm font-bold text-red-400 font-mono">
                    {current.ochiaiScore}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#121629]">
                  <span className="text-slate-500 block">Tarantula Ratio</span>
                  <span className="text-sm font-bold text-purple-400 font-mono">
                    {current.tarantulaScore}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#121629]">
                  <span className="text-slate-500 block">Failing Runs Hit</span>
                  <span className="text-sm font-bold text-red-400 font-mono">
                    {current.failingTestsExecuted} runs
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#121629]">
                  <span className="text-slate-500 block">Passing Runs Hit</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {current.passingTestsExecuted} runs
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnostic Reason Panel */}
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-slate-300">
              <div className="flex items-center space-x-2 text-purple-300 font-bold mb-1.5">
                <Info className="w-4 h-4 text-purple-400" />
                <span>Localization Diagnosis</span>
              </div>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {current.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
