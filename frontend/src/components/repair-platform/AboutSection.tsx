import React from "react";
import {
  BookOpen,
  GraduationCap,
  Globe,
  ShieldCheck,
  Cpu,
  HeartHandshake,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-4">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Research &amp; Capstone Project</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
            About the Project
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-400 font-sans">
            Autonomous Software Repair for Public-Interest Infrastructure: Solving the open-source
            maintainer burnout crisis through statistically verified AI agents.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card 1: The Problem */}
          <div className="p-6 rounded-2xl bg-[#0b0e1b] border border-white/10 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-sans">
              The Open-Source Maintenance Crisis
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Critical public infrastructure—from web servers to hospital scheduling and supply
              chains—depends on open-source libraries maintained by unpaid volunteers. Maintainers
              face severe burnout triage latency, leaving vulnerabilities unpatched for months.
            </p>
          </div>

          {/* Card 2: Autonomous AI Repair */}
          <div className="p-6 rounded-2xl bg-[#0b0e1b] border border-white/10 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-sans">
              Statistical Localization + LLM Reasoning
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              RepoRAG combines mathematical Spectrum-Based Fault Localization (Ochiai) with Bayesian
              root-cause hypothesis exploration. Rather than generating random code, it reasons
              about fault boundaries and generates minimal, cause-level AST patches.
            </p>
          </div>

          {/* Card 3: Why Verification Matters */}
          <div className="p-6 rounded-2xl bg-[#0b0e1b] border border-white/10 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-sans">
              Anti-Overfitting &amp; Sandboxing
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              LLM code repairs frequently overfit to specific test assertions. RepoRAG synthesizes
              new regression tests, runs 500-input property fuzzers, and tests against mutated ASTs
              in network-isolated Docker containers to ensure true generalization.
            </p>
          </div>

          {/* Card 4: Reviewer-Ready Explanations */}
          <div className="p-6 rounded-2xl bg-[#0b0e1b] border border-white/10 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-sans">
              Human-in-the-Loop Transparency
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              The AI never silently forces code into production. It presents maintainers with clear
              explanations of the root cause, why the fix works, test evidence, and remaining
              trade-offs for single-click approval.
            </p>
          </div>
        </div>

        {/* United Nations Sustainable Development Goals (SDGs) */}
        <div className="p-6 md:p-8 rounded-2xl bg-[#0e1324] border border-indigo-500/30 shadow-2xl font-mono text-xs">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold uppercase tracking-wider mb-4">
            <Globe className="w-4 h-4" />
            <span>United Nations Sustainable Development Goals Alignment</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SDG 9 */}
            <div className="p-4 rounded-xl bg-[#090b14] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-sans">
                  SDG 9: Industry, Innovation &amp; Infrastructure
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                  Target 9.5
                </span>
              </div>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">
                Strengthening resilient global digital infrastructure. By automating the repair of
                critical open-source software, RepoRAG prevents infrastructure breakdowns and
                reduces maintenance costs for public-interest platforms.
              </p>
            </div>

            {/* SDG 16 */}
            <div className="p-4 rounded-xl bg-[#090b14] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-sans">
                  SDG 16: Peace, Justice &amp; Strong Institutions
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                  Target 16.6
                </span>
              </div>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">
                Building transparent, accountable, and auditable institutions. RepoRAG enforces
                complete audit trails and explainable reviewer justifications, ensuring public
                software systems remain reliable, trustworthy, and accountable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
