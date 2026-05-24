import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
}

let isNavigating = false;

export const tabletAnimationLink = {
  reset: () => {
    isNavigating = false;
    document.body.style.overflow = "";
    const overlay = document.getElementById("tablet-nav-overlay");
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  },
  handleNavigation: async (onNavigate: () => void) => {
    if (isNavigating) return;

    const tabletContainer = document.getElementById("tablet-container-3d");
    const tabletModel = document.getElementById("tablet-3d-model");
    const tabletInner = document.getElementById("tablet-inner-wrapper");

    if (!tabletContainer || !tabletModel) {
      onNavigate();
      return;
    }

    isNavigating = true;

    try {
      // 1. SCROLL TO TABLET FIRST
      await tabletAnimationLink.scrollToTablet(tabletContainer);

      // 2. DISABLE SCROLL AND SCROLLTRIGGER FOR PERFORMANCE
      document.body.style.overflow = "hidden";
      ScrollTrigger.getAll().forEach(st => st.disable());
      
      tabletContainer.style.pointerEvents = "none";

      const overlay = tabletAnimationLink.getOrCreateOverlay();
      const screenContent = document.getElementById("tablet-screen-content");

      // OPTIMIZED SELECTOR
      const fadeElements = document.querySelectorAll("[data-tablet-fade]");
      const filteredFadeElements = Array.from(fadeElements).filter(
        (el) => !el.contains(tabletContainer)
      );

      // CENTER CALCULATIONS
      const rect = tabletContainer.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const tabletCenterX = rect.left + rect.width / 2;
      const tabletCenterY = rect.top + rect.height / 2;

      const moveX = centerX - tabletCenterX;
      const moveY = centerY - tabletCenterY;

      setTimeout(() => {
        tabletAnimationLink.playZoomSound();
      }, 200);

      const tl = gsap.timeline({
        onComplete: () => {
          onNavigate();
          // Reset for next page (though location.href will reload)
          isNavigating = false;
        },
      });

      // GLOBAL FADE SYSTEM
      if (filteredFadeElements.length > 0) {
        tl.to(
          filteredFadeElements,
          {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: "power2.in",
            stagger: 0.02,
          },
          0
        );
      }

      // DARKEN TABLET SCREEN
      if (screenContent) {
        tl.to(
          screenContent,
          {
            filter: "brightness(0)",
            duration: 0.4,
            ease: "power2.in",
          },
          0
        );
      }

      // MOVE TABLET TO CENTER
      tl.to(
        tabletContainer,
        {
          x: moveX,
          y: moveY,
          duration: 0.5,
          ease: "power2.inOut",
        },
        0
      );

      // MAIN ZOOM
      tl.to(
        tabletModel,
        {
          scale: 25,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 360,
          duration: 1.1,
          ease: "power3.in",
        },
        0.2
      );

      // INNER DEPTH
      if (tabletInner) {
        tl.to(
          tabletInner,
          {
            z: 6000,
            rotateY: 0,
            duration: 1.1,
            ease: "power3.in",
          },
          0.2
        );
      }

      // FINAL BLACK FADE
      tl.to(
        overlay,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.in",
        },
        0.8
      );
    } catch (error) {
      console.error("Tablet animation failed:", error);
      document.body.style.overflow = "";
      ScrollTrigger.getAll().forEach(st => st.enable());
      isNavigating = false;
      onNavigate();
    }
  },

  playZoomSound: (): void => {
    try {
      const audio = new Audio("/sounds/zoom.mp3");

      audio.volume = 1.0;

      audio.play().catch((err) => {
        console.warn("Could not play zoom sound:", err);
      });
    } catch (err) {
      console.warn("Audio instantiation failed:", err);
    }
  },

  scrollToTablet: (element: HTMLElement): Promise<void> => {
    return new Promise((resolve) => {
      const rect = element.getBoundingClientRect();

      const isVisible =
        rect.top >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight);

      if (isVisible) {
        resolve();
      } else {
        gsap.to(window, {
          scrollTo: {
            y: element,
            offsetY: 0,
          },
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: resolve,
        });
      }
    });
  },

  getOrCreateOverlay: (): HTMLElement => {
    let overlay = document.getElementById("tablet-nav-overlay");

    if (!overlay) {
      overlay = document.createElement("div");

      overlay.id = "tablet-nav-overlay";

      Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        zIndex: "9999",
        opacity: "0",
        pointerEvents: "none",
      });

      document.body.appendChild(overlay);
    }

    return overlay;
  },
};