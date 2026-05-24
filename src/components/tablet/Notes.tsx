import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { tabletAnimationRouting } from "./tablet_utils/tablet_animation_routing";

type NotesProps = {
  onClose: () => void;
};

export function Notes({ onClose }: NotesProps) {
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
      className="absolute inset-0 z-50 flex flex-col bg-amber-50 text-slate-900"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
        <h2 className="text-xl font-medium tracking-tight">Notes</h2>
        <button onClick={handleClose} className="p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-3xl font-bold mb-4 outline-none" contentEditable spellCheck={false}>
            My Ideas
          </div>
          <div className="text-lg leading-relaxed outline-none" contentEditable spellCheck={false}>
            Start typing your thoughts here...
          </div>
        </div>
      </div>
    </div>
  );
}
