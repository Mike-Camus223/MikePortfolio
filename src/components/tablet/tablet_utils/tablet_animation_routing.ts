import gsap from "gsap";

/**
 * Utility for global tablet animations to ensure consistency across the UI.
 * This handles transitions between "apps" or views within the tablet.
 */

export const tabletAnimationRouting = {
  /**
   * Standard animation for an app or menu entering the screen.
   * @param target The element(s) to animate in.
   * @param onComplete Optional callback when animation finishes.
   */
  animateAppEntrance: (target: gsap.TweenTarget, onComplete?: () => void) => {
    // Ensure clean start
    gsap.set(target, {
      opacity: 0,
      y: 30,
      scale: 0.97,
    });

    return gsap.to(target, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "expo.out",
      clearProps: "transform",
      onComplete,
    });
  },

  /**
   * Standard animation for an app or menu exiting the screen.
   * @param target The element(s) to animate out.
   * @param onComplete Optional callback when animation finishes.
   */
  animateAppExit: (target: gsap.TweenTarget, onComplete?: () => void) => {
    return gsap.to(target, {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.5,
      ease: "power2.in",
      onComplete,
    });
  },

  /**
   * Animation for grid items or lists with stagger.
   */
  animateStaggeredItems: (items: gsap.TweenTarget, visible: boolean) => {
    if (visible) {
      gsap.set(items, { y: 30, opacity: 0, scale: 0.8 });
      return gsap.to(items, { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, 
        ease: "back.out(1.5)", 
        stagger: { amount: 0.3 } 
      });
    } else {
      return gsap.to(items, { 
        y: 20, 
        opacity: 0, 
        scale: 0.9, 
        duration: 0.3, 
        ease: "power2.in", 
        stagger: 0.02 
      });
    }
  },

  /**
   * Animation for internal elements like the dock or subtitles.
   */
  animateUiElements: (elements: gsap.TweenTarget, show: boolean, delay: number = 0) => {
    if (show) {
      gsap.set(elements, { opacity: 0, y: 20 });
      return gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.1,
        delay,
      });
    } else {
      return gsap.to(elements, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power2.in",
        stagger: 0.05,
      });
    }
  }
};
