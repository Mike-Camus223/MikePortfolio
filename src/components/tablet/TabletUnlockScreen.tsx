// TabletUnlockScreen.tsx
import { useEffect, useRef, useState } from "react";
import {
    BatteryFull,
    Signal,
    Wifi,
    Lock,
    LockOpen,
} from "lucide-react";
import gsap from "gsap";
import TabletMenu from "./TabletMenu";
import { useArgentinaDateTime } from "../../hooks/useArgentinaDateTime";

export default function TabletUnlockScreen() {
    // Hook reutilizable para hora y fecha de Argentina
    const { time, date } = useArgentinaDateTime();

    // Estados del slider y navegación
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    // Constantes del slider
    const TRACK_WIDTH = 350;
    const HANDLE_SIZE = 48;
    const PADDING = 4;
    const MAX_DRAG = TRACK_WIDTH - HANDLE_SIZE - PADDING * 2;

    // Refs
    const wallpaperRef = useRef<HTMLImageElement>(null);
    const topContentRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Drag suave con requestAnimationFrame
    useEffect(() => {
        let animationFrame: number | null = null;

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || unlocked) return;

            const track = document.getElementById("unlock-track");
            if (!track) return;

            const rect = track.getBoundingClientRect();
            const rawX = e.clientX - rect.left - HANDLE_SIZE / 2;
            const clampedX = Math.max(0, Math.min(rawX, MAX_DRAG));

            if (animationFrame) cancelAnimationFrame(animationFrame);

            animationFrame = requestAnimationFrame(() => {
                setDragX(clampedX);
            });
        };

        const handleMouseUp = () => {
            if (!isDragging || unlocked) return;

            setIsDragging(false);

            if (dragX >= MAX_DRAG * 0.85) {
                const sound = new Audio("/sounds/pop.mp3");
                sound.volume = 0.7;
                sound.play().catch(() => {});

                setDragX(MAX_DRAG);
                setUnlocked(true);
            } else {
                setDragX(0);
            }
        };

        window.addEventListener("mousemove", handleMouseMove, {
            passive: true,
        });
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, dragX, unlocked, MAX_DRAG]);

    // Animación de desbloqueo
    useEffect(() => {
        if (!unlocked) return;

        const tl = gsap.timeline({
            defaults: {
                ease: "power3.inOut",
            },
            onComplete: () => {
                setShowMenu(true);
            },
        });

        // 1. Oscurecer fondo
        tl.to(
            overlayRef.current,
            {
                opacity: 1,
                duration: 0.35,
            },
            0
        )

            // 2. Hora, fecha y status bar suben y desaparecen
            .to(
                topContentRef.current,
                {
                    y: -60,
                    opacity: 0,
                    duration: 0.55,
                },
                0.1
            )

            // 3. Slider baja y desaparece
            .to(
                sliderRef.current,
                {
                    y: 60,
                    opacity: 0,
                    duration: 0.55,
                },
                0.1
            )

            // 4. Ocultar pantalla lock
            .set(
                [
                    wallpaperRef.current,
                    topContentRef.current,
                    sliderRef.current,
                ],
                {
                    visibility: "hidden",
                }
            );

        return () => {
            tl.kill();
        };
    }, [unlocked]);

    return (
        <div className="w-full h-full relative select-none overflow-hidden">
            {/* Menú */}
            {showMenu && (
                <div
                    ref={menuRef}
                    className="
                        absolute inset-0 z-40
                        overflow-hidden
                        rounded-[2.8rem]
                    "
                >
                    <TabletMenu animateIn={showMenu} />
                </div>
            )}

            {/* Wallpaper */}
            <img
                ref={wallpaperRef}
                draggable={false}
                src="/images/wallpapers/screen_3.png"
                alt="screen_2"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay negro para transición */}
            <div
                ref={overlayRef}
                className="absolute inset-0 z-10 bg-black opacity-0 pointer-events-none"
            />

            {/* Lock Screen */}
            <div className={`relative z-20 flex h-full flex-col p-3 ${unlocked ? 'pointer-events-none' : ''}`}>
                <div className="text-center">
                    {/* Status Bar + Hora + Fecha */}
                    <div ref={topContentRef}>
                        {/* Status Bar */}
                        <div className="flex w-full justify-between px-5">
                            <div className="text-base font-thin text-white">
                                {time}
                            </div>

                            <div className="flex gap-1">
                                <Signal
                                    className="text-white"
                                    size={18}
                                    strokeWidth={1.5}
                                    absoluteStrokeWidth
                                />
                                <Wifi
                                    className="text-white"
                                    size={18}
                                    strokeWidth={1.5}
                                    absoluteStrokeWidth
                                />
                                <BatteryFull
                                    className="text-white"
                                    size={18}
                                    strokeWidth={1.5}
                                    absoluteStrokeWidth
                                />
                            </div>
                        </div>

                        {/* Hora */}
                        <div className="text-7xl mt-10 font-thin text-white">
                            {time}
                        </div>

                        {/* Fecha */}
                        <div className="mt-3 text-lg text-white capitalize">
                            {date}
                        </div>
                    </div>

                    {/* Unlock Slider */}
                    <div
                        ref={sliderRef}
                        className="absolute bottom-20 left-1/2 -translate-x-1/2"
                    >
                        <div
                            id="unlock-track"
                            className="
                                relative w-[350px] h-14 rounded-full
                                bg-white/15 backdrop-blur-xl
                                border border-white/20
                                overflow-hidden
                            "
                        >
                            {/* Progreso */}
                            <div
                                className={`absolute left-0 top-0 h-full bg-white/10 rounded-full ${
                                    isDragging
                                        ? "transition-none"
                                        : "transition-all duration-200 ease-out"
                                }`}
                                style={{
                                    width: `${dragX + HANDLE_SIZE}px`,
                                }}
                            />

                            {/* Texto */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span
                                    className={`text-lg font-thin text-white capitalize transition-opacity duration-200 ${
                                        isDragging || unlocked
                                            ? "opacity-30"
                                            : "opacity-100"
                                    }`}
                                >
                                    {unlocked ? "Unlocked" : "Unlock"}
                                </span>
                            </div>

                            {/* Handle */}
                            <div
                                onMouseDown={() =>
                                    !unlocked && setIsDragging(true)
                                }
                                className={`
                                    absolute top-1 left-1 w-12 h-12 rounded-full
                                    backdrop-blur-xl border border-white/20
                                    flex items-center justify-center shadow-lg
                                    cursor-grab active:cursor-grabbing
                                    will-change-transform
                                    ${
                                        isDragging
                                            ? "transition-none"
                                            : "transition-transform duration-200 ease-out"
                                    }
                                    bg-white/25
                                `}
                                style={{
                                    transform: `translate3d(${dragX}px, 0, 0)`,
                                }}
                            >
                                {unlocked ? (
                                    <LockOpen
                                        className="text-white"
                                        size={20}
                                        strokeWidth={1.5}
                                        absoluteStrokeWidth
                                    />
                                ) : (
                                    <Lock
                                        className="text-white"
                                        size={20}
                                        strokeWidth={1.5}
                                        absoluteStrokeWidth
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}