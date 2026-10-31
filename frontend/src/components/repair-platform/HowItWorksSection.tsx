import React from "react";
import {
  FolderGit2,
  Code2,
  Target,
  Lightbulb,
  Wrench,
  ShieldCheck,
  UserCheck,
  ArrowDown,
  Sparkles,
  Layers,
  ChevronDown,
} from "lucide-react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Repository Ingestion",
      subtitle: "Shallow Clone & Syntax Indexing",
      description:
        "RepoRAG ingests any unfamiliar public GitHub repository via Git shallow cloning. It bypasses rate limits, strips non-essential vendor directories, and creates a clean working directory.",
      icon: FolderGit2,
      accent: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    },
    {
      num: "02",
      title: "Code Understanding",
      subtitle: "Multi-Language AST & Graph Construction",
      description:
        "The parser extracts class structures, function signatures, docstrings, and cross-file import connections, building a 2D knowledge graph of the software architecture.",
      icon: Code2,
      accent: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    },
    {
      num: "03",
      title: "Fault Localization",
      subtitle: "Spectrum-Based Ochiai Statistical Scoring",
      description:
        "Tests are executed under isolated tracing. Statement execution frequencies during failing runs vs passing runs are scored using the Ochiai coefficient to mathematically pinpoint faulty lines.",
      icon: Target,
      accent: "text-red-400 border-red-500/30 bg-red-500/10",
    },
    {
      num: "04",
      title: "Hypothesis Testing",
      subtitle: "Multi-Reasoning Bayesian Branching",
      description:
        "The agent explores 2-3 competing root-cause hypotheses per bug, associating code evidence, assessing risk, and defining precise validation criteria before modifying code.",
      icon: Lightbulb,
      accent: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
    },
    {
      num: "05",
      title: "Patch Generation",
      subtitle: "Semantic AST Diffs (Anti-Overfitting)",
      description:
        "Candidate fixes are synthesized at the cause-level. The agent generates minimal, focused unified diffs and validates their syntactic validity through AST compilers.",
      icon: Wrench,
      accent: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    },
    {
      num: "06",
      title: "Verification Sandbox",
      subtitle: "Regression, Property & Mutation Testing",
      description:
        "Patches are applied to isolated copies and verified in read-only Docker containers. Regression suites, 500-input property fuzzers, and mutation scoring ensure real repair.",
      icon: ShieldCheck,
      accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      num: "07",
      title: "Maintainer Review",
      subtitle: "Reviewer-Ready Explanations & 1-Click PR",
      description:
        "The agent presents the root cause, patch diff, and verification audit trail to human maintainers for one-click approval and merging.",
      icon: UserCheck,
      accent: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>End-to-End Autonomous Pipeline</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
            How It Works
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-400 font-sans">
            A step-by-step tour through the autonomous software repair lifecycle—from unfamiliar
            repository to test-validated, reviewer-ready pull request.
          </p>
        </div>

        {/* Step Flow with Connected Line */}
        <div className="relative">
          {/* Vertical Connecting Line */}
          <div className="hidden md:block absolute left-1/2 top-8 bottom-8 -translate-x-1/2 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 opacity-30" />

          <div className="space-y-12 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={step.num}
                  className={`flex flex-col md:flex-row items-center gap-6 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content Card */}
                  <div className="w-full md:w-1/2">
                    <div
                      className={`p-6 rounded-2xl bg-[#0b0e1b] border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl ${
                        isEven ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 mb-2 ${
                          isEven ? "md:justify-end" : "md:justify-start"
                        }`}
                      >
                        <span className="font-mono text-xs font-bold text-slate-500">
                          STAGE {step.num}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs font-mono font-semibold text-cyan-400">
                          {step.subtitle}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white font-sans mb-2">{step.title}</h3>

                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Central Node Circle */}
                  <div className="relative z-10 flex items-center justify-center shrink-0">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${step.accent}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Empty Spacer on Opposite Side */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
