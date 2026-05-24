import { useNavigate } from "react-router-dom";
import { useArgentinaDateTime } from "../../hooks/useArgentinaDateTime";
import {
  Wifi,
  Signal,
  BatteryFull,
  FolderDot,
  User,
  CodeXml,
  Mail,
  Square,
} from "lucide-react";
import { Suspense, useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { tabletAnimationRouting } from "./tablet_utils/tablet_animation_routing";
import { tabletAnimationLink } from "./tablet_utils/tablet_animation_link_spa";

import { KittenModel } from "./KittenModel";
import { SpinButton } from "./SpinButton";
import { MenuIcon } from "./MenuIcon";
import { AppsScreen } from "./AppsScreen";
import { Calculator } from "./Calculator";
import { Notes } from "./Notes";
import { MittensJump } from "./MittensJump";

type TabletMenuProps = {
  animateIn?: boolean;
};

export default function TabletMenu({ animateIn = false }: TabletMenuProps) {
  const navigate = useNavigate();
  const { time } = useArgentinaDateTime();
  const [appsOpen, setAppsOpen] = useState(false);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [mittensSpin, setMittensSpin] = useState(false);
  const [adolfoSpin,  setAdolfoSpin]  = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(animateIn);

  const canvas1Ref  = useRef<HTMLDivElement>(null);
  const canvas2Ref  = useRef<HTMLDivElement>(null);
  const dockRef     = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const mainUiRef   = useRef<HTMLDivElement>(null);

  const playClickSound = useCallback(() => {
    new Audio("/sounds/click.mp3").play().catch(() => {});
  }, []);

  const handleNavigation = useCallback((path: string) => {
    if (isTransitioning) return;
    playClickSound();
    
    // Trigger the special "Zoom into Tablet" animation before navigating
    tabletAnimationLink.handleNavigation(() => {
      navigate(path);
    });
  }, [playClickSound, isTransitioning, navigate]);

  const handleOpenInternalApp = useCallback((appName: string) => {
    if (isTransitioning) return;
    playClickSound();
    setActiveApp(appName);
    setAppsOpen(false);
    setIsTransitioning(true);
    
    // Use global animation for UI elements exit
    tabletAnimationRouting.animateUiElements([subtitleRef.current, dockRef.current], false);
    
    // Animate canvas models out
    gsap.to([canvas1Ref.current, canvas2Ref.current], { 
      opacity: 0, 
      scale: 0.9, 
      duration: 0.4, 
      ease: "power2.inOut",
      onComplete: () => setIsTransitioning(false)
    });
  }, [playClickSound, isTransitioning]);

  const handleCloseInternalApp = useCallback(() => {
    setActiveApp(null);
    setIsTransitioning(true);

    // Use global animation for UI elements entrance
    tabletAnimationRouting.animateUiElements([subtitleRef.current, dockRef.current], true, 0.2);

    // Animate canvas models back in
    gsap.to([canvas1Ref.current, canvas2Ref.current], { 
      opacity: 1, 
      scale: 1, 
      duration: 0.6, 
      ease: "back.out(1.2)",
      onComplete: () => setIsTransitioning(false)
    });
  }, []);

  // Entrance animation for the whole menu UI
  useEffect(() => {
    if (animateIn) {
      setIsTransitioning(true);
      const ctx = gsap.context(() => {
        // Use global animation for the main UI container instead of just elements
        tabletAnimationRouting.animateAppEntrance(mainUiRef.current, () => {
          setIsTransitioning(false);
        });

        // Also animate internal elements with a slight delay
        tabletAnimationRouting.animateUiElements(
          [subtitleRef.current, dockRef.current],
          true,
          0.3
        );
      });
      return () => ctx.revert();
    }
  }, [animateIn]);

  const handleOpenApps = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Use global animation for UI elements exit
    tabletAnimationRouting.animateUiElements([subtitleRef.current, dockRef.current], false);

    // Animate canvas models out
    gsap.to([canvas1Ref.current, canvas2Ref.current], { 
      opacity: 0, 
      scale: 0.9, 
      duration: 0.4, 
      ease: "power2.inOut",
      onComplete: () => {
        setAppsOpen(true);
        setIsTransitioning(false);
      }
    });
  }, [isTransitioning]);

  const handleCloseApps = useCallback(() => {
    setAppsOpen(false);
    setIsTransitioning(true);

    // Use global animation for UI elements entrance
    tabletAnimationRouting.animateUiElements([subtitleRef.current, dockRef.current], true, 0.2);

    // Animate canvas models back in
    gsap.to([canvas1Ref.current, canvas2Ref.current], { 
      opacity: 1, 
      scale: 1, 
      duration: 0.6, 
      ease: "back.out(1.2)",
      onComplete: () => setIsTransitioning(false)
    });
  }, []);

  const dockIcons = useMemo(() => [
    { title: "Projects", icon: <FolderDot className="text-white" size={26} strokeWidth={1.5} absoluteStrokeWidth />, onClick: () => handleNavigation("/project") },
    { title: "About Me", icon: <User      className="text-white" size={26} strokeWidth={1.5} absoluteStrokeWidth />, onClick: () => handleNavigation("/about") },
    {
      title: "Menu",
      icon: <Square className="text-white" size={26} strokeWidth={1.5} absoluteStrokeWidth />,
      onClick: () => { playClickSound(); handleOpenApps(); },
    },
    { title: "Stack",   icon: <CodeXml className="text-white" size={26} strokeWidth={1.5} absoluteStrokeWidth />, onClick: () => handleNavigation("/stack") },
    { title: "Contact", icon: <Mail    className="text-white" size={26} strokeWidth={1.5} absoluteStrokeWidth />, onClick: () => handleNavigation("/contact") },
  ], [handleNavigation, handleOpenApps, playClickSound]);

  const MITTENS_FLOAT_PHASE = 0;
  const ADOLFO_FLOAT_PHASE  = Math.PI;

  return (
    <div className={`relative select-none w-full h-full overflow-hidden text-white isolate ${isTransitioning ? 'pointer-events-none' : ''}`}>
      {/* Wallpaper */}
      <img
        src="/images/wallpapers/menu_2.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover z-0"
        draggable={false}
      />

      {/* Modelos 3D */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="flex items-center justify-center w-full h-full px-8 pointer-events-none">

          {/* MITTENS */}
          <div className="relative w-[42%] h-[78%] pointer-events-none" ref={canvas1Ref}>
            <div className={`absolute left-1/2 -translate-x-1/2 z-20 ${isTransitioning ? 'pointer-events-none' : 'pointer-events-auto'}`} style={{ top: "6%" }}>
              <SpinButton onPressStart={() => !isTransitioning && setMittensSpin(true)} onPressEnd={() => setMittensSpin(false)} />
            </div>
            <Canvas
              camera={{ position: [0, 2, 8], fov: 45 }}
              style={{ pointerEvents: "none", width: "100%", height: "100%" }}
              frameloop="always"
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 5, 5]} intensity={3} />
              <Suspense fallback={null}>
                <KittenModel
                  modelPath="/models/MittensFinal.gltf"
                  animateIn={animateIn}
                  visible={!appsOpen}
                  spinActive={mittensSpin}
                  spinDirection={1}
                  floatPhase={MITTENS_FLOAT_PHASE}
                  position={[0.35, -0.15, 0]}
                />
              </Suspense>
            </Canvas>
          </div>

          {/* ADOLFO */}
          <div className="relative w-[42%] h-[78%] pointer-events-none" ref={canvas2Ref}>
            <div className={`absolute left-1/2 -translate-x-1/2 z-20 ${isTransitioning ? 'pointer-events-none' : 'pointer-events-auto'}`} style={{ top: "6%" }}>
              <SpinButton onPressStart={() => !isTransitioning && setAdolfoSpin(true)} onPressEnd={() => setAdolfoSpin(false)} />
            </div>
            <Canvas
              camera={{ position: [0, 2, 8], fov: 45 }}
              style={{ pointerEvents: "none", width: "100%", height: "100%" }}
              frameloop="always"
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 5, 5]} intensity={3} />
              <Suspense fallback={null}>
                <KittenModel
                  modelPath="/models/AdolfoFinal.gltf"
                  animateIn={animateIn}
                  visible={!appsOpen}
                  spinActive={adolfoSpin}
                  spinDirection={-1}
                  floatPhase={ADOLFO_FLOAT_PHASE}
                  position={[-0.35, -0.15, 0]}
                />
              </Suspense>
            </Canvas>
          </div>

        </div>
      </div>

      {/* Overlay oscuro base */}
      <div className="absolute inset-0 z-20 bg-black/25 pointer-events-none" />

      {/* UI principal */}
      <div ref={mainUiRef} className="absolute inset-0 z-30 pointer-events-none h-full w-full">
        {/* Status bar */}
        <div className="absolute top-3 w-full flex justify-between px-8 pointer-events-none">
          <div className="text-base font-thin text-white">{time}</div>
          <div className="flex gap-1">
            <Signal      className="text-white" size={18} strokeWidth={1.5} absoluteStrokeWidth />
            <Wifi        className="text-white" size={18} strokeWidth={1.5} absoluteStrokeWidth />
            <BatteryFull className="text-white" size={18} strokeWidth={1.5} absoluteStrokeWidth />
          </div>
        </div>

        {/* Subtítulo */}
        <div ref={subtitleRef} className="absolute top-20 left-0 right-0 flex items-center justify-center gap-10 pointer-events-none">
          <div className="text-sm scale-y-110 tracking-widest text-white uppercase">
            Explore my world
          </div>
        </div>

        {/* Dock */}
        <div ref={dockRef} className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-auto">
          <div className="flex gap-6">
            {dockIcons.map((item) => (
              <MenuIcon key={item.title} title={item.title} icon={item.icon} onClick={item.onClick} />
            ))}
          </div>
        </div>
      </div>

      {/* Apps screen */}
      <AppsScreen 
        visible={appsOpen} 
        onClose={handleCloseApps} 
        onNavigate={handleNavigation}
        onOpenApp={handleOpenInternalApp}
      />

      {/* Internal Apps */}
      {activeApp === "Calculator" && <Calculator onClose={handleCloseInternalApp} />}
      {activeApp === "Notes" && <Notes onClose={handleCloseInternalApp} />}
      {activeApp === "MittensJump" && <MittensJump onClose={handleCloseInternalApp} />}
    </div>
  );
}

// Preload models
useGLTF.preload("/models/MittensFinal.gltf");
useGLTF.preload("/models/AdolfoFinal.gltf");
