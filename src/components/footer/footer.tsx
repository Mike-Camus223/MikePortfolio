import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Heart,
  ChevronRight,
} from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { tabletAnimationLink } from "../tablet/tablet_utils/tablet_animation_link_spa";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  {
    title: "Projects",
    href: "/project",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Stack",
    href: "/stack",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export default function Footer() {
  const footerRef = useRef(null);
  const copiedRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /*
        FOOTER APPEAR ONLY WHEN VISIBLE
      */
      gsap.from(".footer-fade", {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
        },

        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".footer-line", {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
        },

        scaleX: 0,
        duration: 1.2,
        ease: "power3.out",
        transformOrigin: "left center",
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const navigate = useNavigate();

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(
      "michaelcamposvil@gmail.com"
    );

    gsap.killTweensOf(copiedRef.current);

    gsap.fromTo(
      copiedRef.current,
      {
        opacity: 0,
        y: 10,
        rotate: -14,
        scale: 0.7,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
      }
    );

    gsap.to(copiedRef.current, {
      opacity: 0,
      y: -10,
      delay: 1.2,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleStartNavigation = (href: string) => {
    tabletAnimationLink.handleNavigation(() => {
      navigate(href);
    });
  };

  return (
    <footer
      ref={footerRef}
      className="w-full bg-black text-white border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-[1700px] mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
          {/* LEFT */}
          <div className="footer-fade flex flex-col gap-5">
            <Link
              to="/"
              className="h-8 w-20 flex items-center justify-center"
            >
              <img
                src="/images/logo/logo.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </Link>

            <p className="text-zinc-400 text-base">
              Frontend Developer
            </p>

            <p className="text-zinc-500 text-[15px] leading-8 max-w-[320px]">
              Modern, fast and accessible digital experiences.
            </p>

            <div
              className="
                flex items-center gap-2
                w-fit
                px-4 py-3
                rounded-xl
                border border-white/10
                bg-white/[0.02]
              "
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

              <span className="text-zinc-300 text-sm">
                Available for projects
              </span>
            </div>
          </div>

          {/* CENTER */}
          <div className="footer-fade flex flex-col gap-6">
            <h3 className="uppercase tracking-[0.18em] text-zinc-500 text-[11px]">
              Navigation
            </h3>

            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.title}
                  onClick={(e) => {
                    e.preventDefault();
                    handleStartNavigation(item.href);
                  }}
                  to={item.href}
                  className="
                    group
                    flex items-center gap-3
                    text-base text-zinc-200
                    transition-all duration-300
                    hover:text-white
                    w-fit
                  "
                >
                  <ChevronRight
                    size={14}
                    className="
                      text-red-500
                      transition-transform duration-300
                      group-hover:translate-x-1
                    "
                  />

                  <span className="relative">
                    {item.title}

                    <span
                      className="
                        absolute
                        left-0
                        -bottom-1
                        h-px
                        w-0
                        bg-red-500
                        transition-all duration-300
                        group-hover:w-full
                      "
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="footer-fade flex flex-col gap-6">
            <h3 className="uppercase tracking-[0.18em] text-zinc-500 text-[11px]">
              Connect
            </h3>

            <div className="flex flex-col gap-4">
              <div className="relative w-fit">
                {/* COPIED LABEL */}
                <div
                  ref={copiedRef}
                  className="
                    absolute
                    -top-5
                    left-8
                    opacity-0
                    pointer-events-none
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    text-red-500
                    font-semibold
                    rotate-[-14deg]
                  "
                >
                  Copied
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="
                    group
                    flex items-center gap-4
                    w-fit
                    cursor-none
                  "
                >
                  <div
                    className="
                      w-11 h-11
                      rounded-lg
                      border border-white/10
                      bg-white/[0.02]
                      flex items-center justify-center
                      text-zinc-300
                      transition-all duration-300
                      group-hover:border-red-500/40
                      group-hover:bg-white/[0.04]
                      group-hover:text-white
                    "
                  >
                    <Mail size={18} />
                  </div>

                  <div className="flex flex-col items-start">
                    <span
                      className="
                        text-[11px]
                        uppercase
                        tracking-[0.2em]
                        text-zinc-500
                      "
                    >
                      Email
                    </span>

                    <span
                      className="
                        text-base text-zinc-200
                        transition-colors duration-300
                        group-hover:text-white
                      "
                    >
                      michaelcamposvil@gmail.com
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          className="
            footer-line
            mt-14 pt-6
            border-t border-white/5
            flex flex-col md:flex-row
            items-center justify-between
            gap-4
          "
        >
          <p className="footer-fade text-zinc-500 text-sm">
            © 2026 Michael Campos Dev.
          </p>

          <div className="footer-fade flex items-center gap-2 text-zinc-400 text-sm">
            Made with passion

            <Heart
              size={14}
              className="text-red-500 fill-red-500"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}