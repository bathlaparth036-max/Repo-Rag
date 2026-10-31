export interface DependencyItem {
  name: string;
  version?: string;
  ecosystem: string;
  is_dev: boolean;
  purpose?: string;
  risk_level: string;
  used_in_files?: string[];
}

export interface CodeSymbol {
  name: string;
  symbol_type: string;
  file_path: string;
  start_line: number;
  end_line: number;
  parent_symbol?: string;
  docstring?: string;
  parameters: string[];
  complexity: number;
  code_snippet?: string;
}

export interface FileInfo {
  path: string;
  name: string;
  extension: string;
  language: string;
  size_bytes: number;
  line_count: number;
  complexity_score: number;
  ai_importance_score: number;
  purpose?: string;
  symbols: CodeSymbol[];
  imports: string[];
  calls: string[];
}

export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  language?: string;
  line_count?: number;
  ai_importance?: number;
  complexity?: number;
  children?: TreeNode[];
}

export interface HealthScore {
  overall: number;
  architecture: number;
  maintainability: number;
  documentation: number;
  testing: number;
  security: number;
  is_ai_estimated: boolean;
  summary: string;
}

export interface GitCommit {
  hash: string;
  short_hash: string;
  author: string;
  date: string;
  message: string;
  changed_files: string[];
}

export interface ArchitectureOverview {
  style: string;
  description: string;
  entry_points: string[];
  frontend_entry?: string;
  backend_entry?: string;
  services: string[];
  databases: string[];
  apis: string[];
  data_flow: string;
}

export interface AIFileSignal {
  file_path: string;
  ai_percentage: number;
  confidence: number;
  detected_patterns: string[];
  lines_analyzed: number;
  estimated_ai_lines: number;
}

export interface AIDetectionReport {
  overall_percentage: number;
  confidence_level: "High" | "Medium" | "Low";
  classification: "Human Hand-Crafted" | "Light AI Assistance" | "Substantial AI-Assisted" | "Predominantly AI-Generated";
  ai_lines_count: number;
  total_lines_count: number;
  signals_detected: string[];
  top_ai_files: AIFileSignal[];
  has_ai_tool_config: boolean;
  ai_tools_detected: string[];
  summary: string;
}

export interface RepositoryIntelligence {
  id: string;
  owner: string;
  repository_name: string;
  full_name: string;
  html_url: string;
  description?: string;
  default_branch: string;
  current_commit_sha?: string;
  is_private: boolean;
  stars: number;
  forks: number;
  languages: Record<string, number>;
  frameworks: string[];
  dependencies: DependencyItem[];
  file_count: number;
  directory_count: number;
  contributor_count: number;
  commit_count: number;
  architecture: ArchitectureOverview;
  health: HealthScore;
  ai_usage?: AIDetectionReport;
  important_files: FileInfo[];
  recent_commits: GitCommit[];
  status: string;
  progress_percentage: number;
  status_message: string;
  overview_summary: string;
  summary_30s: string;
  summary_2m: string;
  summary_5m: string;
}

export interface GraphNode {
  id: string;
  label: string;
  node_type: string;
  group: string;
  file_path?: string;
  line_number?: number;
  importance: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  edge_type: string;
  label?: string;
  weight: number;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  total_nodes: number;
  total_edges: number;
}

export interface EvidenceItem {
  file_path: string;
  symbol?: string;
  start_line: number;
  end_line: number;
  snippet: string;
  relevance_score: number;
}

export interface GroundedAnswer {
  query: string;
  answer: string;
  evidence: EvidenceItem[];
  relevant_files: string[];
  relevant_symbols: string[];
  confidence: number;
  model_used: string;
}

export interface SecurityIssue {
  severity: "Critical" | "High" | "Medium" | "Low";
  category: string;
  file_path: string;
  line_number: number;
  reason: string;
  suggested_remediation: string;
  snippet?: string;
}

export interface ChangeImpactResult {
  target_file: string;
  risk_level: string;
  direct_dependents: string[];
  indirect_dependents: string[];
  affected_apis: string[];
  affected_tests: string[];
  summary: string;
}
