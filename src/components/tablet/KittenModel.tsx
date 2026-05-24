import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { useCursorNDC } from "./context/CursorNDCContext";

type KittenModelProps = {
  modelPath: string;
  animateIn: boolean;
  visible: boolean;
  spinActive: boolean;
  spinDirection: 1 | -1;
  floatPhase: number;
  position: [number, number, number];
};

const MODEL_SCALE = 5;

export function KittenModel({
  modelPath,
  animateIn,
  visible,
  spinActive,
  spinDirection,
  floatPhase,
  position,
}: KittenModelProps) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const hasAnimated = useRef(false);

  const currentRotX = useRef(0);
  const currentRotY = useRef(0);
  const targetRotX  = useRef(0);
  const targetRotY  = useRef(0);

  const spinYRef          = useRef(0);
  const wasSpinningRef    = useRef(false);
  const justReleasedRef   = useRef(false);

  const cursorNDC = useCursorNDC();
  const cursorNDCRef = useRef(cursorNDC);

  useEffect(() => {
    cursorNDCRef.current = cursorNDC;
  }, [cursorNDC]);

  // Initial Entry Animation
  useEffect(() => {
    if (!modelRef.current || hasAnimated.current) return;

    const model = modelRef.current;
    
    // Set final base position immediately to avoid "jumping"
    model.position.y = -1.2;

    if (animateIn) {
      hasAnimated.current = true;
      // Setup initial state for animation: only scale
      gsap.set(model.scale, { x: 0, y: 0, z: 0 });
      
      gsap.to(model.scale, { 
        x: MODEL_SCALE, y: MODEL_SCALE, z: MODEL_SCALE, 
        duration: 1.2, 
        ease: "elastic.out(1, 0.75)",
        delay: 0.4 // Wait for menu to start showing
      });
    } else {
      // If not animating in, just set final scale
      gsap.set(model.scale, { x: MODEL_SCALE, y: MODEL_SCALE, z: MODEL_SCALE });
      hasAnimated.current = true;
    }
  }, [animateIn, scene]);

  // Visibility toggle (Apps open/close)
  useEffect(() => {
    if (!modelRef.current || !hasAnimated.current) return;
    gsap.to(modelRef.current.scale, {
      x: visible ? MODEL_SCALE : 0,
      y: visible ? MODEL_SCALE : 0,
      z: visible ? MODEL_SCALE : 0,
      duration: 0.5,
      ease: visible ? "back.out(1.7)" : "power3.inOut",
    });
  }, [visible]);

  useFrame(({ clock }) => {
    const model = modelRef.current;
    if (!model || !hasAnimated.current) return;

    // Floating effect - only apply if not spinning
    const t = clock.getElapsedTime();
    if (!spinActive) {
      model.position.y = -0.9 + Math.sin(t * 0.9 + floatPhase) * 0.04;
    }

    const lerpFactor = 0.08;

    if (spinActive) {
      if (!wasSpinningRef.current) {
        spinYRef.current = model.rotation.y;
        wasSpinningRef.current = true;
      }
      
      spinYRef.current += spinDirection * 0.07; 
      model.rotation.y = spinYRef.current;
      model.rotation.x = 0;
      
      currentRotX.current = 0;
      currentRotY.current = spinYRef.current % (Math.PI * 2);
    } else {
      if (wasSpinningRef.current) {
        wasSpinningRef.current = false;
        justReleasedRef.current = true;
      }

      const ndc = cursorNDCRef.current;

      if (justReleasedRef.current) {
        spinYRef.current = currentRotY.current;
        justReleasedRef.current = false;
      }

      if (ndc !== null) {
        targetRotY.current = ndc.x * 0.5;
        targetRotX.current = ndc.y * 0.25;
      } else {
        targetRotY.current = 0;
        targetRotX.current = 0;
      }

      currentRotX.current += (targetRotX.current - currentRotX.current) * lerpFactor;
      currentRotY.current += (targetRotY.current - currentRotY.current) * lerpFactor;

      model.rotation.x = currentRotX.current;
      model.rotation.y = currentRotY.current;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <primitive ref={modelRef} object={scene} />
    </group>
  );
}
