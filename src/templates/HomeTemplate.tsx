import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import Tablet3D from "../components/tablet/Tablet3D";
import { tabletAnimationLink } from "../components/tablet/tablet_utils/tablet_animation_link_spa";
import { Mouse } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const mouseRef = useRef<HTMLDivElement>(null);
  const mouseAnimRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    mouseAnimRef.current = gsap.to(mouseRef.current, {
      y: -12,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      scale: 1.03,
      ease: "power1.inOut",
    });

    return () => {
      mouseAnimRef.current?.kill();
    };
  }, []);

  const handleZoneChange = (inside: boolean) => {
    if (!mouseRef.current) return;

    if (inside) {
      gsap.to(mouseRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          mouseAnimRef.current?.pause();
        },
      });
    } else {
      mouseAnimRef.current?.play();

      gsap.to(mouseRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  };

  const handleStartNavigation = () => {
    tabletAnimationLink.handleNavigation(() => {
      navigate("/project");
    });
  };
  

  return (
    <div className="relative min-h-screen bg-[url('/images/wallpapers/main_section.png')] bg-cover bg-no-repeat flex justify-center overflow-visible">
      <div className="w-full max-w-[1700px] grid grid-cols-1 md:grid-cols-[1fr_2fr] min-h-screen">
        <div
          data-tablet-fade
          className="flex mx-auto items-center justify-center relative"
        >
          <div className="flex flex-col items-start text-left space-y-8 relative z-10">
            <p className="text-base tracking-[0.35em] uppercase text-red-500 font-medium">
              Hi, my name is
            </p>

            <h1 className="text-5xl lg:text-7xl tracking-wider text-white font-extrabold MainFont">
              Michael Campos
            </h1>

            <h2 className="text-xl md:text-4xl leading-relaxed tracking-[0.10em] text-white font-[0.35em]">
              Front-End Developer <br />
              <span className="text-red-500">Angular</span> Specialist
            </h2>

            <p className="max-w-xl text-white/80 text-sm md:text-lg tracking-wider leading-relaxed">
              I'm a front-end developer specialized in building (and occasionally
              designing) exceptional digital experiences.
            </p>
            <button
              onClick={handleStartNavigation}
              className="mt-6 bg-red-500 text-white px-10 py-4 uppercase tracking-[0.3em] text-sm font-semibold border border-black hover:bg-black hover:text-white hover:ring-2 hover:ring-red-500 transition-all duration-300"
            >
              view more
            </button>
          </div>
        </div>
        <div className="relative flex flex-col overflow-visible">
          <Tablet3D onHoverZoneChange={handleZoneChange} />
        </div>
        <div
          ref={mouseRef}
          data-tablet-fade
          className="absolute bottom-10 z-6 left-1/2 -translate-x-1/2"
        >
          <div className="flex-col flex items-center justify-center space-y-3">
            <div className="h-15 w-13 bg-transparent rounded-full border border-red-500 flex items-center justify-center">
              <Mouse
                className="text-white"
                size={30}
                strokeWidth={1.75}
                absoluteStrokeWidth
              />
            </div>
            <p className="text-white text-xs font-light tracking-[0.10em] uppercase">
              Interact with the tablet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
