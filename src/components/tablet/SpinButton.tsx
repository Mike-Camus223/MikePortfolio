import { useRef, useEffect } from "react";
import gsap from "gsap";
import { RotateCw } from "lucide-react";

type SpinButtonProps = {
  onPressStart: () => void;
  onPressEnd: () => void;
};

export function SpinButton({ onPressStart, onPressEnd }: SpinButtonProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const arcRef  = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const tlRef   = useRef<gsap.core.Timeline | null>(null);
  const spinRef = useRef<gsap.core.Tween | null>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const arc  = arcRef.current;
    const glow = glowRef.current;
    if (!root || !arc || !glow) return;

    gsap.set(arc,  { opacity: 0, rotation: 0, transformOrigin: "50% 50%", scale: 0.8, force3D: true });
    gsap.set(glow, { opacity: 0, scale: 0.8, force3D: true });

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    tl.to(root, { scale: 1.1, duration: 0.25, ease: "power3.out" }, 0)
      .to(arc,  { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(1.8)" }, 0)
      .to(glow, {
        opacity: 1, scale: 1.2, duration: 0.28, ease: "power3.out",
        boxShadow: "0 0 5px rgba(255,25,50,0.9), 0 0 16px rgba(255,25,50,0.55), 0 0 36px rgba(255,25,50,0.28)",
      }, 0);

    const spin = gsap.to(arc, { rotation: 360, duration: 1.6, ease: "none", repeat: -1, paused: true });
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
    <button
      ref={rootRef}
      onPointerDown={() => {
        new Audio("/sounds/click.mp3").play().catch(() => {});
        onPressStart();
      }}
      onPointerUp={onPressEnd}
      onPointerLeave={onPressEnd}
      className="relative inline-flex items-center justify-center cursor-pointer select-none pointer-events-auto"
      style={{ width: 44, height: 44, transformOrigin: "50% 50%" }}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute rounded-full"
        style={{ width: 40, height: 40, left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}
      />
      <div
        ref={arcRef}
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 52, height: 52, left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          background: `conic-gradient(rgba(255,25,50,0) 0%,rgba(255,25,50,0) 28%,rgba(255,80,100,0.65) 44%,rgba(255,255,255,1) 50%,rgba(255,80,100,0.65) 56%,rgba(255,25,50,0) 72%,rgba(255,25,50,0) 100%)`,
          WebkitMaskImage: `radial-gradient(circle, transparent 17px, black 18px, black 22px, transparent 23px)`,
          maskImage: `radial-gradient(circle, transparent 17px, black 18px, black 22px, transparent 23px)`,
        }}
      />
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-xl ring-2 ring-white/20">
        <RotateCw size={16} strokeWidth={1.5} absoluteStrokeWidth className="text-white" />
      </div>
    </button>
  );
}
