import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { House, UserCircle2, FolderCode, Mail } from "lucide-react";
import gsap from "gsap";

type NavItem = {
  id: string;
  href: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
};

const navItems: NavItem[] = [
  { id: "home", href: "#home", icon: House },
  { id: "Acerca de mi", href: "#about", icon: UserCircle2 },
  { id: "Proyectos", href: "#projects", icon: FolderCode },
  { id: "Contacto", href: "#contact", icon: Mail },
];

export default function SidebarMenu() {
  const [active, setActive] = useState<string>("home");
  const [mounted, setMounted] = useState(false);

  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !indicatorRef.current) return;

    const activeIndex = navItems.findIndex((item) => item.id === active);
    const activeItem = itemRefs.current[activeIndex];

    if (!activeItem) return;

    const indicator = indicatorRef.current;

    gsap.killTweensOf(indicator);

    const targetY = activeItem.offsetTop + activeItem.offsetHeight / 2 - indicator.offsetHeight / 2;

    gsap.to(indicator, {
      y: targetY,
      duration: 0.95,
      ease: "elastic.out(1, 0.5)",
    });

    gsap.fromTo(
      indicator,
      { scaleX: 0.75, scaleY: 1.7 },
      { scaleX: 1, scaleY: 1, duration: 0.7, ease: "power3.out" }
    );
  }, [active, mounted]);

  return (
    <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50">
      <ul className="relative flex flex-col items-center justify-center gap-10 w-20 min-h-[34rem] px-6 py-14 rounded-[4rem] bg-black shadow-2xl overflow-visible">
        <div ref={indicatorRef} className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 rounded-full bg-white shadow-xl pointer-events-none z-0" />

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <li
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="relative z-10 flex h-16 w-16 items-center justify-center group"
            >
              <Link
                to={item.href}
                onClick={() => setActive(item.id)}
                className="flex h-full w-full items-center justify-center rounded-full cursor-pointer"
              >
                <Icon
                  size={26}
                  strokeWidth={1.5}
                  className={`transition-all duration-500 ${isActive ? "text-black scale-110" : "text-white scale-100 group-hover:scale-110"}`}
                />
              </Link>

              <span className="absolute top-1/2 left-[calc(100%+14px)] -translate-y-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out bg-black text-white text-base font-medium px-4 py-2 rounded-lg shadow-xl whitespace-nowrap pointer-events-none z-[9999]">
                {item.id}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}