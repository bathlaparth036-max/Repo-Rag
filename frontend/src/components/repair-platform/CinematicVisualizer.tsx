import React, { useState, useEffect } from "react";
import {
  FileCode,
  Network,
  Bug,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Zap,
  Maximize2,
  X,
  Code2,
  Cpu,
} from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  type: "entry" | "module" | "test" | "util";
  x: number; // percentage
  y: number; // percentage
  lines: number;
  complexity: number;
  suspicionScore: number; // 0 to 1
  status: "analyzed" | "active" | "flagged" | "verified";
  dependencies: string[];
  description: string;
  snippet: string;
}

interface CinematicVisualizerProps {
  isAnalyzing: boolean;
  activeStageIndex: number;
}

export const CinematicVisualizer: React.FC<CinematicVisualizerProps> = ({
  isAnalyzing,
  activeStageIndex,
}) => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string>("main.py");
  const [logs, setLogs] = useState<string[]>([
    "[$] Initializing RepoRAG Autonomous Repair Subsystem...",
    "[$] Cloning repository into isolated sandbox...",
    "[$] Ingesting abstract syntax tree (AST) via multi-language parser...",
    "[$] Discovered 4 source files, 1 test harness (pytest).",
    "[$] Running Spectrum-Based Fault Localization (Ochiai coefficient)...",
    "[$] WARNING: Suspicious statement detected at main.py:12 (Score: 0.94)",
    "[$] Synthesizing 2 cause-level root hypotheses...",
    "[$] Isolated sandbox patch testing initiated (Docker read-only)...",
  ]);

  const nodes: NodeData[] = [
    {
      id: "main.py",
      name: "main.py",
      type: "entry",
      x: 35,
      y: 40,
      lines: 59,
      complexity: 7,
      suspicionScore: 0.94,
      status: "flagged",
      dependencies: ["utils.py", "tests/test_main.py"],
      description: "Core execution entrypoint. Contains calculation and batch processors.",
      snippet: `def divide(a: float, b: float) -> float:\n    # BUG: No zero-division guard\n    return a / b\n\ndef calculate_average(numbers: List[float]):\n    total = sum(numbers)\n    return total / len(numbers) # ZeroDivisionError`,
    },
    {
      id: "utils.py",
      name: "utils.py",
      type: "util",
      x: 65,
      y: 35,
      lines: 40,
      complexity: 4,
      suspicionScore: 0.32,
      status: "analyzed",
      dependencies: ["main.py"],
      description: "Data utility functions: flatten list, word counter, and string sanitizer.",
      snippet: `def safe_get(data: dict, key: str, default: Any = None) -> Any:\n    return data.get(key, default)\n\ndef truncate_string(text: str, max_length: int = 100) -> str:\n    if len(text) <= max_length: return text\n    return text[:max_length - 3] + "..."`,
    },
    {
      id: "tests/test_main.py",
      name: "tests/test_main.py",
      type: "test",
      x: 25,
      y: 75,
      lines: 72,
      complexity: 3,
      suspicionScore: 0.0,
      status: "verified",
      dependencies: ["main.py"],
      description: "Pytest test suite. 6 passing tests, 2 failing tests triggering ZeroDivisionError.",
      snippet: `def test_divide_by_zero():\n    # Fails under unpatched code\n    with pytest.raises(ValueError):\n        divide(10, 0)`,
    },
    {
      id: "config.py",
      name: "config.py",
      type: "module",
      x: 75,
      y: 70,
      lines: 28,
      complexity: 2,
      suspicionScore: 0.12,
      status: "analyzed",
      dependencies: ["main.py"],
      description: "Runtime environment and parser settings configuration.",
      snippet: `APP_CONFIG = {\n    "batch_size": 10,\n    "timeout_seconds": 30,\n    "sandbox_mode": True\n}`,
    },
  ];

  // Rotate active analyzing node every 3s if analyzing
  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setActiveNodeId((prev) => {
        if (prev === "main.py") return "utils.py";
        if (prev === "utils.py") return "tests/test_main.py";
        if (prev === "tests/test_main.py") return "config.py";
        return "main.py";
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  return (
    <section id="neural-visualizer" className="py-12 md:py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-4">
            <Network className="w-3.5 h-3.5" />
            <span>Interactive Repository Neural Map</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
            AI Codebase Exploration &amp; Scan
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-400 font-sans">
            Observe the autonomous agent traverse unfamiliar dependencies, map modules, and pinpoint
            the exact statements correlating with test failures.
          </p>
        </div>

        {/* Visualizer Canvas & Console Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Visualizer Network Canvas */}
          <div className="lg:col-span-8 relative h-[440px] md:h-[500px] bg-[#0c101c] rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-4 flex flex-col justify-between">
            {/* Ambient Background Grid & Radar Sweep */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e2746_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-cyan-500/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full border border-purple-500/10 pointer-events-none" />

            {/* Glowing Scanning Laser Line */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-scan pointer-events-none opacity-60" />

            {/* Top Toolbar */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-400 bg-[#070911]/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-slate-200 font-semibold">Active Scan:</span>
                <span className="text-cyan-400">{activeNodeId}</span>
              </div>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="text-slate-400">4 Modules Mapped</span>
                <span>•</span>
                <span className="text-purple-400">Ochiai Localizer</span>
              </div>
            </div>

            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* main.py -> utils.py */}
              <line
                x1="35%"
                y1="40%"
                x2="65%"
                y2="35%"
                stroke="#4facfe"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="opacity-40"
              />
              {/* main.py -> test_main.py */}
              <line
                x1="35%"
                y1="40%"
                x2="25%"
                y2="75%"
                stroke="#ff5470"
                strokeWidth="2"
                strokeDasharray="6 3"
                className="opacity-70 animate-pulse"
              />
              {/* main.py -> config.py */}
              <line
                x1="35%"
                y1="40%"
                x2="75%"
                y2="70%"
                stroke="#7f5af0"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-40"
              />
            </svg>

            {/* Interactive Graph Nodes */}
            <div className="relative z-10 w-full h-full">
              {nodes.map((node) => {
                const isActive = activeNodeId === node.id;
                const isHovered = hoveredNode?.id === node.id;
                const isFlagged = node.status === "flagged";

                return (
                  <div
                    key={node.id}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Pulsing Aura if Active or Flagged */}
                    {(isActive || isFlagged) && (
                      <div
                        className={`absolute -inset-2 rounded-2xl blur-md opacity-50 ${
                          isFlagged ? "bg-red-500/30" : "bg-cyan-500/30"
                        }`}
                      />
                    )}

                    {/* Node Card */}
                    <div
                      className={`relative flex items-center space-x-2.5 px-3 py-2 rounded-xl backdrop-blur-md border text-xs font-mono transition-transform duration-200 ${
                        isHovered ? "scale-110 z-30" : "scale-100"
                      } ${
                        isFlagged
                          ? "bg-[#18111d] border-red-500/60 text-red-200 shadow-lg shadow-red-500/20"
                          : isActive
                          ? "bg-[#0f172a] border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20"
                          : "bg-[#0d1222]/90 border-white/10 text-slate-300 hover:border-white/30"
                      }`}
                    >
                      {isFlagged ? (
                        <Bug className="w-4 h-4 text-red-400 shrink-0" />
                      ) : node.type === "test" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}

                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{node.name}</span>
                          {isFlagged && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-red-500/30 text-red-300">
                              SBFL: {node.suspicionScore}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {node.lines} LOC • {node.complexity} CC
                        </div>
                      </div>
                    </div>

                    {/* Hover Tooltip Card */}
                    {isHovered && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-2.5 rounded-xl bg-[#090b14] border border-white/20 shadow-2xl text-[11px] font-mono z-40 text-slate-300 pointer-events-none">
                        <div className="text-white font-bold mb-1 flex items-center justify-between">
                          <span>{node.name}</span>
                          <span className="text-cyan-400 uppercase text-[9px]">{node.type}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight mb-2">
                          {node.description}
                        </p>
                        <div className="flex justify-between text-[10px] pt-1.5 border-t border-white/10 text-slate-400">
                          <span>Suspicion: {node.suspicionScore * 100}%</span>
                          <span className="text-cyan-400 font-semibold">Click to view AST</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Status bar */}
            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
              <span>Hover node for stats • Click node to inspect code snippet</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ochiai Matrix Mapped
              </span>
            </div>
          </div>

          {/* Right Column: Live Analysis Console Stream */}
          <div className="lg:col-span-4 flex flex-col h-[440px] md:h-[500px] bg-[#0c101c] rounded-2xl border border-white/10 p-4 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 font-semibold">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>Live Analysis Console</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Streaming
              </span>
            </div>

            {/* Console Lines */}
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs text-slate-400 pr-1">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg text-[11px] leading-relaxed transition ${
                    log.includes("WARNING") || log.includes("Suspicious")
                      ? "bg-red-500/10 text-red-300 border border-red-500/30"
                      : log.includes("Synthesizing")
                      ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      : "bg-[#090c15] text-slate-300 border border-white/5"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>

            {/* Live Progress Bar at bottom */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span>Phase: Spectrum Fault Localization</span>
                <span className="text-cyan-400 font-bold">Stage {activeStageIndex + 1}/9</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (activeStageIndex + 1) * 11.1)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Node Detail Drawer / Modal (When Clicked) */}
        {selectedNode && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e121f] border border-white/20 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 font-mono">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center space-x-2.5">
                  <FileCode className="w-5 h-5 text-cyan-400" />
                  <span className="text-base font-bold text-white">{selectedNode.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      selectedNode.status === "flagged"
                        ? "bg-red-500/20 text-red-400 border border-red-500/40"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    }`}
                  >
                    {selectedNode.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <p className="text-slate-300">{selectedNode.description}</p>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-[#080a11] border border-white/10">
                    <span className="text-slate-500 text-[10px] block">Lines of Code</span>
                    <span className="text-sm font-bold text-white">{selectedNode.lines}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#080a11] border border-white/10">
                    <span className="text-slate-500 text-[10px] block">Complexity (CC)</span>
                    <span className="text-sm font-bold text-purple-400">
                      {selectedNode.complexity}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#080a11] border border-white/10">
                    <span className="text-slate-500 text-[10px] block">Ochiai Suspicion</span>
                    <span
                      className={`text-sm font-bold ${
                        selectedNode.suspicionScore > 0.5 ? "text-red-400" : "text-emerald-400"
                      }`}
                    >
                      {selectedNode.suspicionScore * 100}%
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Code Snippet:</span>
                  <pre className="p-3 rounded-lg bg-[#05070e] border border-white/10 text-[11px] leading-relaxed text-slate-300 overflow-x-auto max-h-48">
                    {selectedNode.snippet}
                  </pre>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
