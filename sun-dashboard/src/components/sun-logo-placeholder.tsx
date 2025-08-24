import * as React from "react";

interface SunLogoPlaceholderProps {
  size?: number;
  width?: number;
  height?: number;
  className?: string;
}

// Temporary placeholder component until the actual logo image is added
export const SunLogoPlaceholder: React.FC<SunLogoPlaceholderProps> = ({
  size = 40,
  width,
  height,
  className = "",
  ...props
}) => (
  <div
    className={`inline-flex items-center justify-center bg-gradient-to-br from-sun-gold-400 to-sun-gold-600 rounded-lg shadow-lg ${className}`}
    style={{
      width: size || width,
      height: size || height,
    }}
    {...props}
  >
    <div className="text-white font-bold text-center leading-none">
      <div className="text-xs">SUN</div>
      <div className="text-[8px] opacity-90">GROUP</div>
    </div>
  </div>
);

// Instructions component for adding the real logo
export const LogoInstructions: React.FC = () => (
  <div className="p-4 bg-sun-gold-50 border border-sun-gold-200 rounded-lg">
    <h3 className="font-semibold text-sun-gold-800 mb-2">Add Sun Group Logo</h3>
    <p className="text-sm text-sun-gold-700 mb-2">
      To use the actual Sun Group logo, please:
    </p>
    <ol className="text-sm text-sun-gold-700 list-decimal list-inside space-y-1">
      <li>Save your logo image as <code className="bg-sun-gold-100 px-1 rounded">sun-group-logo.png</code></li>
      <li>Place it in the <code className="bg-sun-gold-100 px-1 rounded">public/images/</code> directory</li>
      <li>The logo will automatically appear in the navbar and login page</li>
    </ol>
    <p className="text-xs text-sun-gold-600 mt-2">
      Recommended: PNG format, transparent background, minimum 200x200px
    </p>
  </div>
);
