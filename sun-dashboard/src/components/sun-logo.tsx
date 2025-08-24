import * as React from "react";

interface SunLogoProps {
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

export const SunLogo: React.FC<SunLogoProps> = ({
  size = 40,
  width,
  height,
  className = "",
  alt = "Sun Group Logo",
  ...props
}) => (
  <img
    src="/images/sun-group-logo.png"
    alt={alt}
    width={size || width}
    height={size || height}
    className={`object-contain ${className}`}
    {...props}
  />
);

// Simplified version for smaller contexts
export const SunLogoSimple: React.FC<SunLogoProps> = ({
  size = 32,
  width,
  height,
  className = "",
  alt = "Sun Group",
  ...props
}) => (
  <img
    src="/images/sun-group-logo.png"
    alt={alt}
    width={size || width}
    height={size || height}
    className={`object-contain ${className}`}
    {...props}
  />
);

// Icon version for navbar and small contexts
export const SunIcon: React.FC<SunLogoProps> = ({
  size = 24,
  width,
  height,
  className = "",
  alt = "Sun Group",
  ...props
}) => (
  <img
    src="/images/sun-group-logo.png"
    alt={alt}
    width={size || width || height}
    height={size || width || height}
    className={`object-contain ${className}`}
    {...props}
  />
);
