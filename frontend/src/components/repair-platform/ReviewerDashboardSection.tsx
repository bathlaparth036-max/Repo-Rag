import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Download,
  GitPullRequest,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  GitMerge,
  MessageSquare,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { GlassButton } from "./GlassButton";

export const ReviewerDashboardSection: React.FC = () => {
  const [reviewState, setReviewState] = useState<"pending" | "approved" | "changes" | "rejected">(
    "pending"
  );
  const [feedbackNote, setFeedbackNote] = useState<string>("");

  const downloadReport = () => {
    const markdown = `# Autonomous AI Software Repair Audit Report
## Repository: demo-buggy-repo (Branch: main)
**Status:** VERIFIED (100% Tests Passing, 0 Regressions)

### 1. Detected Fault
- **File:** \`main.py:12\`
- **Fault Type:** ZeroDivisionError (Missing pre-condition guard in \`divide(a, b)\`)
- **Localization Method:** Spectrum-Based Fault Localization (Ochiai coefficient: 0.94)

### 2. Root Cause
The \`divide()\` function directly performs \`a / b\` without verifying that the divisor \`b != 0\`.

### 3. Applied Patch
\`\`\`diff
--- a/main.py
+++ b/main.py
@@ -11,2 +11,3 @@
-    # BUG: No zero-division guard
-    return a / b
+    if b == 0:
+        raise ValueError("Cannot divide by zero")
+    return a / b
\`\`\`

### 4. Verification Evidence
- Original Test Suite: 8/8 Passed (100%)
- Regression Test Suite: 6 Edge Cases Synthesized & Passed
- Property Fuzzing: 500 Invariants Held
- Mutation Testing: 88.9% Killed Mutants
- Sandbox Environment: Docker Isolation (--network=none)

### 5. Remaining Limitations
None detected. Function signature and behavioral purity preserved.
`;
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RepoRAG-Reviewer-Report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="reviewer-dashboard" className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-4">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Maintainer-Ready Explanations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Reviewer Approval Dashboard
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-400 font-sans">
            Maintainers should not have to manually comb through entire codebases. RepoRAG formats
            every repair with executive clarity, test audit trails, and one-click PR approvals.
          </p>
        </div>

        {/* PR Card */}
        <div className="bg-[#0b0e1b] rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl font-mono text-xs">
          {/* PR Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <GitPullRequest className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-bold text-white font-sans">
                    PR #42: Fix ZeroDivisionError in divide()
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    PASSING CHECKS
                  </span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  Authored by: <strong className="text-cyan-400">RepoRAG Autonomous Agent</strong> •
                  Branch: <code className="text-slate-300">fix/divide-zero-guard</code>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={downloadReport}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report (.md)</span>
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="py-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1. Ingested &amp; Parsed</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-600 hidden sm:inline" />

            <div className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>2. SBFL Localized (0.94)</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-600 hidden sm:inline" />

            <div className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3. Root Cause Isolated</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-600 hidden sm:inline" />

            <div className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>4. Docker Verified (8/8)</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-600 hidden sm:inline" />

            <div className="flex items-center space-x-1.5 text-purple-400 font-bold">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>5. Maintainer Review</span>
            </div>
          </div>

          {/* Structured Explanations */}
          <div className="py-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#121629] border border-white/5 space-y-1.5">
                <span className="text-[11px] text-red-400 uppercase font-bold block">
                  Original Bug
                </span>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">
                  Unhandled ZeroDivisionError in <code className="text-cyan-300">divide(a, b)</code>{" "}
                  when denominator evaluates to zero.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#121629] border border-white/5 space-y-1.5">
                <span className="text-[11px] text-purple-400 uppercase font-bold block">
                  Root Cause
                </span>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">
                  Function lacked boundary guard for zero inputs before native CPython arithmetic
                  execution.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#121629] border border-white/5 space-y-1.5">
                <span className="text-[11px] text-emerald-400 uppercase font-bold block">
                  Why Patch Solves Root Cause
                </span>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">
                  Introduces explicit pre-condition check: raises{" "}
                  <code className="text-emerald-300">ValueError(&quot;Cannot divide by zero&quot;)</code>{" "}
                  preserving API contract.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#121629] border border-white/5 space-y-1.5">
                <span className="text-[11px] text-cyan-400 uppercase font-bold block">
                  Remaining Limitations &amp; Trade-offs
                </span>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">
                  None. The patch is minimal, isolated, and introduces 0 runtime overhead.
                </p>
              </div>
            </div>
          </div>

          {/* Action Approval Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-xs">Review Verdict:</span>
              <span
                className={`font-bold text-xs uppercase px-2 py-0.5 rounded ${
                  reviewState === "approved"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : reviewState === "rejected"
                    ? "bg-red-500/20 text-red-400"
                    : reviewState === "changes"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {reviewState === "pending" ? "Awaiting Review" : reviewState}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <GlassButton
                variant="destructive"
                onClick={() => setReviewState("rejected")}
              >
                Reject Patch
              </GlassButton>

              <GlassButton
                variant="glass"
                onClick={() => setReviewState("changes")}
              >
                Request Changes
              </GlassButton>

              <GlassButton
                variant="verified"
                icon={GitMerge}
                onClick={() => setReviewState("approved")}
              >
                Approve Patch &amp; Merge PR
              </GlassButton>
            </div>
          </div>

          {/* Toast Notification if Approved */}
          {reviewState === "approved" && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Patch approved by maintainer! Pull request merged to main with full verification
                audit trail.
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
