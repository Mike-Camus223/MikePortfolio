import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import CustomCursor from "../components/cursor/CustomCursor";

import { tabletAnimationLink } from "../components/tablet/tablet_utils/tablet_animation_link_spa";

interface MainLayoutProps {
  children: React.ReactNode;
  OnNavbar?: boolean;
  OnFooter?: boolean;
}

const SCROLL_SPEED = 1.7;
const EASE = SCROLL_SPEED * 0.035;

export default function MainLayout({
  children,
  OnNavbar = true,
  OnFooter = true,
}: MainLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let rafId: number | null = null;
    let isRunning = true;

    const content = contentRef.current;
    const wrapper = wrapperRef.current;
    const thumb = thumbRef.current;

    // Reset navigation state if coming from tablet animation
    const navOverlay = document.getElementById("tablet-nav-overlay");
    if (navOverlay) {
      gsap.to(navOverlay, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          tabletAnimationLink.reset();
        },
      });
    } else {
      tabletAnimationLink.reset();
    }

    if (!content || !wrapper) return;

    const setBodyHeight = () => {
      if (content) {
        document.body.style.height = content.offsetHeight + "px";
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      setBodyHeight();
    });

    resizeObserver.observe(content);

    const updateScrollbar = () => {
      if (!thumb) return;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        thumb.style.height = "0px";
        return;
      }
      const progress = currentY / maxScroll;
      const thumbH = Math.max(
        40,
        (window.innerHeight / document.body.scrollHeight) * window.innerHeight
      );
      const thumbTrack = window.innerHeight - thumbH;
      thumb.style.height = thumbH + "px";
      thumb.style.transform = `translateY(${progress * thumbTrack}px)`;
    };

    const tick = () => {
      if (!isRunning) return;
      currentY += (targetY - currentY) * EASE;
      if (Math.abs(targetY - currentY) < 0.05) currentY = targetY;

      gsap.set(content, { y: -currentY });
      updateScrollbar();
      rafId = requestAnimationFrame(tick);
    };

    wrapper.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%;
      height: 100vh;
      overflow: hidden;
    `;

    setBodyHeight();
    const onResize = () => setBodyHeight();
    window.addEventListener("resize", onResize);

    const onScroll = () => {
      targetY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    rafId = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      wrapper.style.cssText = "";
      gsap.set(content, { y: 0, clearProps: "all" });
      document.body.style.height = "";
    };
  }, [children]); // Re-run when children change to ensure height is updated

  return (
    <>
      <CustomCursor />
      <div id="smooth-wrapper" ref={wrapperRef}>
        <div id="smooth-content" ref={contentRef} style={{ minHeight: "100vh", width: "100%" }}>
          {OnNavbar && <Navbar />}
          {children}
          {OnFooter && <Footer />}
        </div>
      </div>
      {/* Custom Scrollbar Thumb */}
      <div id="custom-scrollbar">
        <div id="custom-scrollbar-thumb" ref={thumbRef}></div>
      </div>
    </>
  );
}
