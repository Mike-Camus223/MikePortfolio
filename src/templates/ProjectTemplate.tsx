import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Mouse, ChevronRight } from "lucide-react";
import BackendIcon from "../components/icons-backend/icons-backend";
import Icon from "../components/icons/icons";

const PROJECTS = [
  {
    id: 0,
    image: "https://cdn.sanity.io/images/ttkr69ly/production/42902a860a0fe6a035193d507f3c3e2ee315f3aa-1920x1080.png?w=1440&h=810&q=80&fit=crop&auto=format",
    sector: "AI-Native Entertainment Studio",
    title: "Secret Level",
    description: "Plataforma de entretenimiento impulsada por IA que ofrece experiencias personalizadas únicas para cada usuario.",
    techs: [
      { name: "React", icon: <Icon name="react" size={15} /> },
      { name: "TypeScript", icon: <Icon name="typescript" size={15} /> },
      { name: "Tailwind", icon: <Icon name="tailwind" size={15} /> },
      { name: "Supabase", icon: <BackendIcon name="supabase" size={15} /> },
    ],
    href: "/",
  },
  {
    id: 1,
    image: "https://static.bandainamcoent.eu/high/dark-souls/brand-setup/ds3_thumb_brand_624x468.jpg",
    sector: "Blockchain Infrastructure",
    title: "Cipher Vault",
    description: "Infraestructura descentralizada para custodia de activos digitales con auditoría en tiempo real y contratos inteligentes.",
    techs: [
      { name: "React", icon: <Icon name="react" size={15} /> },
      { name: "TypeScript", icon: <Icon name="typescript" size={15} /> },
      { name: "Tailwind", icon: <Icon name="tailwind" size={15} /> },
      { name: "Firebase", icon: <BackendIcon name="firebase" size={15} /> },
    ],
    href: "/",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1440&h=810&fit=crop&auto=format&q=80",
    sector: "SaaS · Developer Tools",
    title: "Orbit Studio",
    description: "Suite colaborativa para equipos de producto: diseño, código y despliegue en un único entorno unificado.",
    techs: [
      { name: "Vue", icon: <Icon name="vue" size={15} /> },
      { name: "TypeScript", icon: <Icon name="typescript" size={15} /> },
      { name: "Sass", icon: <Icon name="sass" size={15} /> },
      { name: "Supabase", icon: <BackendIcon name="supabase" size={15} /> },
    ],
    href: "/",
  },
] as const;

const TOTAL = PROJECTS.length;
const ARC_C = 1300;
const CARD_SCALE_X = 0.85;
const CARD_SCALE_Y = 0.78;
const WHEEL_R = 340;
const SLOT_DEG = 360 / TOTAL;
const LERP_SPEED = 0.09;
const SVG_O = "260 260";

export default function ProjectPage() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const lensWrapRef = useRef<HTMLDivElement>(null);
  const innerImageRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const pressClickRef = useRef<HTMLDivElement>(null);
  const contentLeftRef = useRef<HTMLDivElement>(null);
  const sideDotsRef = useRef<HTMLDivElement>(null);
  const slideCounterRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const contentOverlayRef = useRef<HTMLDivElement>(null);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayTitleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const overlayParaRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const overlaySectorRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const overlayTechsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayButtonRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const ringGroupRef = useRef<SVGGElement>(null);
  const textArcRef = useRef<SVGGElement>(null);
  const tickGroupRef = useRef<SVGGElement>(null);
  const recRef = useRef<SVGGElement>(null);
  const focusRingRef = useRef<SVGCircleElement>(null);
  const crosshairRef = useRef<SVGGElement>(null);
  const arcSweepRef = useRef<SVGCircleElement>(null);
  const lensGlowRef = useRef<SVGCircleElement>(null);
  const outerRingRef = useRef<SVGCircleElement>(null);

  const hoverActive = useRef(false);
  const isRevealed = useRef(false);
  const hasClicked = useRef(false);
  const wheelPos = useRef(0);
  const wheelTarget = useRef(0);
  const rafId = useRef<number>(0);
  const [, forceRender] = useState(0);
  const isAnimating = useRef(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const lastAnimatedIdxRef = useRef<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const introTimeline = useRef<gsap.core.Timeline | null>(null);
  const activeAnimRef = useRef<gsap.core.Timeline | null>(null);
  const overlayCache = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const overlayRaf = useRef(0);
  const isLowPerf = useRef(false);
  const sideDotIndicatorRef = useRef<HTMLDivElement>(null);
  const shutterRef = useRef<HTMLDivElement>(null);
  const shutterSound = useRef<HTMLAudioElement | null>(null);


  const syncOverlayPosition = useCallback(() => {
    if (!innerImageRef.current || !sceneRef.current) return;
    const cardRect = innerImageRef.current.getBoundingClientRect();
    const sceneRect = sceneRef.current.getBoundingClientRect();
    const left = cardRect.left - sceneRect.left;
    const top = cardRect.top - sceneRect.top;
    const width = cardRect.width;
    const height = cardRect.height;
    const cache = overlayCache.current;
    if (cache && cache.left === left && cache.top === top && cache.width === width && cache.height === height) return;
    overlayCache.current = { left, top, width, height };
    const transform = "rotate(4deg)";
    overlayInnerRefs.current.forEach(el => {
      if (!el) return;
      Object.assign(el.style, {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform,
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
      });
    });
  }, []);

  const triggerProjectAnimation = useCallback((i: number) => {
    if (!isRevealed.current || lastAnimatedIdxRef.current === i) return;
    lastAnimatedIdxRef.current = i;

    if (!overlayRaf.current) {
      overlayRaf.current = requestAnimationFrame(() => {
        syncOverlayPosition();
        overlayRaf.current = 0;
      });
    }

    if (activeAnimRef.current) activeAnimRef.current.kill();

    const tl = gsap.timeline();
    activeAnimRef.current = tl;

    const titleLetters = overlayTitleRefs.current[i]?.querySelectorAll("span");
    const sector = overlaySectorRefs.current[i];
    const para = overlayParaRefs.current[i];
    const techs = overlayTechsRefs.current[i];
    const button = overlayButtonRefs.current[i];

    overlayRefs.current.forEach((ref, idx) => {
      if (ref && idx !== i) {
        gsap.to(ref, { opacity: 0, pointerEvents: "none", duration: 0.3, overwrite: "auto" });
      }
    });

    if (overlayRefs.current[i]) {
      gsap.to(overlayRefs.current[i], { opacity: 1, pointerEvents: "auto", duration: 0.3, overwrite: "auto" });
    }

    if (titleLetters?.length) {
      tl.fromTo(titleLetters,
        { opacity: 0, y: 20, scale: 0.8, filter: "blur(10px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.02, ease: "expo.out" }, 0);
    }

    if (sector) tl.fromTo(sector, { opacity: 0, y: 15, filter: "blur(5px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }, 0.1);
    if (para) tl.fromTo(para, { opacity: 0, y: 15, filter: "blur(5px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }, 0.2);
    if (techs) tl.fromTo(techs, { opacity: 0, y: 15, filter: "blur(5px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }, 0.3);
    if (button) tl.fromTo(button, { opacity: 0, scale: 0.5, filter: "blur(5px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "back.out(1.7)" }, 0.4);
  }, [syncOverlayPosition]);

  const triggerShutter = useCallback(() => {
    if (!shutterRef.current) return;

    const svg = shutterRef.current.querySelector("svg");
    if (!svg) return;

    const irisBody = svg.querySelector(".iris-body") as SVGElement | null;
    const irisHole = svg.querySelector(".iris-hole") as SVGElement | null;
    const irisRing = svg.querySelector(".iris-ring") as SVGElement | null;
    const irisFlash = svg.querySelector(".iris-flash") as SVGElement | null;
    const spokes = Array.from({ length: 4 }, (_, i) =>
      svg.querySelector(`.iris-spoke-${i}`) as SVGElement | null
    ).filter((el): el is SVGElement => el !== null);

    if (!irisBody || !irisHole || !irisRing || !irisFlash) return;

    // Reset limpio antes de cada disparo
    gsap.killTweensOf([irisBody, irisHole, irisRing, irisFlash, ...spokes]);
    gsap.set(irisBody, { opacity: 0 });
    gsap.set(irisHole, { scale: 1, svgOrigin: "50 50" });
    gsap.set(irisRing, { opacity: 0, strokeDashoffset: 251 });
    gsap.set(irisFlash, { opacity: 0 });
    gsap.set(spokes, { opacity: 0, rotation: 0, svgOrigin: "50 50" });

    if (shutterSound.current) {
      try {
        shutterSound.current.pause();
        shutterSound.current.currentTime = 0;

        const playPromise = shutterSound.current.play();

        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // fallback silencioso: el navegador bloqueó autoplay
          });
        }
      } catch (e) {
        // fail silencioso también
      }
    }
    const tl = gsap.timeline({ defaults: { force3D: true } });

    // 1 — Anillo barre el círculo como radar (GPU: strokeDashoffset)
    tl.to(irisRing, {
      opacity: 0.85,
      strokeDashoffset: 0,
      duration: 0.28,
      ease: "power2.in",
    }, 0);

    // 2 — Iris aparece y el hole ESCALA a 0 (GPU: scale, no attr r)
    tl.to(irisBody, { opacity: 1, duration: 0.04 }, 0.22);
    tl.to(irisHole, {
      scale: 0,
      svgOrigin: "50 50",
      duration: 0.26,
      ease: "expo.in",
    }, 0.24);
    tl.to(spokes, {
      opacity: 0.30,
      rotation: 20,
      svgOrigin: "50 50",
      duration: 0.26,
      ease: "expo.in",
    }, 0.24);

    // 3 — Flash (GPU: opacity)
    tl.to(irisFlash, { opacity: 0.14, duration: 0.05, ease: "none" }, 0.50);

    // 4 — Apertura
    tl.to(irisHole, {
      scale: 1,
      svgOrigin: "50 50",
      duration: 0.30,
      ease: "expo.out",
    }, 0.58);
    tl.to(spokes, {
      opacity: 0,
      rotation: 0,
      svgOrigin: "50 50",
      duration: 0.28,
      ease: "expo.out",
    }, 0.58);
    tl.to(irisRing, {
      opacity: 0,
      strokeDashoffset: -251,
      duration: 0.26,
      ease: "power2.out",
    }, 0.60);
    tl.to(irisFlash, { opacity: 0, duration: 0.20, ease: "power2.out" }, 0.58);
    tl.to(irisBody, { opacity: 0, duration: 0.06 }, 0.88);
  }, []);


  const applyWheelTransforms = useCallback(() => {
    const pos = wheelPos.current;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;

      let angleDeg = (i - pos) * SLOT_DEG;
      angleDeg = ((angleDeg % 360) + 540) % 360 - 180;

      const rad = (angleDeg * Math.PI) / 180;
      const cosA = Math.cos(rad);
      const sinA = Math.sin(rad);

      const ty = sinA * WHEEL_R;
      const tz = (cosA - 1) * WHEEL_R;
      const rotX = -angleDeg * 0.38;
      const sc = Math.max(0.28, 0.28 + 0.72 * ((cosA + 1) / 2));
      const op = Math.max(0, 0.08 + 0.92 * ((cosA + 1) / 2));

      el.style.transform = `translateY(${ty.toFixed(1)}px) translateZ(${tz.toFixed(1)}px) rotateX(${rotX.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      el.style.opacity = op.toFixed(3);
      el.style.zIndex = String(Math.round(cosA * 100 + 100));
    });

    if (sideDotIndicatorRef.current) {
      const SLOT_H = 16;
      const GAP = 6;
      const y = wheelPos.current * (SLOT_H + GAP) - 4;

      sideDotIndicatorRef.current.style.transform = `translateY(${y}px)`;
    }
  }, []);

  useEffect(() => {
    if (isRevealed.current) {
      triggerProjectAnimation(activeIdx);
    }
  }, [activeIdx, triggerProjectAnimation]);


  const startLoop = useCallback(() => {
    if (isAnimating.current) return;

    isAnimating.current = true;
    cancelAnimationFrame(rafId.current);

    let lastTime = 0;

    const tick = (time: number) => {
      if (time - lastTime < 8) {
        rafId.current = requestAnimationFrame(tick);
        return;
      }
      lastTime = time;

      const diff = wheelTarget.current - wheelPos.current;

      if (Math.abs(diff) > 0.001) {
        wheelPos.current += diff * LERP_SPEED;
        applyWheelTransforms();

        const nearest = Math.round(wheelPos.current);
        const newIdx = ((nearest % TOTAL) + TOTAL) % TOTAL;

        if (newIdx !== activeIdxRef.current) {
          activeIdxRef.current = newIdx;
          setActiveIdx(newIdx);
          forceRender(v => v + 1);
        }

        rafId.current = requestAnimationFrame(tick);
      } else {
        wheelPos.current = wheelTarget.current;
        applyWheelTransforms();

        const snapped = Math.round(wheelPos.current);
        const newIdx = ((snapped % TOTAL) + TOTAL) % TOTAL;

        if (newIdx !== activeIdxRef.current) {
          activeIdxRef.current = newIdx;
          setActiveIdx(newIdx);
          forceRender(v => v + 1);
        }

        isAnimating.current = false;
      }
    };

    rafId.current = requestAnimationFrame(tick);
  }, [applyWheelTransforms]);


  const goTo = useCallback((idx: number) => {
    wheelTarget.current = idx;
    startLoop();
  }, [startLoop]);

  useEffect(() => {
    let periodicShutter: gsap.core.Tween | null = null;
    const ctx = gsap.context(() => {
      gsap.set(lensWrapRef.current, { opacity: 0, scale: 0.88, force3D: true });
      gsap.set(innerImageRef.current, { borderRadius: "50%", force3D: true });
      gsap.set(focusRingRef.current, { attr: { r: 255 }, opacity: 0 });
      gsap.set(crosshairRef.current, { opacity: 0 });
      gsap.set(arcSweepRef.current, { opacity: 0, strokeDashoffset: ARC_C });
      gsap.set(lensGlowRef.current, { opacity: 0, attr: { r: 60 } });
      gsap.set(outerRingRef.current, { opacity: 0, scale: 1.18, svgOrigin: SVG_O });
      gsap.set(recRef.current, { opacity: 0 });
      gsap.set(pressClickRef.current, { opacity: 0, y: 14 });
      gsap.set(cardInnerRef.current, { scaleX: 1, scaleY: 1, force3D: true });
      gsap.set(contentOverlayRef.current, { opacity: 0 });

      applyWheelTransforms();

      const intro = gsap.timeline({ delay: 0.15 });
      intro.call(() => {
        const cameraIntroSound = new Audio("/sounds/camera1.mp3");
        cameraIntroSound.volume = 0.8;
        cameraIntroSound.play().catch(() => { });
      }, [], 0);
      introTimeline.current = intro;
      intro.to(outerRingRef.current, { opacity: 0.35, scale: 1, svgOrigin: SVG_O, duration: 1.4, ease: "expo.out" }, 0);
      intro.to(lensWrapRef.current, { opacity: 1, scale: 1, duration: 1.6, ease: "expo.out", force3D: true }, 0.1);
      intro.to(arcSweepRef.current, { opacity: 0.7, strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 0.55);
      intro.to(arcSweepRef.current, { opacity: 0, duration: 0.6, ease: "power2.in" }, 1.9);
      intro.to(lensGlowRef.current, { opacity: 0.18, attr: { r: 200 }, duration: 0.8, ease: "power3.out" }, 0.8);
      intro.to(lensGlowRef.current, { opacity: 0, duration: 0.7, ease: "power2.in" }, 1.5);
      intro.fromTo(focusRingRef.current,
        { attr: { r: 255 }, opacity: 0.6 },
        { attr: { r: 207 }, opacity: 0, duration: 1.0, ease: "power3.inOut" }, 0.9);
      intro.to(crosshairRef.current, { opacity: 0.45, duration: 0.5, ease: "power2.out" }, 1.7);

      if (!isLowPerf.current) {
        gsap.to(ringGroupRef.current, { rotation: 360, svgOrigin: SVG_O, duration: 60, ease: "none", repeat: -1, force3D: true });
        gsap.to(textArcRef.current, { rotation: -360, svgOrigin: SVG_O, duration: 100, ease: "none", repeat: -1, force3D: true });
        gsap.to(tickGroupRef.current, { rotation: 360, svgOrigin: SVG_O, duration: 28, ease: "none", repeat: -1, force3D: true });
        intro.call(() => {
          triggerShutter();
        }, [], intro.duration() - 0.2);

      }

      const recCircle = recRef.current?.querySelector("circle");
      gsap.to(recRef.current, { opacity: 1, duration: 0.8, delay: 2.0 });
      if (recCircle) {
        gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.6, delay: 2.0 })
          .to(recCircle, { opacity: 0, duration: 0.45 })
          .to(recCircle, { opacity: 1, duration: 0.45 });
      }
      gsap.to(pressClickRef.current, { opacity: 1, y: 0, duration: 1.0, delay: 2.2 });
      gsap.timeline({ repeat: -1, yoyo: true, delay: 2.2 })
        .to(pressClickRef.current, { opacity: 0.5, scale: 0.95, duration: 2.2, ease: "sine.inOut" });

      // Shutter automático cada 10s mientras el usuario no haya clickeado
      periodicShutter = gsap.delayedCall(10, function repeat() {
        if (!hasClicked.current) {
          triggerShutter();
          gsap.delayedCall(10, repeat);
        }
      });

    }, sceneRef);

    return () => {
      ctx.revert();
      periodicShutter?.kill();
      cancelAnimationFrame(rafId.current);
      cancelAnimationFrame(overlayRaf.current);
    };
  }, [applyWheelTransforms]);

  useEffect(() => {
    const onResize = () => {
      if (!overlayRaf.current) {
        overlayRaf.current = requestAnimationFrame(() => {
          syncOverlayPosition();
          overlayRaf.current = 0;
        });
      }
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [syncOverlayPosition]);

  useEffect(() => {
    if (!isStarted) return;
    const STEP = 1 / 5;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.max(-1, Math.min(1, e.deltaY));
      wheelTarget.current = Math.max(
        0,
        Math.min(TOTAL - 1, wheelTarget.current + delta * STEP)
      );
      startLoop();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isStarted, startLoop]);

  useEffect(() => {
    if (!isStarted) return;
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const dy = startY - e.touches[0].clientY;
      startY = e.touches[0].clientY;
      wheelTarget.current = Math.max(0, Math.min(TOTAL - 1, wheelTarget.current + (dy / 80) * 0.5));
      startLoop();
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [isStarted, startLoop]);

  useEffect(() => {
    if (!isStarted) return;
    const container = innerImageRef.current;
    if (!container) return;

    const onMove = (e: MouseEvent) => {
      if (!hoverActive.current) return;
      const rect = container.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      gsap.to(container, {
        x: dx * -10, y: dy * -7, rotateY: dx * -3.5, rotateX: dy * 3.5,
        duration: 0.5, ease: "power2.out", overwrite: "auto", force3D: true,
        onUpdate: () => {
          if (!overlayRaf.current) {
            overlayRaf.current = requestAnimationFrame(() => {
              syncOverlayPosition();
              overlayRaf.current = 0;
            });
          }
        }
      });
    };
    const onEnter = () => {
      hoverActive.current = true;
      window.addEventListener("mousemove", onMove);
    };
    const onLeave = () => {
      hoverActive.current = false;
      window.removeEventListener("mousemove", onMove);

      gsap.to(container, {
        x: 0, y: 0, rotateY: 0, rotateX: 0,
        duration: 0.9, ease: "expo.out", overwrite: "auto", force3D: true,
        onUpdate: () => {
          if (!overlayRaf.current) {
            overlayRaf.current = requestAnimationFrame(() => {
              syncOverlayPosition();
              overlayRaf.current = 0;
            });
          }
        }
      });
    };
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [isStarted, syncOverlayPosition]);


  useEffect(() => {
    return () => {
      activeAnimRef.current?.kill();
      introTimeline.current?.kill();
    };
  }, []);

  useEffect(() => {
    const update = () => {
      isLowPerf.current = window.innerWidth < 768;
    };

    update();
    window.addEventListener("resize", update, { passive: true });

    return () => window.removeEventListener("resize", update);
  }, []);


  useEffect(() => {
    shutterSound.current = new Audio("/sounds/camera3.mp3");
    shutterSound.current.volume = 0.8;
  }, []);

  const handleClick = useCallback(() => {
    if (hasClicked.current) return;
    hasClicked.current = true;
    setIsStarted(true);

    const vw = window.innerWidth;

    if (introTimeline.current) introTimeline.current.kill();
    gsap.killTweensOf([
      lensWrapRef.current,
      innerImageRef.current,
      crosshairRef.current,
      cardInnerRef.current,
      pressClickRef.current,
      vignetteRef.current,
      contentOverlayRef.current
    ]);

    gsap.to(pressClickRef.current, {
      opacity: 0, scale: 0.82, duration: 0.28, ease: "power3.in",
      onComplete: () => { if (pressClickRef.current) pressClickRef.current.style.display = "none"; },
    });

    const tl = gsap.timeline({ defaults: { force3D: true } });

    tl.to(lensWrapRef.current, { scale: 0.93, duration: 0.28, ease: "power2.in" }, 0);
    tl.to(lensWrapRef.current, { scale: 1.70, duration: 0.55, ease: "expo.out" }, 0.28);
    tl.call(() => { triggerShutter(); }, [], 0.28 + 0.55);
    tl.to(crosshairRef.current, { opacity: 0, duration: 0.18 }, 0.15);

    tl.to(innerImageRef.current, {
      rotate: 5, scaleX: CARD_SCALE_X, scaleY: CARD_SCALE_Y,
      duration: 0.85, ease: "expo.inOut",
    }, 0.82);
    tl.to(innerImageRef.current, { borderRadius: "14px", duration: 0.85, ease: "expo.inOut" }, 0.82);
    tl.to(cardInnerRef.current, {
      scaleX: 1 / CARD_SCALE_X, scaleY: 1 / CARD_SCALE_Y,
      duration: 0.85, ease: "expo.inOut",
    }, 0.82);

    tl.to(lensWrapRef.current, {
      scale: 1.70,
      x: vw * 0.08,
      duration: 1.3,
      ease: "expo.out",
      onUpdate: () => {
        if (!overlayRaf.current) {
          overlayRaf.current = requestAnimationFrame(() => {
            syncOverlayPosition();
            overlayRaf.current = 0;
          });
        }
      }
    }, 1.55);
    tl.call(() => {
      triggerShutter();
    }, [], 1.55 + 1.1);
    tl.to(vignetteRef.current, { opacity: 0.1, duration: 0.75 }, 1.55);

    tl.call(() => {
      if (!overlayRaf.current) {
        overlayRaf.current = requestAnimationFrame(() => {
          syncOverlayPosition();
          overlayRaf.current = 0;
        });
      }
    }, [], 2.85);

    tl.to(contentOverlayRef.current, {
      opacity: 1, duration: 0.55, ease: "power2.out",
      onComplete: () => {
        isRevealed.current = true;
        if (!overlayRaf.current) {
          overlayRaf.current = requestAnimationFrame(() => {
            syncOverlayPosition();
            overlayRaf.current = 0;
          });
        }
        applyWheelTransforms();
        triggerProjectAnimation(activeIdxRef.current);
      },
    }, 2.35);

    tl.fromTo(contentLeftRef.current,
      { opacity: 0, x: -52, skewX: -4 },
      { opacity: 1, x: 0, skewX: 0, duration: 1.0, pointerEvents: "auto", ease: "expo.out" }, 2.4);
    tl.fromTo(["#cl-sec", "#cl-desc", "#cl-title"],
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.075, ease: "power3.out" }, 2.5);
    tl.fromTo(slideCounterRef.current,
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "expo.out" }, 3);
    tl.to(sideDotsRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.7 }, 2.85);
  }, [applyWheelTransforms, syncOverlayPosition, triggerProjectAnimation]);

  return (
    <div
      ref={sceneRef}
      className="relative w-full h-screen bg-[#080808] flex items-center justify-center overflow-hidden cursor-none"
      style={{ fontFamily: "'Arial Narrow', Arial, sans-serif", contain: "layout style" }}
      onClick={handleClick}
    >
      <div
        ref={lensWrapRef}
        className="relative flex-shrink-0 flex items-center justify-center"
        style={{
          width: "min(82vw, 82vh)",
          height: "min(82vw, 82vh)",
          perspective: "1400px",
          transformStyle: "preserve-3d",
          willChange: "transform",
          opacity: 0,
        }}
      >
        {/* === SHUTTER Div === */}
        <div
          ref={shutterRef}
          className="absolute pointer-events-none"
          style={{
            width: "78%",
            height: "78%",
            borderRadius: "50%",
            overflow: "hidden",
            zIndex: 10,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            willChange: "transform",
          }}
        >
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <defs>
              <mask id="iris-mask">
                <rect width="100" height="100" fill="white" />
                <circle className="iris-hole" cx="50" cy="50" r="48" fill="black" />
              </mask>
            </defs>

            <rect
              className="iris-body"
              width="100" height="100"
              fill="#050505"
              mask="url(#iris-mask)"
              opacity="0"
            />
            <circle className="iris-flash" cx="50" cy="50" r="50" fill="rgba(255,255,255,0)" />
            <circle
              className="iris-ring"
              cx="50" cy="50" r="40"
              fill="none"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="0.5"
              strokeDasharray="251"
              strokeDashoffset="251"
              transform="rotate(-90 50 50)"
              opacity="0"
            />
            {[0, 45, 90, 135].map((deg, i) => (
              <line
                key={i}
                className={`iris-spoke-${i}`}
                x1="50" y1="50" x2="50" y2="4"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="0.4"
                transform={`rotate(${deg}, 50, 50)`}
                opacity="0"
              />
            ))}
          </svg>
        </div>

        <div
          ref={innerImageRef}
          className="absolute overflow-hidden z-[1]"
          style={{
            borderRadius: "50%",
            width: "78%",
            height: "78%",
            transformStyle: "preserve-3d",
            willChange: "transform, border-radius",
          }}
        >
          <div
            ref={cardInnerRef}
            className="absolute inset-0"
            style={{
              transformOrigin: "center center",
              willChange: "transform",
              perspective: "700px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
              background: [
                "radial-gradient(ellipse at 0% 0%,    rgba(0,0,0,0.80) 0%, transparent 40%)",
                "radial-gradient(ellipse at 100% 0%,  rgba(0,0,0,0.80) 0%, transparent 40%)",
                "radial-gradient(ellipse at 100% 100%,rgba(0,0,0,0.80) 0%, transparent 40%)",
                "radial-gradient(ellipse at 0% 100%,  rgba(0,0,0,0.80) 0%, transparent 40%)",
              ].join(", "),
            }} />

            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
              background: "radial-gradient(ellipse at 38% 28%, rgba(255,255,255,0.065) 0%, transparent 52%)",
            }} />

            {PROJECTS.map((proj, idx) => (
              <div
                key={proj.id}
                ref={el => { cardRefs.current[idx] = el; }}
                style={{
                  position: "absolute", inset: 0,
                  backfaceVisibility: "hidden",
                  transformOrigin: "center center",
                  // willChange: "transform, opacity",
                }}
              >
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="absolute inset-0 w-full h-full object-cover block select-none"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.50) 40%, rgba(0,0,0,0.18) 100%)" }}
                />
              </div>
            ))}
          </div>

          <div
            ref={vignetteRef}
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              background: "radial-gradient(circle, transparent 38%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.82) 92%, #000 100%)",
              borderRadius: "inherit",
            }}
          />
        </div>

        <div className="absolute z-[2] pointer-events-none" style={{
          borderRadius: "50%", width: "78%", height: "78%",
          background: "radial-gradient(circle, transparent 38%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.82) 92%, #000 100%)",
        }} />

        <div
          ref={pressClickRef}
          className="absolute z-[10] flex flex-col items-center gap-4 pointer-events-none text-center"
          style={{ opacity: 0 }}
        >
          <Mouse size={52} color="rgba(255,255,255,0.88)" strokeWidth={1.1} />
          <span style={{
            fontSize: "13px", letterSpacing: "8px", textTransform: "uppercase",
            fontWeight: 300, color: "rgba(255,255,255,0.85)",
            textShadow: "0 0 28px rgba(255,255,255,0.25)",
          }}>press click</span>
        </div>

        <svg
          className="absolute inset-0 w-full h-full z-[3] pointer-events-none overflow-visible"
          viewBox="0 0 520 520"
          xmlns="http://www.w3.org/2000/svg"
          style={{ willChange: "transform" }}
        >
          <defs>
            <mask id="lm">
              <rect width="520" height="520" fill="white" />
              <circle cx="260" cy="260" r="207" fill="black" />
            </mask>
            <mask id="im">
              <circle cx="260" cy="260" r="207" fill="white" />
            </mask>
            <radialGradient id="rg1" cx="42%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#4a4a4a" /><stop offset="35%" stopColor="#2a2a2a" />
              <stop offset="75%" stopColor="#181818" /><stop offset="100%" stopColor="#0d0d0d" />
            </radialGradient>
            <radialGradient id="rg2" cx="40%" cy="28%" r="65%">
              <stop offset="0%" stopColor="#6a6a6a" /><stop offset="28%" stopColor="#3a3a3a" />
              <stop offset="65%" stopColor="#1c1c1c" /><stop offset="100%" stopColor="#080808" />
            </radialGradient>
            <radialGradient id="rg3" cx="40%" cy="28%" r="65%">
              <stop offset="0%" stopColor="#555" /><stop offset="42%" stopColor="#2b2b2b" />
              <stop offset="100%" stopColor="#0f0f0f" />
            </radialGradient>
            <radialGradient id="rg4" cx="38%" cy="25%" r="55%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <radialGradient id="rg5" cx="50%" cy="50%" r="50%">
              <stop offset="55%" stopColor="rgba(0,0,0,0)" /><stop offset="78%" stopColor="rgba(0,0,0,0.4)" />
              <stop offset="92%" stopColor="rgba(0,0,0,0.8)" /><stop offset="100%" stopColor="rgba(0,0,0,0.95)" />
            </radialGradient>
            <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <path id="aL" d="M 80,260 A 180,180 0 0,1 260,80" fill="none" />
            <path id="aR" d="M 260,80 A 180,180 0 0,1 440,260" fill="none" />
          </defs>

          <circle ref={outerRingRef} cx="260" cy="260" r="252" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" opacity="0" />
          <circle ref={arcSweepRef} cx="260" cy="260" r="207" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2"
            strokeDasharray={`${ARC_C}`} strokeDashoffset={`${ARC_C}`} strokeLinecap="round"
            transform="rotate(-90 260 260)" opacity="0" />
          <circle ref={lensGlowRef} cx="260" cy="260" r="60" fill="url(#glowGrad)" opacity="0" />
          <circle ref={focusRingRef} cx="260" cy="260" r="255" fill="none" stroke="rgba(255,255,255,0.5)"
            strokeWidth="1" strokeDasharray="3 14" opacity="0" />

          <g ref={crosshairRef} opacity="0">
            <path d="M 140,155 L 140,140 L 155,140" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
            <path d="M 365,140 L 380,140 L 380,155" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
            <path d="M 380,365 L 380,380 L 365,380" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
            <path d="M 155,380 L 140,380 L 140,365" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
            <line x1="260" y1="248" x2="260" y2="238" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <line x1="260" y1="272" x2="260" y2="282" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <line x1="248" y1="260" x2="238" y2="260" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <line x1="272" y1="260" x2="282" y2="260" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <circle cx="260" cy="260" r="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
          </g>

          <g ref={ringGroupRef} mask="url(#lm)">
            <circle cx="260" cy="260" r="254" fill="url(#rg1)" />
            <ellipse cx="220" cy="170" rx="78" ry="28" fill="rgba(255,255,255,0.035)" transform="rotate(-20,220,170)" />
            <g opacity="0.5">
              {[248, 245, 242, 239, 236, 233].map((r, i) => (
                <circle key={r} cx="260" cy="260" r={r} fill="none"
                  stroke={i % 2 === 0 ? "#111" : "#333"}
                  strokeWidth={i % 2 === 0 ? "1.5" : "0.6"} />
              ))}
            </g>
            <circle cx="260" cy="260" r="222" fill="url(#rg2)" />
            <circle cx="260" cy="260" r="223" fill="none" stroke="#555" strokeWidth="0.8" />
            <circle cx="260" cy="260" r="221" fill="none" stroke="#1a1a1a" strokeWidth="2" />
            <circle cx="260" cy="260" r="215" fill="url(#rg3)" />
            <circle cx="260" cy="260" r="216" fill="none" stroke="#444" strokeWidth="0.5" />
            <circle cx="260" cy="260" r="214" fill="none" stroke="#111" strokeWidth="0.5" />
            <g ref={tickGroupRef} fill="none" stroke="rgba(200,200,200,0.5)" strokeWidth="0.7">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                <g key={deg} transform={`rotate(${deg},260,260)`}>
                  <line x1="260" y1="46" x2="260" y2={i % 3 === 0 ? "60" : "53"} />
                </g>
              ))}
            </g>
            <circle cx="260" cy="260" r="210" fill="#0c0c0c" />
            <circle cx="260" cy="260" r="211" fill="none" stroke="#3a3a3a" strokeWidth="1" />
            <circle cx="260" cy="260" r="209" fill="none" stroke="#111" strokeWidth="1.5" />
            <circle cx="260" cy="260" r="192" fill="url(#rg4)" />
          </g>

          <circle cx="260" cy="260" r="207" fill="url(#rg5)" mask="url(#im)" />

          <g ref={textArcRef}>
            <text fontFamily="'Arial Narrow',Arial,sans-serif" fontSize="8.5" fill="rgba(190,190,190,0.55)" letterSpacing="3">
              <textPath href="#aL" startOffset="8%">MICHAEL CAMPOS</textPath>
            </text>
            <text fontFamily="'Arial Narrow',Arial,sans-serif" fontSize="7.5" fill="rgba(190,190,190,0.5)" letterSpacing="3">
              <textPath href="#aR" startOffset="8%">∞ 19 07 2001 02 12 2000</textPath>
            </text>
            <text x="260" y="496" textAnchor="middle" fontFamily="'Arial Narrow',Arial,sans-serif"
              fontSize="6.5" fill="rgba(150,150,150,0.4)" letterSpacing="2">2026</text>
          </g>

          <g ref={recRef} opacity="0">
            <circle cx="480" cy="46" r="5" fill="#e03030" />
            <text x="468" y="50" textAnchor="end" fontFamily="'Arial Narrow',Arial,sans-serif"
              fontSize="8" fill="rgba(200,200,200,0.5)" letterSpacing="1">REC</text>
          </g>
        </svg>

        <div
          ref={slideCounterRef}
          className="absolute bottom-1/5 left-1/2 -translate-x-1/2 flex gap-3 items-center z-[6]"
          style={{ opacity: 0 }}
        >
          {PROJECTS.map((proj, i) => {
            const label = String(i + 1).padStart(2, "0");
            const active = i === activeIdx;
            return (
              <div key={proj.id} className="flex flex-col items-center cursor-pointer"
                onClick={(e) => { e.stopPropagation(); goTo(i); }}>
                <span className={`text-[8px] font-bold tracking-[2px] transition-all duration-300 ${active ? "text-red-500" : "text-white/25"}`}>
                  {label}
                </span>
                <div className={`h-px transition-all duration-300 ${active ? "w-6 bg-red-500" : "w-6 bg-white/20"}`} />
              </div>
            );
          })}
        </div>
      </div>

      <div
        ref={contentOverlayRef}
        className="absolute inset-0 z-[16] pointer-events-none"
        style={{ opacity: 0 }}
      >
        {PROJECTS.map((proj, i) => (
          <div
            key={proj.id}
            ref={el => { overlayRefs.current[i] = el; }}
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0 }}
          >
            <div
              ref={el => { overlayInnerRefs.current[i] = el; }}
              className="absolute flex flex-col justify-center overflow-hidden"
              style={{
                left: "50%",
                top: "50%",
                width: "400px",
                height: "400px",
                transform: "translate(-50%,-50%)",
              }}
            >
              <div className="w-full max-w-xl mx-auto text-left">
                <p
                  ref={el => { overlaySectorRefs.current[i] = el; }}
                  className="mb-[14px] text-xs uppercase tracking-[5px] text-white font-light opacity-0"
                >
                  {proj.sector}
                </p>

                <h2
                  ref={el => { overlayTitleRefs.current[i] = el; }}
                  className="mb-6 text-7xl leading-[1.1] font-extralight tracking-[0.18em] text-white font-serif max-w-xl flex flex-wrap"
                >
                  {proj.title.split("").map((char, index) => (
                    <span key={index} className="inline-block opacity-0" style={{ minWidth: char === " " ? "0.3em" : "auto" }}>
                      {char}
                    </span>
                  ))}
                </h2>

                <p
                  ref={el => { overlayParaRefs.current[i] = el; }}
                  className="mb-8 text-base line-clamp-3 text-white leading-7 tracking-wider max-w-xl opacity-0"
                >
                  {proj.description}
                </p>

                <div
                  ref={el => { overlayTechsRefs.current[i] = el; }}
                  className="flex flex-wrap gap-[10px] mb-[30px] max-w-xl opacity-0"
                >
                  {proj.techs.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center gap-[8px] px-3 py-[8px] rounded-[6px] bg-white/5 leading-none"
                    >
                      <div className="flex items-center justify-center shrink-0">{tech.icon}</div>
                      <span className="flex items-center text-xs uppercase tracking-[2px] text-white leading-none">{tech.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center w-full max-w-xl mt-2">
                  <Link
                    to={proj.href}
                    ref={el => { overlayButtonRefs.current[i] = el; }}
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, { x: 4, duration: 0.35, ease: "power2.out", overwrite: "auto" });
                      gsap.to(e.currentTarget.querySelector(".btn-line"), { scaleX: 0.8, duration: 0.35, ease: "power2.out", overwrite: "auto" });
                      gsap.to(e.currentTarget.querySelector(".chevron"), { scaleX: -1.4, duration: 0.35, ease: "power2.out", overwrite: "auto" });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, { x: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
                      gsap.to(e.currentTarget.querySelector(".btn-line"), { scaleX: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
                      gsap.to(e.currentTarget.querySelector(".chevron"), { scaleX: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
                    }}
                    className="flex items-center gap-4 group opacity-0 cursor-pointer"
                  >
                    <div className="btn-line h-[2px] bg-white origin-left" style={{ width: "25px" }} />
                    <span className="text-xs uppercase tracking-[4px] text-white font-light">View Project</span>
                    <ChevronRight size={25} className="text-white chevron" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        ref={contentLeftRef}
        className="absolute top-0 flex py-6 justify-center flex-col max-w-sm min-h-screen opacity-0 left-[5%] pl-[28px] pointer-events-none z-[20]"
      >
        <p id="cl-sec" className="text-sm top-7 absolute font-bold tracking-[5px] text-red-500 uppercase">
          Projects Showcase
        </p>
        <div className="min-h-xl w-auto">
          <div className="flex items-center gap-5 mb-4">
            <div className="w-[2px] h-[72px] bg-gradient-to-b from-red-500 via-red-500/40 to-transparent" />
            <h2 id="cl-title" className="text-2xl md:text-3xl font-extralight uppercase tracking-[0.18em] leading-[1.1] text-white mb-6">
              Main View
            </h2>
          </div>
          <p id="cl-desc" className="text-base text-white leading-7 tracking-wider mb-8">
            Each project is presented in its own dedicated section, featuring key information, the technologies used, and relevant links.
          </p>
          <Link to="/"
            className="bg-red-500 text-white px-10 py-4 uppercase tracking-[0.3em] text-sm font-semibold border border-black hover:bg-black hover:text-white hover:ring-2 hover:ring-red-500 transition-all duration-300">
            return to home
          </Link>
        </div>
      </div>

      <nav ref={sideDotsRef} className="absolute right-14 top-1/2 -translate-y-1/2 z-[20]" style={{ opacity: 0 }}>
        <ul className="relative flex flex-col gap-[6px] items-center">
          {(() => {
            return (
              <div
                ref={sideDotIndicatorRef}
                className="absolute pointer-events-none border border-red-500"
                style={{
                  left: "-14px",
                  right: "-14px",
                  height: "24px",
                  top: 0,
                  transform: "translateY(0px)",
                  willChange: "transform",
                }}
              />
            );
          })()}
          {PROJECTS.map((proj, i) => {
            const active = i === activeIdx;
            return (
              <li key={proj.id} className="relative">
                <button onClick={(e) => { e.stopPropagation(); goTo(i); }}
                  aria-label={`Go to ${proj.title}`}
                  className={`relative cursor-pointer block w-[20px] h-[16px] border transition-colors duration-150 ease-out ${active ? "border-red-500 bg-red-500/10 cursor-default" : "border-white/20 hover:border-white hover:bg-white/5"}`} />
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}