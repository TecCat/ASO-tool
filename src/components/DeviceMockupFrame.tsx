import React from 'react';
import { DeviceConfig, DeviceType, DeviceColor } from '../types';

interface DeviceMockupFrameProps {
  deviceConfig: DeviceConfig;
  screenshotUrl: string;
  isTablet?: boolean;
  className?: string;
}

export const DeviceMockupFrame: React.FC<DeviceMockupFrameProps> = ({
  deviceConfig,
  screenshotUrl,
  isTablet = false,
  className = '',
}) => {
  const {
    deviceType = 'iphone-16-pro-max',
    deviceColor = 'natural-titanium',
    showDynamicIsland = true,
    showStatusBar = true,
    statusBarTheme = 'light',
    statusTime = '9:41',
    glareEffect = true,
    rotateZ = 0,
    rotateY = 0,
    rotateX = 0,
    shadowIntensity = 80,
    scale = 1,
    screenshotFit = 'cover',
    screenshotScale = 1,
  } = deviceConfig;

  // Determine frame style characteristics based on device type
  const isAndroid =
    deviceType === 'samsung-s25-ultra' ||
    deviceType === 'samsung-s24' ||
    deviceType === 'google-pixel-9-pro' ||
    deviceType === 'google-pixel-fold' ||
    deviceType === 'oneplus-13' ||
    deviceType === 'android-tablet-10';

  const isGalaxyUltra = deviceType === 'samsung-s25-ultra';
  const isHomeButtonModel = deviceType === 'iphone-8-plus';
  const isNotchModel = deviceType === 'iphone-13';
  const isFoldableOrTablet =
    isTablet ||
    deviceType === 'ipad-pro-13' ||
    deviceType === 'ipad-pro-11' ||
    deviceType === 'ipad-mini' ||
    deviceType === 'android-tablet-10' ||
    deviceType === 'google-pixel-fold';

  const isMini = deviceType === 'ipad-mini';
  const isFold = deviceType === 'google-pixel-fold';

  // Dimension scaling tailored to 520x1120 canvas (occupying ~70% width & 70% height)
  let frameWidth = 'w-[365px]';
  let frameHeight = 'h-[785px]';
  let outerBorderRadius = 'rounded-[52px]';
  let innerBorderRadius = 'rounded-[46px]';
  let bezelPadding = 'p-[7px]';

  if (isFoldableOrTablet) {
    if (isFold) {
      frameWidth = 'w-[410px]';
      frameHeight = 'h-[530px]';
      outerBorderRadius = 'rounded-[32px]';
      innerBorderRadius = 'rounded-[26px]';
      bezelPadding = 'p-[8px]';
    } else if (isMini) {
      frameWidth = 'w-[390px]';
      frameHeight = 'h-[560px]';
      outerBorderRadius = 'rounded-[34px]';
      innerBorderRadius = 'rounded-[28px]';
      bezelPadding = 'p-[9px]';
    } else {
      frameWidth = 'w-[435px]';
      frameHeight = 'h-[600px]';
      outerBorderRadius = 'rounded-[38px]';
      innerBorderRadius = 'rounded-[30px]';
      bezelPadding = 'p-[11px]';
    }
  } else if (isGalaxyUltra) {
    // Iconic sharp corner titanium boxy profile
    frameWidth = 'w-[368px]';
    frameHeight = 'h-[790px]';
    outerBorderRadius = 'rounded-[18px]';
    innerBorderRadius = 'rounded-[12px]';
    bezelPadding = 'p-[6px]';
  } else if (isHomeButtonModel) {
    frameWidth = 'w-[365px]';
    frameHeight = 'h-[785px]';
    outerBorderRadius = 'rounded-[46px]';
    innerBorderRadius = 'rounded-[4px]';
    bezelPadding = 'pt-[70px] pb-[76px] px-[16px]';
  }

  const bezelBorder = getMetallicBorder(deviceColor);

  return (
    <div
      className={`relative transition-transform duration-200 select-none ${className}`}
      style={{
        transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
    >
      {/* Outer Metallic Rim Container */}
      <div
        className={`relative ${frameWidth} ${frameHeight} ${outerBorderRadius} ${bezelPadding} transition-all`}
        style={{
          background: bezelBorder.outerRim,
          boxShadow: `
            0 28px 65px -15px rgba(0, 0, 0, ${(shadowIntensity / 100) * 0.85}),
            0 0 0 1px rgba(255, 255, 255, 0.18) inset,
            0 12px 24px -8px rgba(0, 0, 0, 0.45)
          `,
        }}
      >
        {/* Classic iPhone 8 Plus Top Speaker & Camera Section */}
        {isHomeButtonModel && (
          <div className="absolute top-0 left-0 right-0 h-[54px] flex flex-col items-center justify-center pointer-events-none">
            {/* Top camera lens */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1e] border border-white/10 mb-1 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-900/60" />
            </div>
            {/* Speaker bar */}
            <div className="w-12 h-1 bg-[#2c2c2e] rounded-full border border-black/50" />
          </div>
        )}

        {/* Inner Screen Display Viewport */}
        <div
          className={`w-full h-full relative overflow-hidden bg-black ${innerBorderRadius} border border-neutral-800/80 shadow-inner flex flex-col`}
        >
          {/* User App Screenshot */}
          {screenshotUrl ? (
            <div className="w-full h-full flex items-center justify-center overflow-hidden bg-[#09090c]">
              <img
                src={screenshotUrl}
                alt="App Screenshot"
                className={`w-full h-full ${
                  screenshotFit === 'contain'
                    ? 'object-contain object-center'
                    : screenshotFit === 'fill'
                    ? 'object-fill'
                    : 'object-cover object-top'
                } select-none pointer-events-none transition-transform duration-200`}
                style={
                  screenshotScale && screenshotScale !== 1
                    ? { transform: `scale(${screenshotScale})` }
                    : undefined
                }
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-400 p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mb-3 text-2xl">
                📱
              </div>
              <p className="text-sm font-semibold text-neutral-200">請上傳 App 截圖</p>
              <p className="text-xs text-neutral-500 mt-1">支援 PNG / JPG 拖放上傳</p>
            </div>
          )}

          {/* Dynamic Island (Modern iPhones) */}
          {showDynamicIsland &&
            !isFoldableOrTablet &&
            !isHomeButtonModel &&
            !isNotchModel &&
            !isAndroid && (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[84px] h-[24px] bg-black rounded-full z-20 flex items-center justify-between px-2 shadow-md">
                {/* Left FaceID sensor */}
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-indigo-950/80" />
                </div>
                {/* Right Selfie Camera */}
                <div className="w-3 h-3 rounded-full bg-neutral-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-950 border border-blue-900/50" />
                </div>
              </div>
            )}

          {/* Classic iPhone Notch */}
          {isNotchModel && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[112px] h-[22px] bg-black rounded-b-[16px] z-20 flex items-center justify-center px-3 shadow-md">
              <div className="w-10 h-1 bg-[#242426] rounded-full mb-1" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0c] ml-2.5 border border-white/10 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-950" />
              </div>
            </div>
          )}

          {/* Android Center Punch-Hole Camera (Samsung / Pixel / OnePlus) */}
          {isAndroid && !isFoldableOrTablet && (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-black z-20 flex items-center justify-center shadow-xs border border-neutral-900">
              <div className="w-2 h-2 rounded-full bg-[#070b14] border border-blue-900/60 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-cyan-400/40" />
              </div>
            </div>
          )}

          {/* Tablet Front Camera Dot */}
          {isFoldableOrTablet && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-black/90 z-20 border border-white/10 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-950" />
            </div>
          )}

          {/* Platform Status Bar */}
          {showStatusBar && !isHomeButtonModel && (
            <div
              className={`absolute top-0 left-0 right-0 h-9 px-5 flex items-center justify-between text-xs font-semibold z-10 select-none ${
                statusBarTheme === 'dark' ? 'text-neutral-900' : 'text-white'
              }`}
            >
              {/* Left: Clock */}
              <span className="font-mono text-[11px] font-bold tracking-tight">
                {statusTime || (isAndroid ? '10:00' : '9:41')}
              </span>

              {/* Right: Network & Battery Icons */}
              {isAndroid ? (
                // Android Material You Status Bar Icons
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-[9px] font-bold tracking-wider opacity-90">5G</span>
                  {/* Cellular */}
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M2 22h20V2L2 22z" />
                  </svg>
                  {/* Wifi */}
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.3c3.8 0 7.24 1.5 9.77 3.98L12 19.14 2.23 11.28C4.76 8.8 8.2 7.3 12 7.3z" />
                  </svg>
                  {/* Battery Pill */}
                  <div className="flex items-center gap-0.5">
                    <span className="text-[9px] font-mono">98%</span>
                    <div className="w-2.5 h-4 rounded-xs border border-current p-0.5 flex flex-col justify-end">
                      <div className="w-full h-3/4 bg-current rounded-xs" />
                    </div>
                  </div>
                </div>
              ) : (
                // iOS Status Bar Icons
                <div className="flex items-center gap-1.5">
                  <div className="flex items-end gap-0.5 h-2.5">
                    <div className="w-0.5 h-1 bg-current rounded-xs" />
                    <div className="w-0.5 h-1.5 bg-current rounded-xs" />
                    <div className="w-0.5 h-2 bg-current rounded-xs" />
                    <div className="w-0.5 h-2.5 bg-current rounded-xs" />
                  </div>
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.3c3.8 0 7.24 1.5 9.77 3.98L12 19.14 2.23 11.28C4.76 8.8 8.2 7.3 12 7.3z" />
                  </svg>
                  <div className="flex items-center gap-0.5">
                    <div className="w-5 h-2.5 rounded-sm border border-current p-0.5 flex items-center">
                      <div className="w-full h-full bg-current rounded-xs" />
                    </div>
                    <div className="w-0.5 h-1 bg-current rounded-r-xs" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Screen Glass Reflection Sheen */}
          {glareEffect && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.1] pointer-events-none z-10" />
          )}
        </div>

        {/* Classic iPhone 8 Plus Bottom Touch ID Home Button */}
        {isHomeButtonModel && (
          <div className="absolute bottom-0 left-0 right-0 h-[58px] flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-[#161618] shadow-inner flex items-center justify-center">
              <div className="w-9 h-9 rounded-full border border-black/60 bg-[#1c1c1e]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function getMetallicBorder(color: DeviceColor) {
  switch (color) {
    case 'desert-titanium':
      return {
        outerRim: 'linear-gradient(145deg, #d4b48f 0%, #997754 50%, #e0c8aa 100%)',
      };
    case 'natural-titanium':
      return {
        outerRim: 'linear-gradient(145deg, #aba69b 0%, #706c64 50%, #c0bbb0 100%)',
      };
    case 'black-titanium':
      return {
        outerRim: 'linear-gradient(145deg, #3c3c3e 0%, #1f1f21 50%, #4c4c4e 100%)',
      };
    case 'white-titanium':
      return {
        outerRim: 'linear-gradient(145deg, #f2f2f7 0%, #b8b8bd 50%, #ffffff 100%)',
      };
    case 'titanium-gray':
      return {
        outerRim: 'linear-gradient(145deg, #8e9099 0%, #575a61 50%, #9ca0a8 100%)',
      };
    case 'onyx-black':
      return {
        outerRim: 'linear-gradient(145deg, #2a2b2e 0%, #111214 50%, #36373b 100%)',
      };
    case 'cobalt-violet':
      return {
        outerRim: 'linear-gradient(145deg, #6366a6 0%, #3b3d6e 50%, #7a7dc2 100%)',
      };
    case 'amber-yellow':
      return {
        outerRim: 'linear-gradient(145deg, #ecd189 0%, #b89849 50%, #f7e2a8 100%)',
      };
    case 'hazel-green':
      return {
        outerRim: 'linear-gradient(145deg, #6b8273 0%, #44544b 50%, #829c8c 100%)',
      };
    case 'porcelain-white':
      return {
        outerRim: 'linear-gradient(145deg, #fafafa 0%, #d4d4d8 50%, #ffffff 100%)',
      };
    case 'obsidian-black':
      return {
        outerRim: 'linear-gradient(145deg, #262626 0%, #0a0a0a 50%, #383838 100%)',
      };
    case 'bay-blue':
      return {
        outerRim: 'linear-gradient(145deg, #60a5fa 0%, #2563eb 50%, #93c5fd 100%)',
      };
    case 'midnight-blue':
      return {
        outerRim: 'linear-gradient(145deg, #384860 0%, #1e293b 50%, #4f637f 100%)',
      };
    case 'gold':
      return {
        outerRim: 'linear-gradient(145deg, #fbbf24 0%, #b45309 50%, #fde68a 100%)',
      };
    case 'rose-gold':
      return {
        outerRim: 'linear-gradient(145deg, #f472b6 0%, #be185d 50%, #fbcfe8 100%)',
      };
    default:
      return {
        outerRim: 'linear-gradient(145deg, #71717a 0%, #3f3f46 50%, #a1a1aa 100%)',
      };
  }
}

