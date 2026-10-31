import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import {
  Bug,
  Wrench,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode,
  GitCompare,
  TestTube,
  Download,
  Loader2,
  ChevronDown,
  ChevronRight,
  Shield,
  Zap,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

/* ──────── types ──────── */
interface RepairJob {
  job_id: string;
  repository_url: string;
  stage: string;
  progress: number;
  message: string;
  error?: string;
  bugs_found: number;
  solutions_generated: number;
  solutions_verified: number;
}

interface DetectedBug {
  bug_id: string;
  title: string;
  category: string;
  severity: string;
  file_path: string;
  line_number: number;
  evidence: string;
  explanation: string;
  detection_method: string;
  confidence: number;
}

interface Hypothesis {
  hypothesis_id: string;
  root_cause: string;
  evidence_from_code: string;
  expected_behavior: string;
  why_problem_occurs: string;
  confidence: number;
  validation_method: string;
}

interface CodeChange {
  file_path: string;
  diff: string;
  change_description: string;
}

interface CandidateSolution {
  solution_id: string;
  explanation: string;
  code_changes: CodeChange[];
  expected_outcome: string;
  potential_side_effects: string[];
  estimated_risk: string;
  verification_status: string;
}

interface TestResult {
  test_name: string;
  passed: boolean;
  error_message?: string;
}

interface TestExecution {
  total_tests: number;
  passed: number;
  failed: number;
  errors: number;
  duration_seconds: number;
  test_results: TestResult[];
  execution_log: string;
  timed_out: boolean;
}

interface SolutionEvaluation {
  solution_id: string;
  overall_score: number;
  verification_status: string;
  syntax_valid: boolean;
  behavioral_correct: boolean;
  reasoning: string;
}

interface RepairReport {
  report_id: string;
  repository_url: string;
  repository_name: string;
  branch: string;
  analysis_timestamp: string;
  detected_bugs: DetectedBug[];
  hypotheses: Hypothesis[];
  candidate_solutions: CandidateSolution[];
  selected_solution?: CandidateSolution;
  evaluations: SolutionEvaluation[];
  verification_status: string;
  original_test_results?: TestExecution;
  final_test_results?: TestExecution;
  summary: string;
  remaining_issues: string[];
}

interface Dashboard {
  total_repositories_analyzed: number;
  total_bugs_detected: number;
  total_repairs_attempted: number;
  verified_repairs: number;
  failed_repairs: number;
  recent_activities: RepairJob[];
}

/* ──────── helpers ──────── */
const SEVERITY_COLORS: Record<string, string> = {
  critical: "text-red-400 bg-red-500/15 border-red-500/30",
  high: "text-orange-400 bg-orange-500/15 border-orange-500/30",
  medium: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30",
  low: "text-blue-400 bg-blue-500/15 border-blue-500/30",
  info: "text-slate-400 bg-slate-500/15 border-slate-500/30",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  VERIFIED: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  PARTIALLY_VERIFIED: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  FAILED: <XCircle className="w-4 h-4 text-red-400" />,
  NOT_VERIFIED: <Shield className="w-4 h-4 text-slate-400" />,
  PENDING: <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />,
};

const STAGE_LABELS: Record<string, string> = {
  IDLE: "Waiting",
  CLONING: "Cloning Repository",
  ANALYZING: "Analyzing Code",
  DETECTING_BUGS: "Detecting Bugs",
  GENERATING_HYPOTHESES: "Generating Hypotheses",
  GENERATING_SOLUTIONS: "Generating Solutions",
  APPLYING_PATCHES: "Applying Patches",
  RUNNING_TESTS: "Running Tests",
  EVALUATING: "Evaluating Solutions",
  GENERATING_REPORT: "Generating Report",
  COMPLETE: "Complete",
  FAILED: "Failed",
};

interface RepairTabProps {
  initialRepoUrl?: string;
}

/* ──────── main component ──────── */
export const RepairTab: React.FC<RepairTabProps> = ({ initialRepoUrl }) => {
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl || "");
  const [branch, setBranch] = useState("main");
  const [token, setToken] = useState(localStorage.getItem("reporag_github_token") || "");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeJob, setActiveJob] = useState<RepairJob | null>(null);
  const [report, setReport] = useState<RepairReport | null>(null);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [expandedBug, setExpandedBug] = useState<string | null>(null);
  const [expandedSolution, setExpandedSolution] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadDashboard();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    if (initialRepoUrl && !repoUrl) {
      setRepoUrl(initialRepoUrl);
    }
  }, [initialRepoUrl]);

  const loadDashboard = async () => {
    try {
      const d = await api.getRepairDashboard();
      setDashboard(d);
    } catch { /* ignore */ }
  };

  const startRepair = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl || repoUrl).trim();
    if (!targetUrl) return;
    setError("");
    setLoading(true);
    setReport(null);
    setActiveSection("progress");
    try {
      const res = await api.startRepair(targetUrl, token || undefined, branch || undefined);
      pollJobStatus(res.job_id);
    } catch (e: any) {
      setError(e.message || "Failed to start repair");
      setLoading(false);
    }
  };

  const pollJobStatus = (jobId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const status = await api.getRepairStatus(jobId);
        setActiveJob(status);
        if (status.stage === "COMPLETE" || status.stage === "FAILED") {
          if (pollRef.current) clearInterval(pollRef.current);
          setLoading(false);
          if (status.stage === "COMPLETE") {
            try {
              const rpt = await api.getRepairReport(jobId);
              if (rpt) { setReport(rpt); setActiveSection("report"); }
            } catch { /* report may not exist */ }
          }
          loadDashboard();
        }
      } catch {
        if (pollRef.current) clearInterval(pollRef.current);
        setLoading(false);
      }
    }, 2000);
  };

  const downloadReport = async () => {
    if (!activeJob) return;
    try {
      const md = await api.getRepairReportMarkdown(activeJob.job_id);
      const blob = new Blob([md], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `repair-report-${activeJob.job_id}.md`;
      a.click(); URL.revokeObjectURL(url);
    } catch { /* ignore */ }
  };

  /* ──────── SUB-SECTIONS ──────── */
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Repos Analyzed", value: dashboard?.total_repositories_analyzed ?? 0, color: "text-cyan-400" },
          { label: "Bugs Detected", value: dashboard?.total_bugs_detected ?? 0, color: "text-orange-400" },
          { label: "Repairs Attempted", value: dashboard?.total_repairs_attempted ?? 0, color: "text-yellow-400" },
          { label: "Verified Fixes", value: dashboard?.verified_repairs ?? 0, color: "text-emerald-400" },
          { label: "Failed Fixes", value: dashboard?.failed_repairs ?? 0, color: "text-red-400" },
        ].map((m) => (
          <div key={m.label} className="bg-card border border-cardBorder rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold font-mono ${m.color}`}>{m.value}</div>
            <div className="text-xs text-slate-400 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      {dashboard && dashboard.recent_activities.length > 0 && (
        <div className="bg-card border border-cardBorder rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Recent Repair Activity</h3>
          <div className="space-y-2">
            {dashboard.recent_activities.map((j) => (
              <div key={j.job_id} className="flex items-center justify-between text-xs bg-background/60 rounded-lg p-3 border border-cardBorder/50">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${j.stage === "COMPLETE" ? "bg-emerald-500/20 text-emerald-400" : j.stage === "FAILED" ? "bg-red-500/20 text-red-400" : "bg-cyan-500/20 text-cyan-400"}`}>
                    {STAGE_LABELS[j.stage] || j.stage}
                  </span>
                  <span className="text-slate-300 truncate max-w-[200px]">{j.repository_url}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span>{j.bugs_found} bugs</span>
                  <span>{j.solutions_verified} verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderProgress = () => {
    if (!activeJob) return null;
    const pct = activeJob.progress;
    const stageLabel = STAGE_LABELS[activeJob.stage] || activeJob.stage;

    return (
      <div className="bg-card border border-cardBorder rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> : <Zap className="w-4 h-4 text-emerald-400" />}
            {stageLabel}
          </h3>
          <span className="text-xs font-mono text-slate-400">{pct}%</span>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-slate-400">{activeJob.message}</p>
        {activeJob.error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-2">
            {activeJob.error}
          </div>
        )}
        {/* Live stats */}
        <div className="flex gap-4 text-xs text-slate-500 pt-2 border-t border-cardBorder/50">
          <span>Bugs: <strong className="text-orange-400">{activeJob.bugs_found}</strong></span>
          <span>Solutions: <strong className="text-yellow-400">{activeJob.solutions_generated}</strong></span>
          <span>Verified: <strong className="text-emerald-400">{activeJob.solutions_verified}</strong></span>
        </div>
      </div>
    );
  };

  const renderReport = () => {
    if (!report) return <p className="text-sm text-slate-400">No report available yet.</p>;
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-card border border-cardBorder rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-white">{report.repository_name}</h3>
            <div className="flex items-center gap-2">
              {STATUS_ICONS[report.verification_status]}
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${report.verification_status === "VERIFIED" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : report.verification_status === "FAILED" ? "bg-red-500/15 text-red-400 border-red-500/30" : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"}`}>
                {report.verification_status}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400">{report.summary}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span>Branch: <strong className="text-slate-300">{report.branch}</strong></span>
            <span>Analyzed: <strong className="text-slate-300">{new Date(report.analysis_timestamp).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Bugs */}
        {report.detected_bugs.length > 0 && (
          <div className="bg-card border border-cardBorder rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Bug className="w-4 h-4 text-red-400" /> Detected Bugs ({report.detected_bugs.length})
            </h3>
            <div className="space-y-2">
              {report.detected_bugs.map((bug) => (
                <div key={bug.bug_id} className="border border-cardBorder/50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedBug(expandedBug === bug.bug_id ? null : bug.bug_id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-cardBorder/20 transition text-left"
                  >
                    <div className="flex items-center gap-2">
                      {expandedBug === bug.bug_id ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${SEVERITY_COLORS[bug.severity] || "text-slate-400"}`}>{bug.severity.toUpperCase()}</span>
                      <span className="text-xs text-white">{bug.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{bug.file_path}:{bug.line_number}</span>
                  </button>
                  {expandedBug === bug.bug_id && (
                    <div className="p-3 pt-0 space-y-2 text-xs">
                      <div className="bg-background/60 rounded p-2 font-mono text-slate-300 text-[11px] overflow-x-auto">{bug.evidence}</div>
                      <p className="text-slate-400"><strong className="text-slate-300">Explanation:</strong> {bug.explanation}</p>
                      <div className="flex gap-3 text-[10px] text-slate-500">
                        <span>Method: {bug.detection_method}</span>
                        <span>Confidence: {(bug.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hypotheses */}
        {report.hypotheses.length > 0 && (
          <div className="bg-card border border-cardBorder rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" /> Root-Cause Hypotheses ({report.hypotheses.length})
            </h3>
            <div className="space-y-3">
              {report.hypotheses.map((h, i) => (
                <div key={h.hypothesis_id} className="bg-background/40 border border-cardBorder/50 rounded-lg p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Hypothesis {i + 1}: {h.root_cause}</span>
                    <span className="text-[10px] text-slate-500">Confidence: {(h.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-slate-400"><strong className="text-slate-300">Why:</strong> {h.why_problem_occurs}</p>
                  <p className="text-slate-400"><strong className="text-slate-300">Expected:</strong> {h.expected_behavior}</p>
                  <p className="text-slate-500"><strong className="text-slate-400">Validation:</strong> {h.validation_method}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Solutions with diffs */}
        {report.candidate_solutions.length > 0 && (
          <div className="bg-card border border-cardBorder rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" /> Candidate Solutions ({report.candidate_solutions.length})
            </h3>
            <div className="space-y-3">
              {report.candidate_solutions.map((sol, i) => {
                const eval_ = report.evaluations.find(e => e.solution_id === sol.solution_id);
                const isSelected = report.selected_solution?.solution_id === sol.solution_id;
                return (
                  <div key={sol.solution_id} className={`border rounded-lg overflow-hidden ${isSelected ? "border-emerald-500/50 bg-emerald-500/5" : "border-cardBorder/50"}`}>
                    <button
                      onClick={() => setExpandedSolution(expandedSolution === sol.solution_id ? null : sol.solution_id)}
                      className="w-full flex items-center justify-between p-3 hover:bg-cardBorder/20 transition text-left"
                    >
                      <div className="flex items-center gap-2">
                        {expandedSolution === sol.solution_id ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        {STATUS_ICONS[sol.verification_status] || STATUS_ICONS["PENDING"]}
                        <span className="text-xs text-white">Solution {i + 1}{isSelected ? " ★ Selected" : ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${sol.estimated_risk === "Low" ? "bg-emerald-500/15 text-emerald-400" : sol.estimated_risk === "Medium" ? "bg-yellow-500/15 text-yellow-400" : "bg-red-500/15 text-red-400"}`}>{sol.estimated_risk} Risk</span>
                        {eval_ && <span className="text-[10px] font-mono text-slate-400">Score: {eval_.overall_score}</span>}
                      </div>
                    </button>
                    {expandedSolution === sol.solution_id && (
                      <div className="p-3 pt-0 space-y-3 text-xs">
                        <p className="text-slate-300">{sol.explanation}</p>
                        <p className="text-slate-400"><strong>Expected:</strong> {sol.expected_outcome}</p>
                        {sol.potential_side_effects.length > 0 && (
                          <p className="text-slate-500"><strong>Side Effects:</strong> {sol.potential_side_effects.join(", ")}</p>
                        )}
                        {/* Diffs */}
                        {sol.code_changes.map((change, ci) => (
                          <div key={ci} className="mt-2">
                            <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                              <GitCompare className="w-3 h-3" /> {change.file_path}
                            </div>
                            {change.diff && (
                              <pre className="bg-[#0d1117] border border-cardBorder/30 rounded-lg p-3 text-[10px] font-mono overflow-x-auto max-h-64 overflow-y-auto whitespace-pre leading-relaxed">
                                {change.diff.split("\n").map((line, li) => (
                                  <div key={li} className={line.startsWith("+") && !line.startsWith("+++") ? "text-emerald-400" : line.startsWith("-") && !line.startsWith("---") ? "text-red-400" : line.startsWith("@@") ? "text-cyan-400" : "text-slate-400"}>
                                    {line}
                                  </div>
                                ))}
                              </pre>
                            )}
                          </div>
                        ))}
                        {/* Evaluation */}
                        {eval_ && (
                          <div className="bg-background/40 rounded-lg p-2 mt-2 text-[11px]">
                            <pre className="text-slate-400 whitespace-pre-wrap">{eval_.reasoning}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Test Results */}
        {(report.original_test_results || report.final_test_results) && (
          <div className="bg-card border border-cardBorder rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <TestTube className="w-4 h-4 text-purple-400" /> Test Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.original_test_results && (
                <div className="bg-background/40 border border-cardBorder/50 rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 mb-2 uppercase font-bold">Before Repair</div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div><div className="text-lg font-mono text-emerald-400">{report.original_test_results.passed}</div><div className="text-[10px] text-slate-500">Passed</div></div>
                    <div><div className="text-lg font-mono text-red-400">{report.original_test_results.failed}</div><div className="text-[10px] text-slate-500">Failed</div></div>
                    <div><div className="text-lg font-mono text-slate-400">{report.original_test_results.total_tests}</div><div className="text-[10px] text-slate-500">Total</div></div>
                  </div>
                </div>
              )}
              {report.final_test_results && (
                <div className="bg-background/40 border border-emerald-500/30 rounded-lg p-3">
                  <div className="text-[10px] text-emerald-500 mb-2 uppercase font-bold">After Repair</div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div><div className="text-lg font-mono text-emerald-400">{report.final_test_results.passed}</div><div className="text-[10px] text-slate-500">Passed</div></div>
                    <div><div className="text-lg font-mono text-red-400">{report.final_test_results.failed}</div><div className="text-[10px] text-slate-500">Failed</div></div>
                    <div><div className="text-lg font-mono text-slate-400">{report.final_test_results.total_tests}</div><div className="text-[10px] text-slate-500">Total</div></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Download */}
        <div className="flex justify-end">
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-accent-cyan/20 border border-accent-cyan/40 text-accent-cyan rounded-lg text-xs font-medium hover:bg-accent-cyan/30 transition"
          >
            <Download className="w-3.5 h-3.5" /> Download Report (Markdown)
          </button>
        </div>
      </div>
    );
  };

  /* ──────── MAIN RENDER ──────── */
  const sections = [
    { id: "dashboard", label: "Dashboard", icon: Zap },
    { id: "progress", label: "Live Progress", icon: Play },
    { id: "report", label: "Repair Report", icon: FileCode },
  ];

  return (
    <div className="space-y-5">
      {/* URL Input */}
      <div className="bg-card border border-cardBorder rounded-xl p-5">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-cyan-400" /> Autonomous Software Repair Agent
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repo or 'demo'"
            className="flex-1 bg-background border border-cardBorder rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-accent-cyan/50 focus:outline-none transition font-mono"
            onKeyDown={(e) => e.key === "Enter" && startRepair()}
          />
          <button
            onClick={() => startRepair()}
            disabled={loading || !repoUrl.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-lg text-sm font-medium hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-cyan-500/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>Start Repair</span>
          </button>
        </div>

        {/* Quick Demo & Options Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Quick Test:</span>
            <button
              type="button"
              onClick={() => {
                setRepoUrl("demo");
                startRepair("demo");
              }}
              disabled={loading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-accent-cyan transition text-xs font-medium cursor-pointer"
            >
              <Zap className="w-3 h-3 text-accent-cyan" />
              <span>🧪 Try Demo Buggy Repo (Instant Local Test)</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
          >
            {showAdvanced ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>Branch & Token Options</span>
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="mt-3 pt-3 border-t border-cardBorder/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in">
            <div>
              <label className="block text-slate-400 mb-1 font-mono text-[11px]">Git Branch (Optional)</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main"
                className="w-full bg-background border border-cardBorder rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-accent-cyan/50 focus:outline-none transition font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-mono text-[11px]">GitHub Token (Optional for Private Repos)</label>
              <input
                type="password"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  if (e.target.value.trim()) {
                    localStorage.setItem("reporag_github_token", e.target.value.trim());
                  } else {
                    localStorage.removeItem("reporag_github_token");
                  }
                }}
                placeholder="ghp_..."
                className="w-full bg-background border border-cardBorder rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-accent-cyan/50 focus:outline-none transition font-mono"
              />
            </div>
          </div>
        )}

        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </div>

      {/* Section Navigation */}
      <div className="flex items-center gap-1 p-1 bg-card border border-cardBorder rounded-lg">
        {sections.map((s) => {
          const Icon = s.icon;
          const active = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition ${active ? "bg-accent-cyan/20 text-accent-cyan font-bold border border-accent-cyan/30" : "text-slate-400 hover:text-white hover:bg-cardBorder/30"}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      {activeSection === "dashboard" && renderDashboard()}
      {activeSection === "progress" && renderProgress()}
      {activeSection === "report" && renderReport()}
    </div>
  );
};
