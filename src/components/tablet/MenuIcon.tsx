import { useRef, useEffect } from "react";
import gsap from "gsap";

type MenuIconProps = {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  size?: "normal" | "small";
};

export function MenuIcon({ title, icon, onClick, size = "normal" }: MenuIconProps) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const arcRef  = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);
  const tlRef   = useRef<gsap.core.Timeline | null>(null);
  const spinRef = useRef<gsap.core.Tween | null>(null);

  const coreSize = size === "small" ? "h-14 w-14" : "h-16 w-16";
  const arcW     = size === "small" ? 68 : 76;
  const glowW    = size === "small" ? 60 : 68;
  const arcTop   = size === "small" ? -3 : -4;
  const innerR   = size === "small" ? 26 : 30;
  const outerR   = size === "small" ? 33 : 37;
  const arcMask  = `radial-gradient(circle, transparent ${innerR}px, black ${innerR + 1}px, black ${outerR}px, transparent ${outerR + 1}px)`;

  useEffect(() => {
    const root = rootRef.current;
    const arc  = arcRef.current;
    const glow = glowRef.current;
    const core = coreRef.current;
    if (!root || !arc || !glow || !core) return;

    gsap.set(root, { scale: 1, transformOrigin: "50% 50%", force3D: true });
    gsap.set(arc,  { opacity: 0, rotation: 0, transformOrigin: "50% 50%", scale: 0.8, force3D: true });
    gsap.set(glow, { opacity: 0, scale: 0.8, force3D: true });
    gsap.set(core, { boxShadow: "0 0 0px rgba(255,25,50,0)" });

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    tl.to(root, { scale: 1.08, duration: 0.3, ease: "power3.out" }, 0)
      .to(arc,  { opacity: 1, scale: 1, duration: 0.26, ease: "back.out(1.8)" }, 0)
      .to(glow, {
        opacity: 1, scale: 1.2, duration: 0.32, ease: "power3.out",
        boxShadow: "0 0 6px rgba(255,25,50,0.95), 0 0 18px rgba(255,25,50,0.65), 0 0 42px rgba(255,25,50,0.35), 0 0 70px rgba(255,25,50,0.12)",
      }, 0)
      .to(core, { boxShadow: "0 0 8px rgba(255,35,55,0.35), 0 0 20px rgba(255,35,55,0.18)", duration: 0.32, ease: "power3.out" }, 0);

    const spin = gsap.to(arc, { rotation: 360, duration: 1.8, ease: "none", repeat: -1, paused: true });
    spinRef.current = spin;

    const onEnter = () => {
      if (isHovered.current) return;
      isHovered.current = true;
      spin.play();
      tl.play();
    };
    const onLeave = (e: MouseEvent) => {
      if (root.contains(e.relatedTarget as Node | null)) return;
      if (!isHovered.current) return;
      isHovered.current = false;
      tl.reverse();
      tl.eventCallback("onReverseComplete", () => {
        spin.pause();
        gsap.set(arc, { rotation: 0 });
      });
    };

    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
      tl.kill();
      spin.kill();
    };
  }, []);

  return (
    <a
      ref={rootRef}
      href="#"
      onClick={(e) => { if (onClick) { e.preventDefault(); onClick(); } }}
      className="relative inline-flex flex-col items-center gap-5 cursor-pointer pointer-events-auto select-none"
      style={{ transformOrigin: "50% 50%" }}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute rounded-full"
        style={{ width: glowW, height: glowW, left: "50%", top: 0, transform: "translateX(-50%)" }}
      />
      <div
        ref={arcRef}
        className="pointer-events-none absolute rounded-full"
        style={{
          width: arcW, height: arcW, left: "50%", top: arcTop, transform: "translateX(-50%)",
          background: `conic-gradient(rgba(255,25,50,0) 0%,rgba(255,25,50,0) 28%,rgba(255,80,100,0.65) 44%,rgba(255,255,255,1) 50%,rgba(255,80,100,0.65) 56%,rgba(255,25,50,0) 72%,rgba(255,25,50,0) 100%)`,
          WebkitMaskImage: arcMask,
          maskImage: arcMask,
        }}
      />
      <div
        ref={coreRef}
        className={`menu-core relative z-10 flex ${coreSize} shrink-0 items-center justify-center rounded-full bg-black/60 backdrop-blur-xl ring-2 ring-white/20 will-change-transform`}
      >
        {icon}
      </div>
      <span className="relative z-10 text-xs uppercase tracking-wider text-white drop-shadow text-center leading-tight">
        {title}
      </span>
    </a>
  );
}
