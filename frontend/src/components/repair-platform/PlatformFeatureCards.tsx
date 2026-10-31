import React, { useState, useRef, useEffect } from "react";
import {
  FolderGit2,
  Target,
  Lightbulb,
  Wrench,
  ShieldCheck,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Activity,
  Code2,
  CheckCircle2,
  Compass,
} from "lucide-react";

export interface FeatureCardData {
  id: string;
  number: string;
  phaseBadge: string;
  title: string;
  description: string;
  targetId: string;
  glowColor: "cyan" | "purple" | "blue" | "emerald";
  accentText: string;
  metaFact: string;
  illustrationType:
    | "repository"
    | "fault"
    | "hypothesis"
    | "repair"
    | "verification"
    | "reviewer";
}

interface PlatformFeatureCardsProps {
  onCardSelect?: (cardId: string) => void;
}

export const PlatformFeatureCards: React.FC<PlatformFeatureCardsProps> = ({
  onCardSelect,
}) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const cards: FeatureCardData[] = [
    {
      id: "repo-analysis",
      number: "01",
      phaseBadge: "Phase 01 • AST Ingestion",
      title: "Repository Analysis",
      description:
        "Analyze unfamiliar GitHub repositories and understand their structure.",
      targetId: "repository-analysis",
      glowColor: "cyan",
      accentText: "text-cyan-400",
      metaFact: "AST Graph & Symbol Lineage",
      illustrationType: "repository",
    },
    {
      id: "fault-localization",
      number: "02",
      phaseBadge: "Phase 02 • Spectral SBFL",
      title: "Fault Localization",
      description:
        "Identify suspicious code locations using execution spectra.",
      targetId: "fault-localization",
      glowColor: "blue",
      accentText: "text-blue-400",
      metaFact: "Ochiai Statistical Scoring (0.94)",
      illustrationType: "fault",
    },
    {
      id: "hypothesis-generation",
      number: "03",
      phaseBadge: "Phase 03 • MCTS Reasoning",
      title: "Hypothesis Generation",
      description:
        "Explore multiple possible root causes of software bugs.",
      targetId: "multi-hypothesis",
      glowColor: "purple",
      accentText: "text-purple-400",
      metaFact: "Multi-Path Bayesian Pruning",
      illustrationType: "hypothesis",
    },
    {
      id: "automated-code-repair",
      number: "04",
      phaseBadge: "Phase 04 • AST Synthesizer",
      title: "Automated Code Repair",
      description:
        "Generate cause-level patches for identified bugs.",
      targetId: "code-repair",
      glowColor: "cyan",
      accentText: "text-cyan-400",
      metaFact: "Semantic AST Diff Generation",
      illustrationType: "repair",
    },
    {
      id: "patch-verification",
      number: "05",
      phaseBadge: "Phase 05 • Mutation & Invariants",
      title: "Patch Verification",
      description:
        "Validate patches using property-based tests and mutation testing.",
      targetId: "patch-verification",
      glowColor: "emerald",
      accentText: "text-emerald-400",
      metaFact: "3-Tier Invariant & Mutation Gates",
      illustrationType: "verification",
    },
    {
      id: "reviewer-explanation",
      number: "06",
      phaseBadge: "Phase 06 • Explainable AI",
      title: "Reviewer Explanation",
      description:
        "Provide clear explanations of the bug, its root cause, and the proposed repair.",
      targetId: "reviewer-dashboard",
      glowColor: "purple",
      accentText: "text-purple-400",
      metaFact: "Causal Audit Trail & Ready PR",
      illustrationType: "reviewer",
    },
  ];

  const handleCardClick = (targetId: string, cardId: string) => {
    setActiveCardId(cardId);
    if (onCardSelect) {
      onCardSelect(cardId);
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="platform-capabilities"
      className="relative z-10 w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[55%] bg-gradient-to-r from-blue-600/5 via-purple-600/8 to-cyan-500/5 blur-[120px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-14 sm:mb-16">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#121626]/90 border border-purple-500/30 text-purple-300 font-mono text-xs mb-4 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="tracking-widest uppercase font-semibold text-[11px]">
            Autonomous Core Engines
          </span>
        </div>

        <h2 className="font-editorial-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight max-w-3xl leading-[1.1]">
          Self-Healing Intelligence <span className="italic font-light text-slate-300">Architecture</span>
        </h2>

        <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
          Six interconnected neural stages engineered to ingest unfamiliar codebases,
          mathematically isolate root causes, synthesize cause-level fixes, and verify invariants.
        </p>

        {/* Feature quick indicators */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 text-xs font-mono text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Interactive 3D Parallax</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>60FPS Hardware Acceleration</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Click to Inspect Pipeline</span>
          </span>
        </div>
      </div>

      {/* 3D Animated Cards Grid: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 perspective-1200">
        {cards.map((card, index) => (
          <InteractiveCard
            key={card.id}
            card={card}
            index={index}
            isActive={activeCardId === card.id}
            onClick={() => handleCardClick(card.targetId, card.id)}
          />
        ))}
      </div>
    </section>
  );
};

// ============================================================================
// INDIVIDUAL INTERACTIVE 3D CARD
// ============================================================================
interface InteractiveCardProps {
  card: FeatureCardData;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  card,
  index,
  isActive,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    // Detect touch-only screen to disable heavy mouse parallax
    const hasTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(hasTouch);

    // Detect prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    // Entrance stagger timer
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, index * 100 + 50);

    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || prefersReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    // Normalized coordinates (-1 to 1)
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Smooth tilt limit: max ±8.5 deg on X/Y for ultra-premium subtle feel
    const tiltX = -normY * 8.5;
    const tiltY = normX * 8.5;

    setRotateX(tiltX);
    setRotateY(tiltY);
    setMousePos({ x: percentX, y: percentY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Border & Glow styling based on color theme
  const getGlowStyles = () => {
    switch (card.glowColor) {
      case "cyan":
        return {
          hoverBorder: "hover:border-cyan-400/60",
          activeBorder: "border-cyan-400/80 shadow-[0_0_35px_rgba(0,242,254,0.35)]",
          glowShadow: isHovered
            ? "0 22px 48px -12px rgba(0,0,0,0.85), 0 0 35px -4px rgba(0,242,254,0.28)"
            : "0 10px 25px -5px rgba(0,0,0,0.5)",
          spotlightColor: "rgba(0, 242, 254, 0.14)",
          tagBadge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
        };
      case "blue":
        return {
          hoverBorder: "hover:border-blue-400/60",
          activeBorder: "border-blue-400/80 shadow-[0_0_35px_rgba(59,130,246,0.35)]",
          glowShadow: isHovered
            ? "0 22px 48px -12px rgba(0,0,0,0.85), 0 0 35px -4px rgba(59,130,246,0.28)"
            : "0 10px 25px -5px rgba(0,0,0,0.5)",
          spotlightColor: "rgba(59, 130, 246, 0.14)",
          tagBadge: "bg-blue-500/10 text-blue-300 border-blue-500/30",
        };
      case "emerald":
        return {
          hoverBorder: "hover:border-emerald-400/60",
          activeBorder: "border-emerald-400/80 shadow-[0_0_35px_rgba(16,185,129,0.35)]",
          glowShadow: isHovered
            ? "0 22px 48px -12px rgba(0,0,0,0.85), 0 0 35px -4px rgba(16,185,129,0.28)"
            : "0 10px 25px -5px rgba(0,0,0,0.5)",
          spotlightColor: "rgba(16, 185, 129, 0.14)",
          tagBadge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
        };
      case "purple":
      default:
        return {
          hoverBorder: "hover:border-purple-400/60",
          activeBorder: "border-purple-400/80 shadow-[0_0_35px_rgba(168,85,247,0.35)]",
          glowShadow: isHovered
            ? "0 22px 48px -12px rgba(0,0,0,0.85), 0 0 35px -4px rgba(168,85,247,0.28)"
            : "0 10px 25px -5px rgba(0,0,0,0.5)",
          spotlightColor: "rgba(168, 85, 247, 0.14)",
          tagBadge: "bg-purple-500/10 text-purple-300 border-purple-500/30",
        };
    }
  };

  const glow = getGlowStyles();

  // Dynamic CSS transforms
  const cardTransform =
    !isTouchDevice && !prefersReducedMotion && isHovered
      ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`
      : `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-2xl md:rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all duration-500 ease-out preserve-3d border ${
        isActive ? glow.activeBorder : "border-white/[0.08]"
      } ${glow.hoverBorder} ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } active:scale-[0.98]`}
      style={{
        transform: cardTransform,
        boxShadow: glow.glowShadow,
        background:
          "linear-gradient(135deg, rgba(13, 16, 28, 0.92) 0%, rgba(9, 11, 20, 0.96) 100%)",
        transitionProperty: "transform, box-shadow, border-color, opacity",
      }}
    >
      {/* 1. Moving radial gradient highlight following mouse coordinates */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, ${glow.spotlightColor}, rgba(139, 92, 246, 0.05) 50%, transparent 80%)`,
        }}
      />

      {/* 2. Top-edge glass reflection sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

      {/* 3. Subtle background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] group-hover:opacity-[0.07] transition-opacity duration-500 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* 4. CARD TOP BAR: Number Badge & Phase Tag (Floats at Z=25px) */}
      <div
        className="relative z-10 flex items-center justify-between pb-4 border-b border-white/[0.06] preserve-3d"
        style={{ transform: isHovered ? "translateZ(25px)" : "translateZ(0px)" }}
      >
        <div className="flex items-center space-x-2.5">
          <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
            {card.number}
          </span>
          <span className="text-slate-600">/</span>
          <span
            className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border ${glow.tagBadge} tracking-wide transition-all`}
          >
            {card.phaseBadge}
          </span>
        </div>

        {/* Small floating activity beacon */}
        <div className="w-2 h-2 rounded-full bg-cyan-400/60 group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_#00f2fe] transition-all" />
      </div>

      {/* 5. CARD CENTER: UNIQUE GLOSSY 3D ILLUSTRATION (Floats at Z=45px for maximum parallax) */}
      <div
        className="relative z-10 my-6 sm:my-7 py-3 flex items-center justify-center min-h-[175px] preserve-3d"
        style={{
          transform: isHovered
            ? `translateZ(45px) rotateX(${rotateX * 0.4}deg) rotateY(${rotateY * 0.4}deg)`
            : "translateZ(0px)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <Card3DIllustration
          type={card.illustrationType}
          isHovered={isHovered}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>

      {/* 6. CARD BOTTOM: Typography & Action CTA (Floats at Z=30px) */}
      <div
        className="relative z-10 pt-2 preserve-3d"
        style={{ transform: isHovered ? "translateZ(30px)" : "translateZ(0px)" }}
      >
        {/* White crisp heading */}
        <h3 className="text-xl sm:text-2xl font-sans font-semibold text-white tracking-tight group-hover:text-cyan-200 transition-colors duration-300 flex items-center justify-between">
          <span>{card.title}</span>
          <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/10 group-hover:border-cyan-400/50 group-hover:bg-cyan-500/10 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0 ml-2">
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition-colors" />
          </div>
        </h3>

        {/* Muted gray description - high legibility */}
        <p className="mt-2.5 text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
          {card.description}
        </p>

        {/* Bottom meta snippet / fact pill */}
        <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-slate-400 transition-colors">
          <span className="flex items-center space-x-1.5">
            <Activity className="w-3 h-3 text-cyan-400/70" />
            <span>{card.metaFact}</span>
          </span>
          <span className="text-cyan-400/80 font-medium group-hover:underline flex items-center space-x-1">
            <span>Explore</span>
            <span>&rarr;</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// UNIQUE 3D GLOSSY ILLUSTRATIONS FOR EACH OF THE 6 CARDS
// ============================================================================

interface Card3DIllustrationProps {
  type: FeatureCardData["illustrationType"];
  isHovered: boolean;
  prefersReducedMotion: boolean;
}

const Card3DIllustration: React.FC<Card3DIllustrationProps> = ({
  type,
  isHovered,
  prefersReducedMotion,
}) => {
  switch (type) {
    case "repository":
      return (
        <RepositoryAnalysis3DVisual
          isHovered={isHovered}
          prefersReducedMotion={prefersReducedMotion}
        />
      );
    case "fault":
      return (
        <FaultLocalization3DVisual
          isHovered={isHovered}
          prefersReducedMotion={prefersReducedMotion}
        />
      );
    case "hypothesis":
      return (
        <HypothesisGeneration3DVisual
          isHovered={isHovered}
          prefersReducedMotion={prefersReducedMotion}
        />
      );
    case "repair":
      return (
        <AutomatedCodeRepair3DVisual
          isHovered={isHovered}
          prefersReducedMotion={prefersReducedMotion}
        />
      );
    case "verification":
      return (
        <PatchVerification3DVisual
          isHovered={isHovered}
          prefersReducedMotion={prefersReducedMotion}
        />
      );
    case "reviewer":
      return (
        <ReviewerExplanation3DVisual
          isHovered={isHovered}
          prefersReducedMotion={prefersReducedMotion}
        />
      );
    default:
      return null;
  }
};

// ----------------------------------------------------------------------------
// 1. REPOSITORY ANALYSIS 3D VISUAL: Isometric Codebase Crystal & Git Commits
// ----------------------------------------------------------------------------
const RepositoryAnalysis3DVisual: React.FC<{
  isHovered: boolean;
  prefersReducedMotion: boolean;
}> = ({ isHovered, prefersReducedMotion }) => {
  return (
    <div
      className={`relative w-44 h-36 flex items-center justify-center ${
        !prefersReducedMotion ? "animate-float-slow" : ""
      }`}
    >
      {/* Ambient Radial Underglow */}
      <div className="absolute inset-0 bg-cyan-500/15 blur-xl rounded-full scale-75" />

      {/* SVG 3D Isometric Folder/Repo Stack with glossy gradient fills */}
      <svg
        viewBox="0 0 200 160"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,242,254,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="repoGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="repoGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0369a1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="repoGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="glassSlab" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Base Isometric Shadow */}
        <ellipse cx="100" cy="142" rx="68" ry="14" fill="#000" fillOpacity="0.5" />

        {/* Base Isometric Code Slab 1 */}
        <g transform="translate(0, 16)">
          {/* Top Face */}
          <polygon
            points="100,50 155,75 100,100 45,75"
            fill="url(#repoGradTop)"
            stroke="#7dd3fc"
            strokeWidth="1.2"
          />
          {/* Left Face */}
          <polygon
            points="45,75 100,100 100,118 45,93"
            fill="url(#repoGradLeft)"
            stroke="#38bdf8"
            strokeWidth="0.8"
          />
          {/* Right Face */}
          <polygon
            points="100,100 155,75 155,93 100,118"
            fill="url(#repoGradRight)"
            stroke="#0284c7"
            strokeWidth="0.8"
          />
        </g>

        {/* Floating Translucent AST Knowledge Plane (hover lifts this) */}
        <g
          transform={isHovered ? "translate(0, -6)" : "translate(0, 0)"}
          className="transition-transform duration-500 ease-out"
        >
          {/* Frosted Glass Top Plate */}
          <polygon
            points="100,32 162,60 100,88 38,60"
            fill="url(#glassSlab)"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Git Commit Tree Lines on the surface */}
          <circle cx="70" cy="60" r="4" fill="#38bdf8" />
          <circle cx="100" cy="52" r="5" fill="#c084fc" />
          <circle cx="130" cy="62" r="4" fill="#38bdf8" />
          <circle cx="100" cy="74" r="3.5" fill="#34d399" />

          {/* Connecting Branch Filaments */}
          <path
            d="M70,60 L100,52 L130,62 M100,52 L100,74"
            stroke="#e0e7ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Floating AST Syntax Nodes */}
          <g transform="translate(138, 38)">
            <rect
              width="28"
              height="16"
              rx="4"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="1"
            />
            <text
              x="14"
              y="11"
              fill="#7dd3fc"
              fontSize="8"
              fontFamily="monospace"
              textAnchor="middle"
            >
              AST
            </text>
          </g>

          <g transform="translate(30, 42)">
            <rect
              width="26"
              height="16"
              rx="4"
              fill="#0f172a"
              stroke="#c084fc"
              strokeWidth="1"
            />
            <text
              x="13"
              y="11"
              fill="#d8b4fe"
              fontSize="8"
              fontFamily="monospace"
              textAnchor="middle"
            >
              git
            </text>
          </g>
        </g>

        {/* Glowing Top Node / Beacon */}
        <circle cx="100" cy="22" r="6" fill="#38bdf8" />
        <circle cx="100" cy="22" r="10" fill="#38bdf8" fillOpacity="0.25" />
        <line
          x1="100"
          y1="22"
          x2="100"
          y2="46"
          stroke="#7dd3fc"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
      </svg>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 2. FAULT LOCALIZATION 3D VISUAL: Ochiai Radar Reticle & Laser Defect Core
// ----------------------------------------------------------------------------
const FaultLocalization3DVisual: React.FC<{
  isHovered: boolean;
  prefersReducedMotion: boolean;
}> = ({ isHovered, prefersReducedMotion }) => {
  return (
    <div
      className={`relative w-44 h-36 flex items-center justify-center ${
        !prefersReducedMotion ? "animate-float-medium" : ""
      }`}
    >
      {/* Background Red/Cyan Ambient Flare */}
      <div className="absolute inset-0 bg-blue-500/15 blur-xl rounded-full scale-75" />

      <svg
        viewBox="0 0 200 160"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(59,130,246,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="radarSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="diskFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#090d16" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Base Elliptical 3D Tilted Radar Disk */}
        <ellipse
          cx="100"
          cy="90"
          rx="72"
          ry="38"
          fill="url(#diskFace)"
          stroke="#3b82f6"
          strokeWidth="1.5"
        />

        {/* Concentric Inner Rings */}
        <ellipse
          cx="100"
          cy="90"
          rx="52"
          ry="26"
          stroke="#60a5fa"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <ellipse
          cx="100"
          cy="90"
          rx="32"
          ry="16"
          stroke="#93c5fd"
          strokeWidth="1"
        />

        {/* Crosshair Axes */}
        <line x1="28" y1="90" x2="172" y2="90" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1="100" y1="52" x2="100" y2="128" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="3 3" />

        {/* Rotating Radar Sweep Beam */}
        <g transform="translate(100, 90)">
          <path
            d="M0,0 L64,-16 A72,38 0 0,0 48,-28 Z"
            fill="url(#radarSweepGrad)"
            className={!prefersReducedMotion ? "animate-radar-spin" : ""}
            style={{ transformOrigin: "0 0" }}
          />
        </g>

        {/* Hotspot Defect Target Lock at (114, 82) */}
        <g transform="translate(116, 82)">
          {/* Pulsing Red Core */}
          <circle cx="0" cy="0" r="8" fill="#ef4444" fillOpacity="0.4" className="animate-ping" />
          <circle cx="0" cy="0" r="5" fill="#f87171" stroke="#ef4444" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="2" fill="#fff" />

          {/* Holographic Suspiciousness Tag */}
          <g transform="translate(8, -18)">
            <rect
              width="50"
              height="16"
              rx="4"
              fill="#090d16"
              stroke="#ef4444"
              strokeWidth="1.2"
            />
            <text
              x="25"
              y="11"
              fill="#fca5a5"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              0.94 Ochiai
            </text>
          </g>
        </g>

        {/* Floating Target Reticle Ring (lifts on hover) */}
        <g
          transform={isHovered ? "translate(0, -8)" : "translate(0, 0)"}
          className="transition-transform duration-500 ease-out"
        >
          <ellipse
            cx="100"
            cy="52"
            rx="24"
            ry="12"
            stroke="#38bdf8"
            strokeWidth="1.5"
            fill="none"
          />
          <line x1="76" y1="52" x2="124" y2="52" stroke="#38bdf8" strokeWidth="1" />
          <line x1="100" y1="40" x2="100" y2="64" stroke="#38bdf8" strokeWidth="1" />
          <circle cx="100" cy="52" r="3" fill="#38bdf8" />
        </g>
      </svg>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 3. HYPOTHESIS GENERATION 3D VISUAL: Crystalline Brain Prism & MCTS Branches
// ----------------------------------------------------------------------------
const HypothesisGeneration3DVisual: React.FC<{
  isHovered: boolean;
  prefersReducedMotion: boolean;
}> = ({ isHovered, prefersReducedMotion }) => {
  return (
    <div
      className={`relative w-44 h-36 flex items-center justify-center ${
        !prefersReducedMotion ? "animate-float-slow" : ""
      }`}
    >
      {/* Background Purple Ambient Flare */}
      <div className="absolute inset-0 bg-purple-600/15 blur-xl rounded-full scale-75" />

      <svg
        viewBox="0 0 200 160"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(168,85,247,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="prismFace1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="prismFace2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b0764" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="prismFace3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d8b4fe" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Central 3D Crystalline Hex-Prism */}
        <g
          transform={isHovered ? "translate(0, -6)" : "translate(0, 0)"}
          className="transition-transform duration-500 ease-out"
        >
          {/* Top Facet */}
          <polygon
            points="100,35 132,54 100,72 68,54"
            fill="url(#prismFace3)"
            stroke="#e9d5ff"
            strokeWidth="1.2"
          />
          {/* Left Facet */}
          <polygon
            points="68,54 100,72 100,112 68,94"
            fill="url(#prismFace2)"
            stroke="#a855f7"
            strokeWidth="1"
          />
          {/* Right Facet */}
          <polygon
            points="100,72 132,54 132,94 100,112"
            fill="url(#prismFace1)"
            stroke="#c084fc"
            strokeWidth="1"
          />

          {/* Specular Edge Gleam */}
          <line x1="100" y1="35" x2="100" y2="72" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.8" />
        </g>

        {/* Branching Bayesian Reasoning Nodes */}
        {/* Branch 1 (Left): H1 */}
        <path
          d="M68,74 C45,74 38,90 34,106"
          stroke="#a855f7"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <g transform="translate(34, 106)">
          <circle cx="0" cy="0" r="7" fill="#1e1035" stroke="#34d399" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill="#34d399" />
          <rect x="-18" y="10" width="36" height="14" rx="3" fill="#0c0717" stroke="#34d399" strokeWidth="0.8" />
          <text x="0" y="20" fill="#a7f3d0" fontSize="7" fontFamily="monospace" textAnchor="middle">
            H1: 91%
          </text>
        </g>

        {/* Branch 2 (Center-Right): H2 */}
        <path
          d="M132,74 C150,74 158,88 162,102"
          stroke="#c084fc"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <g transform="translate(162, 102)">
          <circle cx="0" cy="0" r="7" fill="#1e1035" stroke="#c084fc" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="3" fill="#c084fc" />
          <rect x="-18" y="10" width="36" height="14" rx="3" fill="#0c0717" stroke="#c084fc" strokeWidth="0.8" />
          <text x="0" y="20" fill="#e9d5ff" fontSize="7" fontFamily="monospace" textAnchor="middle">
            H2: 68%
          </text>
        </g>

        {/* Branch 3 (Top Beams): Light rays */}
        <circle cx="100" cy="22" r="5" fill="#c084fc" />
        <circle cx="100" cy="22" r="10" fill="#c084fc" fillOpacity="0.25" />
      </svg>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 4. AUTOMATED CODE REPAIR 3D VISUAL: Split Diff Matrix & Laser AST Welder
// ----------------------------------------------------------------------------
const AutomatedCodeRepair3DVisual: React.FC<{
  isHovered: boolean;
  prefersReducedMotion: boolean;
}> = ({ isHovered, prefersReducedMotion }) => {
  return (
    <div
      className={`relative w-44 h-36 flex items-center justify-center ${
        !prefersReducedMotion ? "animate-float-medium" : ""
      }`}
    >
      {/* Background Cyan/Emerald Ambient Glow */}
      <div className="absolute inset-0 bg-cyan-500/15 blur-xl rounded-full scale-75" />

      <svg
        viewBox="0 0 200 160"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,242,254,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="diffPlateRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#450a0a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#180404" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="diffPlateGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Upper Diff Slab: Faulty Code Line (-) */}
        <g
          transform={isHovered ? "translate(-4, -4)" : "translate(0, 0)"}
          className="transition-transform duration-500 ease-out"
        >
          {/* Isometric Slab (Red/Minus) */}
          <polygon
            points="85,30 145,55 95,78 35,53"
            fill="url(#diffPlateRed)"
            stroke="#f87171"
            strokeWidth="1.2"
          />
          {/* Left Side */}
          <polygon
            points="35,53 95,78 95,88 35,63"
            fill="#2c0b0e"
            stroke="#ef4444"
            strokeWidth="0.8"
          />
          {/* Right Side */}
          <polygon
            points="95,78 145,55 145,65 95,88"
            fill="#3f0e13"
            stroke="#ef4444"
            strokeWidth="0.8"
          />

          {/* Red Minus Code Token */}
          <g transform="translate(55, 48)">
            <rect width="12" height="12" rx="2" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1" />
            <line x1="3" y1="6" x2="9" y2="6" stroke="#fca5a5" strokeWidth="1.5" />
            <text x="16" y="9" fill="#fca5a5" fontSize="7" fontFamily="monospace">
              - count / 0
            </text>
          </g>
        </g>

        {/* Lower Diff Slab: Synthesized Patch (+) */}
        <g
          transform={isHovered ? "translate(4, 4)" : "translate(0, 0)"}
          className="transition-transform duration-500 ease-out"
        >
          <polygon
            points="105,75 165,100 115,123 55,98"
            fill="url(#diffPlateGreen)"
            stroke="#34d399"
            strokeWidth="1.2"
          />
          {/* Left Side */}
          <polygon
            points="55,98 115,123 115,133 55,108"
            fill="#062d22"
            stroke="#10b981"
            strokeWidth="0.8"
          />
          {/* Right Side */}
          <polygon
            points="115,123 165,100 165,110 115,133"
            fill="#0b3b2d"
            stroke="#10b981"
            strokeWidth="0.8"
          />

          {/* Green Plus Code Token */}
          <g transform="translate(75, 93)">
            <rect width="12" height="12" rx="2" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1" />
            <line x1="6" y1="3" x2="6" y2="9" stroke="#6ee7b7" strokeWidth="1.5" />
            <line x1="3" y1="6" x2="9" y2="6" stroke="#6ee7b7" strokeWidth="1.5" />
            <text x="16" y="9" fill="#6ee7b7" fontSize="7" fontFamily="monospace">
              + if len &gt; 0:
            </text>
          </g>
        </g>

        {/* Central Laser Welding Spark / Splicing Arc */}
        <g transform="translate(100, 78)">
          <circle cx="0" cy="0" r="6" fill="#38bdf8" />
          <circle cx="0" cy="0" r="12" fill="#38bdf8" fillOpacity="0.3" className="animate-ping" />
          <line x1="-15" y1="-8" x2="15" y2="8" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="-8" y1="12" x2="8" y2="-12" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 5. PATCH VERIFICATION 3D VISUAL: Invariant Cyber Shield & Mutation Helix
// ----------------------------------------------------------------------------
const PatchVerification3DVisual: React.FC<{
  isHovered: boolean;
  prefersReducedMotion: boolean;
}> = ({ isHovered, prefersReducedMotion }) => {
  return (
    <div
      className={`relative w-44 h-36 flex items-center justify-center ${
        !prefersReducedMotion ? "animate-float-slow" : ""
      }`}
    >
      {/* Background Emerald Ambient Flare */}
      <div className="absolute inset-0 bg-emerald-500/15 blur-xl rounded-full scale-75" />

      <svg
        viewBox="0 0 200 160"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(16,185,129,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="shieldRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Orbiting Mutation Test Ring 1 */}
        <ellipse
          cx="100"
          cy="80"
          rx="74"
          ry="32"
          stroke="#10b981"
          strokeWidth="1.2"
          strokeDasharray="6 4"
          transform="rotate(-15 100 80)"
        />

        {/* Orbiting Mutation Test Ring 2 */}
        <ellipse
          cx="100"
          cy="80"
          rx="74"
          ry="32"
          stroke="#00f2fe"
          strokeWidth="1"
          strokeDasharray="4 4"
          transform="rotate(25 100 80)"
        />

        {/* Center 3D Hexagonal Invariant Shield (lifts on hover) */}
        <g
          transform={isHovered ? "translate(0, -6)" : "translate(0, 0)"}
          className="transition-transform duration-500 ease-out"
        >
          {/* Shield Outer Shell */}
          <polygon
            points="100,32 142,54 142,102 100,126 58,102 58,54"
            fill="url(#shieldGrad)"
            stroke="url(#shieldRim)"
            strokeWidth="2"
          />

          {/* Shield Inner Inset */}
          <polygon
            points="100,42 132,59 132,97 100,116 68,97 68,59"
            fill="#062d22"
            stroke="#34d399"
            strokeWidth="1"
            strokeOpacity="0.6"
          />

          {/* Verified Checkmark Icon inside Shield */}
          <path
            d="M86,78 L96,88 L116,66"
            stroke="#f0fdf4"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Floating Invariant Pass Badge */}
          <g transform="translate(112, 40)">
            <rect
              width="54"
              height="16"
              rx="4"
              fill="#064e3b"
              stroke="#6ee7b7"
              strokeWidth="1"
            />
            <text
              x="27"
              y="11"
              fill="#a7f3d0"
              fontSize="7.5"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              100% KILLED
            </text>
          </g>
        </g>

        {/* Floating Mutation Genome Particles */}
        <circle cx="45" cy="62" r="3" fill="#34d399" />
        <circle cx="155" cy="98" r="3" fill="#38bdf8" />
        <circle cx="140" cy="50" r="2.5" fill="#c084fc" />
      </svg>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 6. REVIEWER EXPLANATION 3D VISUAL: Holographic PR Audit Terminal & Seal
// ----------------------------------------------------------------------------
const ReviewerExplanation3DVisual: React.FC<{
  isHovered: boolean;
  prefersReducedMotion: boolean;
}> = ({ isHovered, prefersReducedMotion }) => {
  return (
    <div
      className={`relative w-44 h-36 flex items-center justify-center ${
        !prefersReducedMotion ? "animate-float-medium" : ""
      }`}
    >
      {/* Background Purple/Cyan Ambient Flare */}
      <div className="absolute inset-0 bg-purple-500/15 blur-xl rounded-full scale-75" />

      <svg
        viewBox="0 0 200 160"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(168,85,247,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="terminalFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0f0c29" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="prBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* 3D Isometric Console Screen (Back Layer) */}
        <polygon
          points="90,32 165,58 115,96 40,70"
          fill="url(#terminalFace)"
          stroke="#818cf8"
          strokeWidth="1.5"
        />

        {/* Terminal Header Bar */}
        <line x1="48" y1="67" x2="98" y2="84" stroke="#4f46e5" strokeWidth="1" />
        <circle cx="58" cy="64" r="2" fill="#ef4444" />
        <circle cx="65" cy="66" r="2" fill="#f59e0b" />
        <circle cx="72" cy="68" r="2" fill="#10b981" />

        {/* Terminal Text Lines inside Console */}
        <line x1="60" y1="74" x2="90" y2="84" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="66" y1="80" x2="110" y2="95" stroke="#c7d2fe" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="72" y1="86" x2="120" y2="103" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Floating Holographic Pull Request Card (lifts on hover) */}
        <g
          transform={isHovered ? "translate(0, -8)" : "translate(0, 0)"}
          className="transition-transform duration-500 ease-out"
        >
          {/* Frosted PR Card */}
          <polygon
            points="95,50 160,72 125,115 60,93"
            fill="#0b0f19"
            fillOpacity="0.85"
            stroke="#c084fc"
            strokeWidth="1.8"
          />

          {/* GitHub PR Icon & Title */}
          <g transform="translate(85, 78)">
            <circle cx="0" cy="0" r="7" fill="#7e22ce" stroke="#e9d5ff" strokeWidth="1" />
            <text x="0" y="3" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
              PR
            </text>
          </g>

          {/* Approved Green Seal Stamp */}
          <g transform="translate(125, 96)">
            <circle cx="0" cy="0" r="10" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
            <path
              d="M-4,0 L-1,3 L5,-3"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Floating Confidence Badge */}
          <g transform="translate(100, 36)">
            <rect
              width="58"
              height="16"
              rx="4"
              fill="#1e1035"
              stroke="#c084fc"
              strokeWidth="1"
            />
            <text
              x="29"
              y="11"
              fill="#e9d5ff"
              fontSize="7.5"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              98.4% CONF
            </text>
          </g>
        </g>

        {/* Ambient Orbiting Verification Nodes */}
        <circle cx="36" cy="85" r="3" fill="#c084fc" />
        <circle cx="168" cy="62" r="3.5" fill="#38bdf8" />
      </svg>
    </div>
  );
};
