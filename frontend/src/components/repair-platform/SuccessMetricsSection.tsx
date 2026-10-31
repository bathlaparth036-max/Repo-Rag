import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  Clock,
  ShieldCheck,
  Zap,
  DollarSign,
  CheckCircle2,
  Filter,
  Calendar,
  Layers,
} from "lucide-react";

export const SuccessMetricsSection: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<"7d" | "30d" | "all">("30d");
  const [activeChart, setActiveChart] = useState<"repairs" | "mutation">("repairs");

  const metrics = [
    {
      title: "Verified Bugs Resolved",
      value: "56",
      delta: "+18 this month",
      color: "text-cyan-400",
      icon: CheckCircle2,
      description: "Tested and validated in isolated containers",
    },
    {
      title: "Regression Rate",
      value: "0.0%",
      delta: "Zero regressions",
      color: "text-emerald-400",
      icon: ShieldCheck,
      description: "No breaking behavior introduced",
    },
    {
      title: "Mutation Score",
      value: "88.4%",
      delta: "+13.4% vs industry avg",
      color: "text-purple-400",
      icon: Zap,
      description: "Syntactic mutants killed by tests",
    },
    {
      title: "Cost Per Repair",
      value: "$0.038",
      delta: "96% cheaper than manual",
      color: "text-yellow-400",
      icon: DollarSign,
      description: "Compute-budgeted LLM inference",
    },
    {
      title: "Review Time Saved",
      value: "84%",
      delta: "~4.2 hrs per PR",
      color: "text-indigo-400",
      icon: Clock,
      description: "Maintainer triage and audit acceleration",
    },
  ];

  // SVG Chart points
  const repairTrendData = [
    { day: "Day 1", repairs: 4, mutation: 72 },
    { day: "Day 5", repairs: 11, mutation: 76 },
    { day: "Day 10", repairs: 19, mutation: 81 },
    { day: "Day 15", repairs: 28, mutation: 83 },
    { day: "Day 20", repairs: 39, mutation: 85 },
    { day: "Day 25", repairs: 48, mutation: 87 },
    { day: "Day 30", repairs: 56, mutation: 88.4 },
  ];

  return (
    <section id="success-metrics" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-4">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Empirical Engineering Analytics</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Autonomous Repair Success Metrics
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-400 font-sans">
            Quantifiable benchmarks measuring accuracy, cost-efficiency, regression safety, and
            open-source maintainer review acceleration.
          </p>
        </div>

        {/* 5 Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-8">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-[#0b0e1b] border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-white/20 transition shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-slate-400 font-medium">
                      {m.title}
                    </span>
                    <Icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <div className={`text-2xl md:text-3xl font-extrabold font-mono ${m.color}`}>
                    {m.value}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 font-mono">
                  <span className="text-[10px] text-emerald-400 block font-semibold">
                    {m.delta}
                  </span>
                  <span className="text-[10px] text-slate-500 line-clamp-1">
                    {m.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Chart Container */}
        <div className="bg-[#0b0e1b] rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-3">
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>
                  {activeChart === "repairs"
                    ? "Cumulative Verified Fixes Progression"
                    : "Mutation Testing Score Evolution"}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Evaluation across public GitHub test repositories
              </p>
            </div>

            <div className="flex items-center space-x-3 font-mono text-xs">
              {/* Metric Toggle */}
              <div className="flex rounded-lg bg-white/5 border border-white/10 p-0.5">
                <button
                  onClick={() => setActiveChart("repairs")}
                  className={`px-3 py-1 rounded text-xs transition cursor-pointer ${
                    activeChart === "repairs"
                      ? "bg-cyan-500/20 text-cyan-300 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Repairs
                </button>
                <button
                  onClick={() => setActiveChart("mutation")}
                  className={`px-3 py-1 rounded text-xs transition cursor-pointer ${
                    activeChart === "mutation"
                      ? "bg-purple-500/20 text-purple-300 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Mutation Score
                </button>
              </div>

              {/* Time Filter */}
              <div className="flex rounded-lg bg-white/5 border border-white/10 p-0.5">
                {(["7d", "30d", "all"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-2.5 py-1 rounded text-xs uppercase transition cursor-pointer ${
                      timeFilter === t
                        ? "bg-white/15 text-white font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SVG Trend Chart Visualization */}
          <div className="mt-6 relative h-64 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 220">
              <defs>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7f5af0" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#7f5af0" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="#1c2237" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#1c2237" strokeDasharray="3 3" />
              <line x1="0" y1="160" x2="700" y2="160" stroke="#1c2237" strokeDasharray="3 3" />
              <line x1="0" y1="210" x2="700" y2="210" stroke="#1c2237" />

              {/* Y-axis Labels */}
              <text x="5" y="35" fill="#64748b" fontSize="10" fontFamily="monospace">
                {activeChart === "repairs" ? "60 fixes" : "100%"}
              </text>
              <text x="5" y="95" fill="#64748b" fontSize="10" fontFamily="monospace">
                {activeChart === "repairs" ? "30 fixes" : "75%"}
              </text>
              <text x="5" y="155" fill="#64748b" fontSize="10" fontFamily="monospace">
                {activeChart === "repairs" ? "15 fixes" : "50%"}
              </text>

              {/* Area & Line */}
              {activeChart === "repairs" ? (
                <>
                  <path
                    d="M 50 200 L 150 170 L 250 140 L 350 100 L 450 65 L 550 40 L 650 25 L 650 210 L 50 210 Z"
                    fill="url(#cyanGrad)"
                  />
                  <path
                    d="M 50 200 L 150 170 L 250 140 L 350 100 L 450 65 L 550 40 L 650 25"
                    fill="none"
                    stroke="#00f2fe"
                    strokeWidth="3"
                  />
                  {/* Data Points */}
                  {[
                    { cx: 50, cy: 200, val: "4" },
                    { cx: 150, cy: 170, val: "11" },
                    { cx: 250, cy: 140, val: "19" },
                    { cx: 350, cy: 100, val: "28" },
                    { cx: 450, cy: 65, val: "39" },
                    { cx: 550, cy: 40, val: "48" },
                    { cx: 650, cy: 25, val: "56" },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.cx} cy={pt.cy} r="4" fill="#00f2fe" />
                      <circle cx={pt.cx} cy={pt.cy} r="8" fill="#00f2fe" opacity="0.3" />
                    </g>
                  ))}
                </>
              ) : (
                <>
                  <path
                    d="M 50 120 L 150 105 L 250 90 L 350 82 L 450 75 L 550 65 L 650 55 L 650 210 L 50 210 Z"
                    fill="url(#purpleGrad)"
                  />
                  <path
                    d="M 50 120 L 150 105 L 250 90 L 350 82 L 450 75 L 550 65 L 650 55"
                    fill="none"
                    stroke="#7f5af0"
                    strokeWidth="3"
                  />
                  {[
                    { cx: 50, cy: 120, val: "72%" },
                    { cx: 150, cy: 105, val: "76%" },
                    { cx: 250, cy: 90, val: "81%" },
                    { cx: 350, cy: 82, val: "83%" },
                    { cx: 450, cy: 75, val: "85%" },
                    { cx: 550, cy: 65, val: "87%" },
                    { cx: 650, cy: 55, val: "88.4%" },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.cx} cy={pt.cy} r="4" fill="#7f5af0" />
                      <circle cx={pt.cx} cy={pt.cy} r="8" fill="#7f5af0" opacity="0.3" />
                    </g>
                  ))}
                </>
              )}
            </svg>
          </div>

          {/* Chart Footnote */}
          <div className="mt-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 pt-3 border-t border-white/5">
            <span>Data point source: Autonomous test evaluations across 27+ open-source repos</span>
            <span className="text-cyan-400">Target Benchmark: 85%+ mutation threshold</span>
          </div>
        </div>
      </div>
    </section>
  );
};
