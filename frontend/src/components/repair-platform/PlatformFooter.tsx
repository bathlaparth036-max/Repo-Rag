import React from "react";
import {
  FolderGit2,
  Mail,
  ShieldCheck,
  Terminal,
  Heart,
  Globe,
  Layers,
  ArrowUp,
} from "lucide-react";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const PlatformFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-[#070911] text-slate-400 font-mono text-xs pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-[#0d111d] rounded-[11px] flex items-center justify-center">
                  <span className="font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-xs">
                    &lt;◉&gt;
                  </span>
                </div>
              </div>
              <span className="font-bold text-white font-sans text-base tracking-tight">
                RepoRAG Autonomous Repair
              </span>
            </div>

            <p className="text-slate-400 font-sans text-xs leading-relaxed max-w-sm">
              An autonomous AI software repair platform that ingests unfamiliar public-interest
              GitHub repositories, localizes faults with mathematical spectrum analysis, explores
              root-cause hypotheses, and synthesizes test-verified patches.
            </p>

            <div className="flex items-center space-x-2 pt-1 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational • v1.0 Production Engine</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-white font-bold tracking-wider uppercase text-[11px] block">
              Platform Navigation
            </span>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a href="#hero" className="hover:text-cyan-400 transition">
                  Home &amp; Hero
                </a>
              </li>
              <li>
                <a href="#repository-analysis" className="hover:text-cyan-400 transition">
                  Repository Ingestion
                </a>
              </li>
              <li>
                <a href="#fault-localization" className="hover:text-cyan-400 transition">
                  Spectrum Fault Localization
                </a>
              </li>
              <li>
                <a href="#multi-hypothesis" className="hover:text-cyan-400 transition">
                  Hypothesis Reasoning
                </a>
              </li>
              <li>
                <a href="#code-repair" className="hover:text-cyan-400 transition">
                  AI Code Repair IDE
                </a>
              </li>
              <li>
                <a href="#success-metrics" className="hover:text-cyan-400 transition">
                  Analytics &amp; Metrics
                </a>
              </li>
            </ul>
          </div>

          {/* Research & Capstone */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-white font-bold tracking-wider uppercase text-[11px] block">
              College Capstone &amp; Research
            </span>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Developed as an Advanced Software Engineering Capstone Project. Aligned with UN
              Sustainable Development Goals 9 &amp; 16 for resilient digital public goods.
            </p>

            <div className="pt-2 flex flex-col space-y-1.5 text-[11px]">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>Backend: FastAPI • Python 3.11+ • Docker</span>
              </div>
              <div className="flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Frontend: React 19 • TypeScript • Vite • Tailwind</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} RepoRAG Autonomous Repair Platform. MIT License.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
