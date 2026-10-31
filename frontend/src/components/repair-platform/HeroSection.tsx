import React from "react";
import {
  ArrowDown,
  ArrowRight,
  Sparkles,
  GitBranch,
  Terminal,
  Play,
  Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURABLE WEBSITE NAME
// You can change this variable anytime to rename the platform throughout the
// cinematic hero animation without touching any animation keyframe code.
// ─────────────────────────────────────────────────────────────────────────────
export const CONFIG_WEBSITE_NAME = "RepoRAG";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

interface HeroSectionProps {
  websiteName?: string;
  onAnalyzeClick: () => void;
  onExploreHowItWorksClick: () => void;
  onTryDemo?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  websiteName = CONFIG_WEBSITE_NAME,
  onAnalyzeClick,
  onExploreHowItWorksClick,
  onTryDemo,
}) => {
  const letters = websiteName.split("");

  const scrollToNext = () => {
    const el =
      document.getElementById("platform-capabilities") ||
      document.getElementById("repository-analysis");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#07080d] select-none text-[#f5f5f0] border-b border-white/5"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. PAPER-LIKE GRAIN TEXTURE & CINEMATIC SLOW ZOOM
      ─────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Ambient Slow-Zoom Lighting Layer */}
        <div className="absolute inset-0 animate-cinematic-zoom origin-center opacity-80">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-purple-900/18 via-indigo-900/12 to-cyan-900/10 blur-[140px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-purple-950/15 blur-[120px] rounded-full" />
        </div>

        {/* Paper-like Organic Grain Texture Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.038] mix-blend-overlay pointer-events-none animate-grain"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="hero-paper-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-paper-grain)" />
        </svg>

        {/* Subtle Horizontal & Vertical Editorial Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-40" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MINIMAL TOP NAVIGATION BAR (Inside Hero)
      ─────────────────────────────────────────────────────────────── */}
      <nav className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Left: Logo & Configurable Website Name */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#11131f] border border-purple-500/30 flex items-center justify-center font-mono text-xs font-bold text-purple-300 shadow-md shadow-purple-950/40">
            &lt;◉&gt;
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-editorial-serif tracking-wide text-lg text-[#f5f5f0]">
              {websiteName}
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300/90 border border-purple-500/20">
              Autonomous Repair
            </span>
          </div>
        </div>

        {/* Center: Editorial Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-wide text-[#bfbdb7]">
          <a
            href="#repository-analysis"
            className="hover:text-white transition-colors duration-200"
          >
            Repository Analysis
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors duration-200"
          >
            How It Works
          </a>
          <a
            href="#about"
            className="hover:text-white transition-colors duration-200"
          >
            Documentation
          </a>
        </div>

        {/* Right: GitHub Connection Button */}
        <div className="flex items-center space-x-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#11131f]/90 hover:bg-[#161a2b] border border-white/10 hover:border-purple-400/40 text-xs font-mono text-[#dcdad4] hover:text-white transition-all shadow-sm"
          >
            <GithubIcon className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden sm:inline">Connect GitHub</span>
          </a>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          3. HERO CENTER: CINEMATIC REVEAL TITLE & EDITORIAL SUBTITLE
      ─────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto py-12 md:py-20 flex flex-col items-center text-center">
        {/* Subtle Category Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-purple-300/80 mb-6 sm:mb-8 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="tracking-widest uppercase text-[11px]">
            Public-Interest Software Intelligence
          </span>
        </div>

        {/* EXTREMELY LARGE, ELEGANT SERIF TITLE WITH STAGGERED LETTER REVEAL */}
        <div className="relative w-full overflow-hidden py-2 sm:py-4">
          <h1
            className="font-editorial-serif font-light md:font-normal tracking-[-0.03em] leading-[0.88] text-[#f5f5f0] drop-shadow-2xl text-6xl sm:text-8xl md:text-9xl lg:text-[11.5rem] xl:text-[13.5rem] 2xl:text-[15.5rem]"
            aria-label={websiteName}
          >
            {letters.map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="inline-block animate-letter-reveal select-none transition-all duration-300 hover:text-purple-300 hover:scale-[1.03]"
                style={{
                  animationDelay: `${index * 85 + 150}ms`,
                  display: char === " " ? "inline" : "inline-block",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
        </div>

        {/* THIN HORIZONTAL EDITORIAL DIVIDER */}
        <div className="w-full max-w-2xl mx-auto my-6 sm:my-8 relative flex items-center justify-center">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#8a8882]/40 to-transparent animate-divider-expand" />
          <div className="absolute w-2 h-2 rounded-full bg-purple-400/80 shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
        </div>

        {/* REFINED EDITORIAL SUBTITLE & MISSION STATEMENT */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#a8a69f] font-sans font-light leading-relaxed tracking-normal animate-fade-in-soft [animation-delay:900ms]">
          Autonomous software defect localization, multi-hypothesis causal reasoning,
          and patch verification synthesized to maintain public-interest digital infrastructure.
        </p>

        {/* CINEMATIC CALL-TO-ACTION BUTTONS */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-soft [animation-delay:1100ms]">
          <button
            onClick={onAnalyzeClick}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#f5f5f0] hover:bg-white text-[#0a0a0f] font-sans font-semibold text-xs tracking-wider uppercase transition-all duration-200 shadow-xl shadow-purple-950/30 hover:scale-[1.02] cursor-pointer"
          >
            <span>Analyze Repository</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onExploreHowItWorksClick}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#11131f]/80 hover:bg-[#161a2b] border border-white/10 hover:border-purple-400/40 text-[#dfdcd3] hover:text-white font-mono text-xs transition-all duration-200 cursor-pointer"
          >
            <Play className="w-3 h-3 text-purple-300" />
            <span>How It Works</span>
          </button>

          {onTryDemo && (
            <button
              onClick={onTryDemo}
              className="flex items-center space-x-1.5 px-4 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-xs transition cursor-pointer"
            >
              <Zap className="w-3 h-3 text-purple-400" />
              <span>Instant Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM BAR: SMOOTH SCROLL TRANSITION TO MAIN DASHBOARD
      ─────────────────────────────────────────────────────────────── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#8a8882] border-t border-white/[0.04]">
        {/* Left IDE Indicator */}
        <div className="flex items-center space-x-2.5 mb-3 sm:mb-0">
          <Terminal className="w-3.5 h-3.5 text-purple-400/80" />
          <span>SBFL Ochiai • AST Verification • Anti-Overfitting</span>
        </div>

        {/* Center Scroll Transition Button */}
        <button
          onClick={scrollToNext}
          className="flex items-center space-x-2 text-xs font-mono text-[#dcdad4] hover:text-white transition-colors cursor-pointer group"
          title="Scroll down to exploration dashboard"
        >
          <span className="tracking-wider uppercase text-[11px] text-slate-400 group-hover:text-purple-300">
            Scroll to explore analysis
          </span>
          <div className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center group-hover:border-purple-400/60 group-hover:bg-purple-500/10 transition">
            <ArrowDown className="w-3 h-3 text-purple-300 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </button>

        {/* Right Status */}
        <div className="hidden sm:flex items-center space-x-2 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Docker Sandbox Ready</span>
        </div>
      </div>
    </section>
  );
};
