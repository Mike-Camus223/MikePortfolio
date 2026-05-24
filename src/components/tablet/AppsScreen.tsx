import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ChevronLeft, FolderDot, User, CodeXml, Mail, Calculator, Rabbit, FileText } from "lucide-react";
import { MenuIcon } from "./MenuIcon";
import { tabletAnimationRouting } from "./tablet_utils/tablet_animation_routing";
import { tabletAnimationLink } from "./tablet_utils/tablet_animation_link_spa";

type AppsScreenProps = { 
  visible: boolean; 
  onClose: () => void;
  onNavigate: (path: string) => void;
  onOpenApp: (appName: string) => void;
};

const ALL_APPS = [
  { title: "Projects",     type: "route", value: "/project", icon: (s: number) => <FolderDot  size={s} strokeWidth={1.5} absoluteStrokeWidth className="text-white" /> },
  { title: "About Me",     type: "route", value: "/about",    icon: (s: number) => <User       size={s} strokeWidth={1.5} absoluteStrokeWidth className="text-white" /> },
  { title: "Stack",        type: "route", value: "/stack",    icon: (s: number) => <CodeXml    size={s} strokeWidth={1.5} absoluteStrokeWidth className="text-white" /> },
  { title: "Contact",      type: "route", value: "/contact",  icon: (s: number) => <Mail       size={s} strokeWidth={1.5} absoluteStrokeWidth className="text-white" /> },
  { title: "Calculator",   type: "app",   value: "Calculator", icon: (s: number) => <Calculator size={s} strokeWidth={1.5} absoluteStrokeWidth className="text-white" /> },
  { title: "Mittens Jump", type: "app",   value: "MittensJump", icon: (s: number) => <Rabbit     size={s} strokeWidth={1.5} absoluteStrokeWidth className="text-white" /> },
  { title: "Notes",        type: "app",   value: "Notes",       icon: (s: number) => <FileText   size={s} strokeWidth={1.5} absoluteStrokeWidth className="text-white" /> },
];

export function AppsScreen({ visible, onClose, onNavigate, onOpenApp }: AppsScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const headerRef    = useRef<HTMLDivElement>(null);
  const gridRef      = useRef<HTMLDivElement>(null);
  const hasShown     = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (visible) {
        gsap.set(containerRef.current, { display: "flex", pointerEvents: "auto" });
        gsap.set(overlayRef.current,   { opacity: 0 });
        
        // Use global animation for header
        tabletAnimationRouting.animateAppEntrance(headerRef.current);
        
        const tl = gsap.timeline();
        tl.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: "power2.inOut" }, 0);

        if (gridRef.current) {
          const items = gridRef.current.querySelectorAll<HTMLElement>(".app-item");
          tabletAnimationRouting.animateStaggeredItems(items, true);
        }
        hasShown.current = true;
      } else if (hasShown.current) {
        const tl = gsap.timeline({
          onComplete: () => { 
            if (containerRef.current) gsap.set(containerRef.current, { display: "none", pointerEvents: "none" }); 
          },
        });

        if (gridRef.current) {
          const items = gridRef.current.querySelectorAll<HTMLElement>(".app-item");
          tabletAnimationRouting.animateStaggeredItems(items, false);
        }
        
        // Use global animation for header exit
        tabletAnimationRouting.animateAppExit(headerRef.current);
        
        tl.to(overlayRef.current, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0.1);
      }
    });

    return () => ctx.revert();
  }, [visible]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 flex-col overflow-hidden pointer-events-none"
      style={{ display: "none" }}
    >
      <div ref={overlayRef} className="absolute inset-0 bg-black/50 backdrop-blur-[8px]" />
      <div className="relative z-10 flex flex-col h-full px-7 pt-5 pb-6" style={{ minHeight: 0 }}>
        <div ref={headerRef} className="relative flex items-center justify-center mb-5 shrink-0">
          <button
            onClick={() => {
              new Audio("/sounds/click.mp3").play().catch(() => {});
              onClose();
            }}
            className="absolute top-5 left-1 flex items-center gap-1 text-white/75 hover:text-white transition-colors duration-150 cursor-pointer pointer-events-auto"
          >
            <ChevronLeft size={16} strokeWidth={1.5} absoluteStrokeWidth />
            <span className="text-xs uppercase tracking-widest">Back</span>
          </button>
          <div className="text-center absolute top-15">
            <h1 className="text-2xl font-thin tracking-[0.3em] text-white uppercase">Apps</h1>
            <div className="mt-1 mx-auto h-px w-8 bg-white/30" />
          </div>
        </div>
        <div ref={gridRef} className="flex-1 flex items-center justify-center" style={{ minHeight: 0 }}>
          <div className="grid grid-cols-4 gap-x-8 gap-y-8">
            {ALL_APPS.map((app) => (
              <div key={app.title} className="app-item flex justify-center">
                <MenuIcon
                  title={app.title}
                  icon={app.icon(22)}
                  size="small"
                  onClick={() => {
                    if (app.type === "route") {
                      onNavigate(app.value);
                    } else {
                      onOpenApp(app.value);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
