import {
  RepositoryIntelligence,
  TreeNode,
  KnowledgeGraph,
  GroundedAnswer,
  SecurityIssue,
  ChangeImpactResult,
  AIDetectionReport
} from "../types";

export const API_BASE =
  typeof window !== "undefined" && window.location.origin.includes(":8000")
    ? `${window.location.origin}/api`
    : "http://127.0.0.1:8000/api";

export const api = {
  async validateRepo(url: string) {
    const res = await fetch(`${API_BASE}/repositories/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Validation failed");
    }
    return res.json();
  },

  async startAnalysis(url: string, token?: string): Promise<{ job_id: string; repository_id: string; message: string }> {
    const res = await fetch(`${API_BASE}/ingestion/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, token: token || undefined }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to start analysis");
    }
    return res.json();
  },

  async getJobStatus(jobId: string) {
    const res = await fetch(`${API_BASE}/ingestion/status/${jobId}`);
    if (!res.ok) throw new Error("Could not fetch job status");
    return res.json();
  },

  async getDemoRepo(): Promise<RepositoryIntelligence> {
    const res = await fetch(`${API_BASE}/repositories/demo`);
    if (!res.ok) throw new Error("Failed to load demo repository");
    return res.json();
  },

  async getRepository(repositoryId: string): Promise<RepositoryIntelligence> {
    const res = await fetch(`${API_BASE}/repositories/${repositoryId}`);
    if (!res.ok) throw new Error("Failed to fetch repository intelligence");
    return res.json();
  },

  async getSourceTree(repositoryId: string): Promise<TreeNode> {
    const res = await fetch(`${API_BASE}/repositories/${repositoryId}/tree`);
    if (!res.ok) throw new Error("Failed to fetch source tree");
    return res.json();
  },

  async getKnowledgeGraph(repositoryId: string): Promise<KnowledgeGraph> {
    const res = await fetch(`${API_BASE}/repositories/${repositoryId}/graph`);
    if (!res.ok) throw new Error("Failed to fetch knowledge graph");
    return res.json();
  },

  async getDiagrams(repositoryId: string): Promise<Record<string, string>> {
    const res = await fetch(`${API_BASE}/repositories/${repositoryId}/diagrams`);
    if (!res.ok) throw new Error("Failed to fetch diagrams");
    return res.json();
  },

  async getFileContent(repositoryId: string, path: string): Promise<{ path: string; content: string }> {
    const res = await fetch(`${API_BASE}/repositories/${repositoryId}/file?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error("File content not found");
    return res.json();
  },

  async askChat(repositoryId: string, query: string): Promise<GroundedAnswer> {
    const res = await fetch(`${API_BASE}/chat/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repository_id: repositoryId, query }),
    });
    if (!res.ok) throw new Error("Failed to synthesize response");
    return res.json();
  },

  async hybridSearch(repositoryId: string, query: string) {
    const res = await fetch(`${API_BASE}/search/hybrid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repository_id: repositoryId, query }),
    });
    if (!res.ok) throw new Error("Search failed");
    return res.json();
  },

  async getSecurityScan(repositoryId: string): Promise<{ findings: SecurityIssue[]; disclaimer: string }> {
    const res = await fetch(`${API_BASE}/security/${repositoryId}/scan`);
    if (!res.ok) throw new Error("Security scan failed");
    return res.json();
  },

  async getOnboardingGuide(repositoryId: string) {
    const res = await fetch(`${API_BASE}/health/${repositoryId}/onboarding`);
    if (!res.ok) throw new Error("Failed to generate onboarding guide");
    return res.json();
  },

  async checkChangeImpact(repositoryId: string, targetFile: string): Promise<ChangeImpactResult> {
    const res = await fetch(`${API_BASE}/health/${repositoryId}/change-impact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_file: targetFile }),
    });
    if (!res.ok) throw new Error("Change impact analysis failed");
    return res.json();
  },

  async getAIDetectionReport(repositoryId: string): Promise<AIDetectionReport> {
    const res = await fetch(`${API_BASE}/repositories/${repositoryId}/ai-detection`);
    if (!res.ok) throw new Error("Failed to fetch AI detection report");
    return res.json();
  },

  async purgeRepository(repositoryId: string) {
    const res = await fetch(`${API_BASE}/repositories/${repositoryId}`, {
      method: "DELETE",
    });
    return res.json();
  },

  // ─── Autonomous Repair API ────────────────────────────────
  async startRepair(url: string, token?: string, branch?: string): Promise<{ job_id: string; repository_url: string; message: string }> {
    const res = await fetch(`${API_BASE}/repair/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, token: token || undefined, branch: branch || undefined }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to start repair");
    }
    return res.json();
  },

  async getRepairStatus(jobId: string) {
    const res = await fetch(`${API_BASE}/repair/status/${jobId}`);
    if (!res.ok) throw new Error("Could not fetch repair status");
    return res.json();
  },

  async getRepairReport(jobId: string) {
    const res = await fetch(`${API_BASE}/repair/report/${jobId}`);
    if (!res.ok) {
      if (res.status === 202) return null; // Still in progress
      throw new Error("Report not available");
    }
    return res.json();
  },

  async getRepairReportMarkdown(jobId: string): Promise<string> {
    const res = await fetch(`${API_BASE}/repair/report/${jobId}/markdown`);
    if (!res.ok) throw new Error("Report not available");
    return res.text();
  },

  async getRepairDashboard() {
    const res = await fetch(`${API_BASE}/repair/dashboard`);
    if (!res.ok) throw new Error("Dashboard unavailable");
    return res.json();
  },

  async listRepairJobs() {
    const res = await fetch(`${API_BASE}/repair/jobs`);
    if (!res.ok) throw new Error("Could not list repair jobs");
    return res.json();
  },
};

