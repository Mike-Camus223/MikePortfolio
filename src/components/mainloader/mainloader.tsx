import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

const N = 24;

type Anchor = {
  x: number;
  y: number;
  cpIn?: { x: number; y: number };
  cpOut?: { x: number; y: number };
};

function buildPath(anchors: Anchor[]) {
  const n = anchors.length;

  let d = `M ${anchors[0].x.toFixed(4)} ${anchors[0].y.toFixed(4)}`;

  for (let i = 0; i < n; i++) {
    const cur = anchors[i];
    const next = anchors[(i + 1) % n];

    const cp1 = cur.cpOut ?? { x: cur.x, y: cur.y };
    const cp2 = next.cpIn ?? { x: next.x, y: next.y };

    d += ` C ${cp1.x.toFixed(4)} ${cp1.y.toFixed(
      4
    )}, ${cp2.x.toFixed(4)} ${cp2.y.toFixed(
      4
    )}, ${next.x.toFixed(4)} ${next.y.toFixed(4)}`;
  }

  return d + " Z";
}

function makeEllipse(rx: number, ry: number) {
  const seg = (2 * Math.PI) / N;

  const kx = rx * (4 / 3) * Math.tan(Math.PI / (2 * N));
  const ky = ry * (4 / 3) * Math.tan(Math.PI / (2 * N));

  return buildPath(
    Array.from({ length: N }, (_, i) => {
      const t = i * seg - Math.PI / 2;

      const x = rx * Math.cos(t);
      const y = ry * Math.sin(t);

      const dtx = -rx * Math.sin(t);
      const dty = ry * Math.cos(t);

      const len = Math.sqrt(dtx * dtx + dty * dty) || 1;

      const hx = (dtx / len) * kx;
      const hy = (dty / len) * ky;

      return {
        x,
        y,
        cpIn: { x: x - hx, y: y - hy },
        cpOut: { x: x + hx, y: y + hy },
      };
    })
  );
}

function makeSun(R: number, r: number) {
  const seg = (2 * Math.PI) / N;

  return buildPath(
    Array.from({ length: N }, (_, i) => {
      const t = i * seg - Math.PI / 2;

      const outer = i % 2 === 0;
      const radius = outer ? R : r;

      const h = radius * (outer ? 0.09 : 0.3);

      const x = radius * Math.cos(t);
      const y = radius * Math.sin(t);

      const tx = -Math.sin(t);
      const ty = Math.cos(t);

      return {
        x,
        y,
        cpIn: { x: x - tx * h, y: y - ty * h },
        cpOut: { x: x + tx * h, y: y + ty * h },
      };
    })
  );
}

const PATH_OVAL = makeEllipse(32, 55);
const PATH_CIRCLE = makeEllipse(55, 55);
const PATH_SUN = makeSun(62, 42);

export default function MainLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<SVGPathElement>(null);
  const logoRef = useRef<SVGPathElement>(null);

  // PREVIENE FLASH / MAL POSICIONADO ANTES DEL PRIMER PAINT
  useLayoutEffect(() => {
    if (!rootRef.current || !wrapperRef.current) return;

    gsap.set(rootRef.current, {
      autoAlpha: 1,
    });

    gsap.set(wrapperRef.current, {
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      y: -900,
      opacity: 1,
    });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(DrawSVGPlugin);

    if (
      !rootRef.current ||
      !wrapperRef.current ||
      !blobRef.current ||
      !logoRef.current
    ) {
      return;
    }

    document.body.style.overflow = "hidden";

    gsap.set(blobRef.current, {
      attr: { d: PATH_OVAL },
      transformOrigin: "50% 50%",
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    });

    gsap.set(logoRef.current, {
      drawSVG: "0%",
    });

    const tl = gsap.timeline({
      defaults: {
        force3D: true,
      },
    });

    tl
      .to(wrapperRef.current, {
        y: 0,
        duration: 0.60,
        ease: "power4.in",
      })

      .set(blobRef.current, {
        attr: { d: PATH_CIRCLE },
      })

      .to(blobRef.current, {
        scaleX: 1.58,
        scaleY: 0.4,
        duration: 0.11,
        ease: "power4.out",
      })

      .to(blobRef.current, {
        scaleX: 0.84,
        scaleY: 1.28,
        duration: 0.18,
        ease: "power2.out",
      })

      .to(blobRef.current, {
        scaleX: 1.05,
        scaleY: 0.96,
        duration: 0.12,
        ease: "sine.inOut",
      })

      .to(blobRef.current, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.12,
        ease: "elastic.out(1, 0.42)",
      })

      .to(
        blobRef.current,
        {
          attr: { d: PATH_SUN },
          duration: 0.3,
          ease: "power2.inOut",
        },
        "-=0.08"
      )

      .to(
        blobRef.current,
        {
          rotation: 360,
          duration: 2.5,
          ease: "none",
          repeat: -1,
        },
        "-=0.35"
      )

      .to(
        logoRef.current,
        {
          drawSVG: "100%",
          duration: 0.85,
          ease: "power2.inOut",
        },
        "-=2"
      )

      .to(
        wrapperRef.current,
        {
          y: -240,
          opacity: 0,
          duration: 0.8,
          ease: "power3.inOut",
        },
        "+=0.9"
      )

      .to(
        rootRef.current,
        {
          opacity: 0,
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            rootRef.current?.remove();
            document.body.style.overflow = "";
          },
        },
        "-=0.2"
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[999999] bg-white overflow-hidden"
      style={{
        visibility: "visible",
        opacity: 1,
      }}
    >
      <div className="relative w-full h-full overflow-hidden">
        <div
          ref={wrapperRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <svg
            width="220"
            height="220"
            viewBox="-70 -70 140 140"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              display: "block",
              overflow: "visible",
              shapeRendering: "geometricPrecision",
            }}
          >
            <path ref={blobRef} fill="black" />

            <path
              ref={logoRef}
              d="M0 44.31Q3.27 43.63 4.59 40.92L4.64 40.70L9.77 6.45L22.92 36.08L35.52 6.45L40.63 40.70L40.67 40.92Q41.99 43.63 45.26 44.31L31.15 44.31Q35.82 42.58 35.82 41.02Q35.82 40.97 35.82 40.89L35.79 40.70L32.59 19.63L21.48 45.29L10.25 19.41L7.37 40.70L7.35 40.99Q7.40 42.46 12.01 44.31L0 44.31Z"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(-22.63 -25.87)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}