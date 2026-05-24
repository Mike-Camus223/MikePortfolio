import { X, Play } from "lucide-react";
import { useEffect, useRef } from "react";
import { tabletAnimationRouting } from "./tablet_utils/tablet_animation_routing";

type MittensJumpProps = {
  onClose: () => void;
};

export function MittensJump({ onClose }: MittensJumpProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      tabletAnimationRouting.animateAppEntrance(containerRef.current);
    }
  }, []);

  const handleClose = () => {
    if (containerRef.current) {
      tabletAnimationRouting.animateAppExit(containerRef.current, onClose);
    } else {
      onClose();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-50 flex flex-col bg-sky-400 text-white"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-xl font-bold tracking-widest uppercase italic">Mittens Jump!</h2>
        <button onClick={handleClose} className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="relative w-64 h-64 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/40 mb-8">
          <Play size={80} fill="white" className="ml-4" />
        </div>
        <p className="text-2xl font-black uppercase tracking-tighter text-center">
          Tap to start <br/> the adventure
        </p>
      </div>
    </div>
  );
}
