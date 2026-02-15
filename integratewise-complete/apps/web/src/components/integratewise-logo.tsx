"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: "horizontal" | "mark" | "full";
  size?: "sm" | "md" | "lg" | "xl";
}

const LOGO_INTRINSIC = { width: 545, height: 159 };

export function IntegrateWiseLogo({
  className,
  showText = true,
  variant = "horizontal",
  size = "md"
}: LogoProps) {
  const sizes = {
    sm: { height: 28 },
    md: { height: 36 },
    lg: { height: 48 },
    xl: { height: 64 }
  };

  const aspectRatio = LOGO_INTRINSIC.width / LOGO_INTRINSIC.height;
  const targetHeight = sizes[size].height;
  const targetWidth = Math.round(targetHeight * aspectRatio);

  // For the horizontal variant (default), use the main logo
  const logoSrc = "/logo.svg";

  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src={logoSrc}
        alt="IntegrateWise"
        width={targetWidth}
        height={targetHeight}
        className="h-auto w-auto"
        priority
      />
    </div>
  );
}

export function IntegrateWiseIcon({
  className,
  size = "md"
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 64
  };

  const iconSize = sizes[size];

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 159 159"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M78.825 34.139c3.21-.783 10.366.813 13.404 2.319 3.611 1.516 5.796 3.733 8.581 6.387 10.001 9.53 6.56 23.485 7.171 35.766.212 4.273-.066 7.047 1.529 11.245a18.92 18.92 0 0 0 9.986 10.578c5.457 2.451 10.753 2.286 16.388.122 21.942-8.425 6.98-35.282 15.118-51.83 3.185-6.477 7.734-10.31 14.433-13.057 2.106-.863 8.271-2.184 10.256-1.226a3.7 3.7 0 0 1 1.916 2.196c1.52 4.737-6.708 3.561-9.721 4.725-26.043 10.054-3.092 43.252-20.71 59.151-4.113 3.711-7.265 5.639-12.691 7.265a25.1 25.1 0 0 1-11.522.486c-4.603-.909-8.394-3.162-11.964-6.037-17.589-13.077-3.336-37.943-13.34-53.219-11.52-17.594-39.239-6.623-37.016 13.95.428 3.965.847 8.944-2.615 11.275l-7.382.025c-1.003 2.264-1.771 4.194-3.387 6.118a13.32 13.32 0 0 1-9.126 4.646c-3.4.27-7.229-1.003-9.812-3.22a13.2 13.2 0 0 1-4.565-9.062c-.275-3.773.966-7.5 3.45-10.356a12.92 12.92 0 0 1 8.943-4.308c5.025-.318 10.233 1.976 12.27 6.544.815 1.826 1.366 3.52 3.736 3.44 2.86.204 2.702-3.359 2.496-5.686-1.223-13.761 8.694-26.997 24.174-28.237"
        fill="#4154A3"
      />
      <path
        d="M79.9 58.031c2.956-.186 5.91.41 8.436 1.992a13.2 13.2 0 0 1 5.766 8.176c1.67 7.34-2.144 14.549-9.694 16.213-.523 6.829.164 13.865-.274 20.697-.116 1.816-.63 2.82-2.074 3.922q-.198.015-.398.02c-5.219.104-3.645-9.023-3.572-12.642q.117-5.84-.042-11.681c-2.113-.724-3.325-1.094-5.146-2.452-8.374-6.24-6.533-19.699 3.265-23.389 1.448-.545 2.228-.666 3.733-.856m47-24.059c.842.01 1.824.023 2.564.472 1.962 1.192.847 20.187 1.642 23.754 1.762.566 2.908 1.035 4.458 2.127a13.1 13.1 0 0 1 5.346 8.662c1.405 8.634-3.563 14.542-11.971 15.849-10.491.218-16.969-8.01-13.74-18.215 1.524-4.814 5.383-6.912 9.642-8.952-.209-2.502-.078-6.39-.106-9.028-.041-3.74-.331-8.106.154-11.774.205-1.548.813-2.086 2.011-2.895"
        fill="#4154A3"
      />
    </svg>
  );
}
