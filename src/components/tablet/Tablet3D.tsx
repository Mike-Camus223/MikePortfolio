// Tablet3D.tsx
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import gsap from "gsap";
import TabletUnlockScreen from "./TabletUnlockScreen";
import { CursorNDCContext, type CursorNDC } from "./context/CursorNDCContext";

type Rotation = {
  rotateX: number;
  rotateY: number;
};

const BASE_ROTATION: Rotation = { rotateX: 14, rotateY: -22 };
const BASE_ROTATE_Z = 8;
const MAX_ROTATION = 3;
const LERP = 0.12;

export default function Tablet3D({ onHoverZoneChange }: { onHoverZoneChange?: (inside: boolean) => void }) {
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cursorNDC, setCursorNDC] = useState<CursorNDC>(null);

  const isPoweredOnRef = useRef(isPoweredOn);
  useEffect(() => { isPoweredOnRef.current = isPoweredOn; }, [isPoweredOn]);

  const tabletRef           = useRef<HTMLDivElement>(null);
  const tablet3DRef         = useRef<HTMLDivElement>(null);
  const screenOverlayRef    = useRef<HTMLDivElement>(null);
  const screenContainerRef  = useRef<HTMLDivElement>(null);
  const trackingZoneRef     = useRef<HTMLDivElement>(null);

  const hintWrapperRef  = useRef<HTMLDivElement>(null);
  const arrowPathVRef   = useRef<SVGPathElement>(null);
  const arrowPathHRef   = useRef<SVGPathElement>(null);
  const arrowHeadRef    = useRef<SVGPolygonElement>(null);
  const hintTextRef     = useRef<HTMLSpanElement>(null);
  const hintTlRef       = useRef<gsap.core.Timeline | null>(null);
  const autoHintShown   = useRef(false);
  const isHoveringBtn   = useRef(false);
  const isOverPowerBtn  = useRef(false);
  const isInsideZone    = useRef(false);

  const current  = useRef<Rotation>({ ...BASE_ROTATION });
  const target   = useRef<Rotation>({ ...BASE_ROTATION });
  const frameRef = useRef<number | null>(null);

  // ============================================================================
  // 3D ROTATION
  // ============================================================================
  const applyTransform = () => {
    if (!tabletRef.current) return;
    const { rotateX, rotateY } = current.current;
    const t = `rotateZ(${BASE_ROTATE_Z}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    tabletRef.current.style.transform = t;
    if (tablet3DRef.current) tablet3DRef.current.style.transform = t;
  };

  const animate3D = () => {
    if (!tabletRef.current) return;

    // Stop 3D rotation if navigation animation is active
    if (document.body.style.overflow === "hidden") {
      frameRef.current = null;
      return;
    }

    const dx = target.current.rotateX - current.current.rotateX;
    const dy = target.current.rotateY - current.current.rotateY;
    
    // Smooth lerp
    current.current.rotateX += dx * LERP;
    current.current.rotateY += dy * LERP;
    
    applyTransform();

    if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
      frameRef.current = requestAnimationFrame(animate3D);
    } else {
      current.current = { ...target.current };
      applyTransform();
      frameRef.current = null;
    }
  };

  // ============================================================================
  // 3D ROTATION HANDLERS
  // ============================================================================
  const onMouseMove = (e: ReactMouseEvent) => {
    const zone = trackingZoneRef.current;
    if (!zone) return;

    const rect = zone.getBoundingClientRect();
    
    if (!isInsideZone.current) {
      isInsideZone.current = true;
      onHoverZoneChange?.(true);
    }

    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    target.current = {
      rotateX: BASE_ROTATION.rotateX - ny * MAX_ROTATION,
      rotateY: BASE_ROTATION.rotateY + nx * MAX_ROTATION,
    };
    
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(animate3D);
    }

    setCursorNDC({ x: nx, y: ny });
  };

  const onMouseLeaveZone = () => {
    if (isInsideZone.current) {
      isInsideZone.current = false;
      onHoverZoneChange?.(false);
      target.current = { ...BASE_ROTATION };
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(animate3D);
      }
      setCursorNDC(null);
    }
  };

  // ============================================================================
  // POWER
  // ============================================================================
  const animatePowerOff = () => {
    if (!screenOverlayRef.current || !screenContainerRef.current) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsPoweredOn(false);
        setIsAnimating(false);
        if (screenContainerRef.current)
          gsap.set(screenContainerRef.current, { scaleY: 1, scaleX: 1, opacity: 1 });
        if (screenOverlayRef.current)
          screenOverlayRef.current.style.pointerEvents = "none";
      },
    });

    tl.fromTo(
      screenOverlayRef.current,
      { opacity: 0, backgroundColor: "rgba(255,255,255,0)" },
      { opacity: 1, backgroundColor: "rgba(255,255,255,0.06)", duration: 0.08, ease: "power1.in" }
    );
    tl.to(
      screenContainerRef.current,
      { scaleY: 0.0, scaleX: 0.85, opacity: 0, duration: 0.38, ease: "power3.in", transformOrigin: "center center" },
      "-=0.02"
    );
    tl.to(
      screenOverlayRef.current,
      { opacity: 1, backgroundColor: "rgba(0,0,0,1)", duration: 0.1, ease: "none" },
      "-=0.05"
    );
  };

  const animatePowerOn = () => {
    setIsPoweredOn(true);
    setIsAnimating(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!screenOverlayRef.current || !screenContainerRef.current) return;

        gsap.set(screenContainerRef.current, {
          scaleY: 0.0, scaleX: 0.85, opacity: 0, transformOrigin: "center center",
        });
        gsap.set(screenOverlayRef.current, { opacity: 1, backgroundColor: "rgba(0,0,0,1)" });

        const tl = gsap.timeline({
          onComplete: () => {
            setIsAnimating(false);
            if (screenOverlayRef.current)
              screenOverlayRef.current.style.pointerEvents = "none";
          },
        });

        tl.to({}, { duration: 0.12 });
        tl.to(screenContainerRef.current, { scaleY: 1, scaleX: 1, opacity: 1, duration: 0.45, ease: "power2.out" });
        tl.fromTo(
          screenOverlayRef.current,
          { opacity: 1, backgroundColor: "rgba(255,255,255,0.12)" },
          { opacity: 0, backgroundColor: "rgba(255,255,255,0)", duration: 0.35, ease: "power2.out" },
          "-=0.1"
        );
      });
    });
  };

  const togglePower = () => {
    if (isAnimating) return;
    hideHintUI();
    const sound = new Audio(isPoweredOnRef.current ? "/sounds/power.mp3" : "/sounds/power_init.mp3");
    sound.volume = 0.6;
    sound.play().catch((error) => console.error("No se pudo reproducir el sonido:", error));
    if (isPoweredOnRef.current) animatePowerOff();
    else animatePowerOn();
  };

  // ============================================================================
  // HINT
  // ============================================================================
  const playHintAnimation = () => {
    const pathV   = arrowPathVRef.current;
    const pathH   = arrowPathHRef.current;
    const head    = arrowHeadRef.current;
    const text    = hintTextRef.current;
    const wrapper = hintWrapperRef.current;
    if (!pathV || !pathH || !head || !text || !wrapper) return;

    hintTlRef.current?.kill();

    const pathVLength = pathV.getTotalLength();
    const pathHLength = pathH.getTotalLength();

    gsap.set(wrapper, { opacity: 1 });
    gsap.set(pathV, { strokeDasharray: pathVLength, strokeDashoffset: pathVLength, opacity: 1 });
    gsap.set(pathH, { strokeDasharray: pathHLength, strokeDashoffset: pathHLength, opacity: 1 });
    gsap.set(head,  { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
    gsap.set(text,  { opacity: 0, y: -4 });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
    tl.to(pathV, { strokeDashoffset: 0, duration: 0.3, ease: "power2.inOut" });
    tl.to(pathH, { strokeDashoffset: 0, duration: 0.25, ease: "power2.inOut" }, "-=0.04");
    tl.to(head,  { opacity: 1, scale: 1, duration: 0.18, ease: "back.out(2.5)" }, "-=0.05");
    tl.to(text,  { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, "-=0.1");
    tl.to({}, { duration: 0.8 });
    tl.to([pathV, pathH, head, text], { opacity: 0, duration: 0.28, ease: "power2.in", stagger: 0.03 });

    hintTlRef.current = tl;
  };

  const showHintUI = () => {
    if (!isOverPowerBtn.current) return;
    isHoveringBtn.current = true;
    if (showHint) {
      if (!hintTlRef.current || !hintTlRef.current.isActive()) playHintAnimation();
      return;
    }
    setShowHint(true);
    requestAnimationFrame(() => requestAnimationFrame(() => playHintAnimation()));
  };

  const hideHintUI = () => {
    isHoveringBtn.current = false;
    isOverPowerBtn.current = false;
    hintTlRef.current?.kill();
    hintTlRef.current = null;
    if (!hintWrapperRef.current) { setShowHint(false); return; }
    gsap.to(hintWrapperRef.current, {
      opacity: 0, duration: 0.2,
      onComplete: () => { if (!isHoveringBtn.current) setShowHint(false); },
    });
  };

  useEffect(() => {
    if (autoHintShown.current) return;
    const timer = setTimeout(() => {
      autoHintShown.current = true;
      if (!isHoveringBtn.current) showHintUI();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    applyTransform();
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      hintTlRef.current?.kill();
    };
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div id="tablet-container-3d" className="flex items-center justify-center min-h-screen bg-transparent">
      <div
        ref={trackingZoneRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeaveZone}
        className="relative"
        style={{ width: "1020px", height: "740px" }}
      >
        <div
          id="tablet-inner-wrapper"
          className="absolute"
          style={{ top: "60px", left: "60px", width: "900px", height: "620px", perspective: "3000px", pointerEvents: "none" }}
        >
          {/* ── CAPA 1: Marco 3D decorativo ── */}
          <div
            ref={tabletRef}
            id="tablet-3d-model"
            className="absolute inset-0 transform-gpu [transform-style:preserve-3d] will-change-transform pointer-events-none"
          >
            <div className="absolute inset-0 translate-y-14 scale-95 rounded-[3.5rem] bg-black/55 blur-3xl" />
            <div
              className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950"
              style={{ transform: "translateZ(-24px)" }}
            />
            <div className="absolute inset-0 rounded-[3.5rem] border border-white/10 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black shadow-[0_45px_120px_rgba(0,0,0,0.85)]">
              <div className="absolute inset-[6px] rounded-[3.1rem] bg-gradient-to-br from-zinc-700/30 to-black/60" />
              <div className="absolute inset-[24px] rounded-[2.8rem] bg-black" />
              <div className="pointer-events-none absolute inset-0 rounded-[3.5rem] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.18),inset_-3px_-3px_10px_rgba(0,0,0,0.75)]" />
            </div>
            <div
              className="absolute left-1/2 top-[10px] h-3 w-3 rounded-full bg-zinc-900 ring-1 ring-white/10"
              style={{ transform: "translateX(-50%) translateZ(10px)" }}
            >
              <div className="absolute inset-[3px] rounded-full bg-zinc-800" />
            </div>
            <div
              className="absolute right-[-7px] top-40 h-24 w-[7px] rounded-full bg-gradient-to-b from-zinc-400 to-zinc-700"
              style={{ transform: "translateZ(-7px)" }}
            />
            <div
              className="absolute right-[-8px] top-72 h-16 w-[8px] rounded-full bg-gradient-to-b from-zinc-400 to-zinc-700"
              style={{ transform: "translateZ(-8px)" }}
            />
          </div>

          {/* ── CAPA 2: Pantalla interactiva ── */}
          <div
            ref={tablet3DRef}
            className="absolute inset-0 transform-gpu will-change-transform pointer-events-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div 
              className="absolute inset-[24px] overflow-hidden rounded-[2.8rem] pointer-events-auto"
              style={{ transform: "translateZ(1px)" }} // Tiny Z offset to stay above bezel
            >
              <div
                ref={screenContainerRef}
                id="tablet-screen-content"
                className="absolute inset-0 rounded-[2.8rem] overflow-hidden"
                style={{ transformOrigin: "center center" }}
              >
                {isPoweredOn ? (
                  // NDC viaja por contexto — TabletUnlockScreen no se toca
                  <CursorNDCContext.Provider value={cursorNDC}>
                    <TabletUnlockScreen />
                  </CursorNDCContext.Provider>
                ) : (
                  <div className="w-full h-full bg-black" />
                )}
              </div>

              <div
                ref={screenOverlayRef}
                className="absolute inset-0 rounded-[2.8rem]"
                style={{ opacity: 0, backgroundColor: "rgba(0,0,0,0)", pointerEvents: "none" }}
              />
            </div>

            {/* Botón de encendido clickeable */}
            <button
              onClick={togglePower}
              onMouseEnter={() => { isOverPowerBtn.current = true; showHintUI(); }}
              onMouseLeave={() => { hideHintUI(); }}
              className="absolute cursor-pointer z-50 bg-transparent border-0 outline-none"
              style={{ top: "288px", right: "-22px", width: "52px", height: "64px", pointerEvents: "auto" }}
              aria-label="Botón de encendido"
            />

            {showHint && (
              <div
                ref={hintWrapperRef}
                className="pointer-events-none select-none absolute z-50 flex flex-col items-start"
                style={{ top: "320px", right: "-30px", transform: "translateX(100%)", paddingLeft: "4px" }}
              >
                <svg
                  width="64" height="52" viewBox="0 0 64 52"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ overflow: "visible", flexShrink: 0 }}
                >
                  <path
                    ref={arrowPathVRef}
                    d="M 4 8 L 52 8"
                    fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.75))" }}
                  />
                  <path
                    ref={arrowPathHRef}
                    d="M 52 8 L 52 44"
                    fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.75))" }}
                  />
                  <polygon
                    ref={arrowHeadRef}
                    points="46,40 52,56 58,40"
                    fill="white"
                    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.75))" }}
                  />
                </svg>
                <span
                  ref={hintTextRef}
                  className="text-white font-light uppercase whitespace-nowrap"
                  style={{
                    fontSize: "10px", letterSpacing: "0.2em",
                    textShadow: "0 0 10px rgba(255,255,255,0.85)",
                    marginTop: "15px", marginLeft: "8px",
                  }}
                >
                  {isPoweredOn ? "Power Off" : "Power On"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}