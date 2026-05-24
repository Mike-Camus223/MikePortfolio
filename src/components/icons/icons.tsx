import type { SVGProps } from "react";

type IconName =
  | "angular"
  | "javascript"
  | "typescript"
  | "vue"
  | "tailwind"
  | "css"
  | "html"
  | "react"
  | "sass";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
}

const icons = {
  angular: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fill="#DD0031" d="M24 4L7 10l2.7 22.3L24 44l14.3-11.7L41 10 24 4z" />
      <path fill="#C3002F" d="M24 4v40l14.3-11.7L41 10 24 4z" />
      <path
        fill="#FFF"
        d="M24 9.2l-10.6 23.7h4l2.1-5.3h8.8l2.1 5.3h4L24 9.2zm2.8 15h-5.6L24 17l2.8 7.2z"
      />
    </svg>
  ),

  javascript: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fill="#ffd600" d="M6,42V6h36v36H6z" />
      <path
        fill="#000001"
        d="M29.538 32.947c.692 1.124 1.444 2.201 3.037 2.201 1.338 0 2.04-.665 2.04-1.585 0-1.101-.726-1.492-2.198-2.133l-.807-.344c-2.329-.988-3.878-2.226-3.878-4.841 0-2.41 1.845-4.244 4.728-4.244 2.053 0 3.528.711 4.592 2.573l-2.514 1.607c-.553-.988-1.151-1.377-2.078-1.377-.946 0-1.545.597-1.545 1.377 0 .964.6 1.354 1.985 1.951l.807.344C36.452 29.645 38 30.839 38 33.523 38 36.415 35.716 38 32.65 38c-2.999 0-4.702-1.505-5.65-3.368L29.538 32.947zM17.952 33.029c.506.906 1.275 1.603 2.381 1.603 1.058 0 1.667-.418 1.667-2.043V22h3.333v11.101c0 3.367-1.953 4.899-4.805 4.899-2.577 0-4.437-1.746-5.195-3.368L17.952 33.029z"
      />
    </svg>
  ),

  typescript: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="36" height="36" x="6" y="6" fill="#1976d2" />
      <polygon
        fill="#fff"
        points="27.49,22 14.227,22 14.227,25.264 18.984,25.264 18.984,40 22.753,40 22.753,25.264 27.49,25.264"
      />
      <path
        fill="#fff"
        d="M39.194,26.084c0,0-1.787-1.192-3.807-1.192s-2.747,0.96-2.747,1.986c0,2.648,7.381,2.383,7.381,7.712c0,8.209-11.254,4.568-11.254,4.568V35.22c0,0,2.152,1.622,4.733,1.622s2.483-1.688,2.483-1.92c0-2.449-7.315-2.449-7.315-7.878c0-7.381,10.658-4.469,10.658-4.469L39.194,26.084z"
      />
    </svg>
  ),

  vue: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <polygon
        fill="#81c784"
        points="23.987,17 18.734,8 2.974,8 23.987,44 45,8 29.24,8"
      />
      <polygon
        fill="#455a64"
        points="29.24,8 23.987,17 18.734,8 11.146,8 23.987,30 36.828,8"
      />
    </svg>
  ),

  tailwind: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="#00acc1"
        d="M24,9.604c-6.4,0-10.4,3.199-12,9.597c2.4-3.199,5.2-4.398,8.4-3.599c1.826,0.456,3.131,1.781,4.576,3.247C27.328,21.236,30.051,24,36,24c6.4,0,10.4-3.199,12-9.598c-2.4,3.199-5.2,4.399-8.4,3.6c-1.825-0.456-3.13-1.781-4.575-3.247C32.672,12.367,29.948,9.604,24,9.604zM12,24c-6.4,0-10.4,3.199-12,9.598c2.4-3.199,5.2-4.399,8.4-3.599c1.825,0.457,3.13,1.781,4.575,3.246c2.353,2.388,5.077,5.152,11.025,5.152c6.4,0,10.4-3.199,12-9.598c-2.4,3.199-5.2,4.399-8.4,3.599c-1.826-0.456-3.131-1.781-4.576-3.246C20.672,26.764,17.949,24,12,24z"
      />
    </svg>
  ),

  css: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fill="#0277BD" d="M41,5H7l3,34l14,4l14-4L41,5z" />
      <path fill="#039BE5" d="M24 8L24 39.9 35.2 36.7 37.7 8z" />
      <path
        fill="#FFF"
        d="M33.1 13L24 13 24 17 28.9 17 28.6 21 24 21 24 25 28.4 25 28.1 29.5 24 30.9 24 35.1 31.9 32.5 32.6 21 32.6 21z"
      />
      <path
        fill="#EEE"
        d="M24,13v4h-8.9l-0.3-4H24zM19.4,21l0.2,4H24v-4H19.4zM19.8,27h-4l0.3,5.5l7.9,2.6v-4.2l-4.1-1.4L19.8,27z"
      />
    </svg>
  ),

  html: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fill="#E65100" d="M41,5H7l3,34l14,4l14-4L41,5z" />
      <path fill="#FF6D00" d="M24 8L24 39.9 35.2 36.7 37.7 8z" />
      <path
        fill="#FFF"
        d="M24,25v-4h8.6l-0.7,11.5L24,35.1v-4.2l4.1-1.4l0.3-4.5H24zM32.9,17l0.3-4H24v4H32.9z"
      />
      <path
        fill="#EEE"
        d="M24,30.9v4.2l-7.9-2.6L15.7,27h4l0.2,2.5L24,30.9zM19.1,17H24v-4h-9.1l0.7,12H24v-4h-4.6L19.1,17z"
      />
    </svg>
  ),

  react: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="#61DAFB"
        d="M15 3C13.3 3 11.7 3.7 10.5 5C8.7 4.2 7.1 4 5.9 4.7C3.7 6 3.5 9.4 5 13C3.7 14.3 3 15.7 3 17C3 18.3 3.7 19.7 5 21C3.5 24.6 3.7 28 5.9 29.3C7.1 30 8.7 29.8 10.5 29C11.7 30.3 13.3 31 15 31C16.7 31 18.3 30.3 19.5 29C21.3 29.8 22.9 30 24.1 29.3C26.3 28 26.5 24.6 25 21C26.3 19.7 27 18.3 27 17C27 15.7 26.3 14.3 25 13C26.5 9.4 26.3 6 24.1 4.7C22.9 4 21.3 4.2 19.5 5C18.3 3.7 16.7 3 15 3ZM15 13.5C16.9 13.5 18.5 15.1 18.5 17C18.5 18.9 16.9 20.5 15 20.5C13.1 20.5 11.5 18.9 11.5 17C11.5 15.1 13.1 13.5 15 13.5Z"
      />
    </svg>
  ),

  sass: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="#f06292"
        d="M39.867,25.956c-1.538,0.008-2.87,0.377-3.986,0.928..."
      />
    </svg>
  ),
};

export default function Icon({
  name,
  size = 24,
  className,
  ...props
}: IconProps) {
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