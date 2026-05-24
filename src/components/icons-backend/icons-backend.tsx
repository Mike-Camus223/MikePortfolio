import type { SVGProps } from "react";

type BackendIconName = "supabase" | "firebase";

interface BackendIconProps extends SVGProps<SVGSVGElement> {
  name: BackendIconName;
  size?: number | string;
}

const icons = {
  supabase: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="#71c674"
        d="M43.9,22.5L27.5,43.3c-1.2,1.4-3.5,0.6-3.5-1.2V30H6.6c-2.1,0-3.3-2.5-2-4.1L20.7,5.1c1.1-1.5,3.4-0.7,3.4,1.2v12.1h17.7C44.1,18.4,45.3,20.8,43.9,22.5z"
      />
    </svg>
  ),

  firebase: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="#ffa000"
        d="M25.01,8.565c-0.386-0.753-1.466-0.755-1.848,0l-2.347,4.426L15.404,2.547c-0.471-0.874-1.798-0.653-1.952,0.325L8.003,37.997L30.25,18.75L25.01,8.565z"
      />

      <path
        fill="#f57f17"
        d="M25.795 22.604L20.815 12.992 8.003 37.997z"
      />

      <path
        fill="#ffca28"
        d="M35.859,11.838c-0.13-0.802-1.115-1.12-1.69-0.544L8.003,38.002l14.479,7.614c0.917,0.512,2.034,0.512,2.951,0.001L40,38.005L35.859,11.838z"
      />
    </svg>
  ),
};

export default function BackendIcon({
  name,
  size = 24,
  className,
  ...props
}: BackendIconProps) {
  const Component = icons[name];

  return (
    <Component
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
}