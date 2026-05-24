import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { tabletAnimationRouting } from "./tablet_utils/tablet_animation_routing";

type CalculatorProps = {
  onClose: () => void;
};

export function Calculator({ onClose }: CalculatorProps) {
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
      className="absolute inset-0 z-50 flex flex-col bg-slate-900 text-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h2 className="text-xl font-light tracking-widest uppercase">Calculator</h2>
        <button 
          onClick={handleClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-xs bg-black/40 rounded-3xl p-6 backdrop-blur-md border border-white/10 shadow-2xl">
          <div className="text-right mb-6 px-2">
            <div className="text-white/40 text-sm mb-1">0</div>
            <div className="text-4xl font-light tracking-tighter">0</div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map((btn, i) => (
              <button
                key={i}
                className={`
                  h-14 rounded-2xl flex items-center justify-center text-lg font-medium transition-all active:scale-95 cursor-pointer
                  ${btn === '=' ? 'col-span-2 bg-red-500 hover:bg-red-400' : 
                    ['÷', '×', '-', '+'].includes(btn) ? 'bg-white/10 hover:bg-white/20 text-red-400' :
                    ['C', '±', '%'].includes(btn) ? 'bg-white/5 hover:bg-white/10 text-white/60' :
                    'bg-white/5 hover:bg-white/10'}
                `}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
