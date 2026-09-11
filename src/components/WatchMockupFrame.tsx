import React from 'react';
import { DeviceConfig, DeviceType, DeviceColor } from '../types';

interface WatchMockupFrameProps {
  deviceConfig: DeviceConfig;
  screenshotUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showBand?: boolean;
}

export const WatchMockupFrame: React.FC<WatchMockupFrameProps> = ({
  deviceConfig,
  screenshotUrl,
  className = '',
  size = 'md',
  showBand = true,
}) => {
  const {
    deviceType = 'apple-watch-ultra-2',
    deviceColor = 'natural-titanium',
    statusTime = '10:09',
    glareEffect = true,
    shadowIntensity = 80,
    scale = 1,
    rotateZ = 0,
    rotateY = 0,
    rotateX = 0,
    watchBandType = 'ocean-band',
    watchBandColor = '#f97316', // Ultra Orange default
    screenshotFit = 'cover',
    screenshotScale = 1,
  } = deviceConfig;

  const isUltra = deviceType === 'apple-watch-ultra-2';
  const isSeries10 = deviceType === 'apple-watch-series-10';

  // Sizing definitions: bandH is sleek and compact to avoid covering screen content
  const dimensions = {
    sm: { width: 140, height: 172, crownW: 8, crownH: 34, actionW: 6, actionH: 28, bandW: 84, bandH: 18, radius: 36, innerRadius: 28 },
    md: { width: 190, height: 232, crownW: 10, crownH: 46, actionW: 8, actionH: 38, bandW: 114, bandH: 24, radius: 46, innerRadius: 36 },
    lg: { width: 230, height: 280, crownW: 12, crownH: 56, actionW: 9, actionH: 46, bandW: 138, bandH: 30, radius: 54, innerRadius: 44 },
    hero: { width: 270, height: 330, crownW: 14, crownH: 66, actionW: 11, actionH: 54, bandW: 162, bandH: 36, radius: 64, innerRadius: 52 },
  }[size];

  // Metallic casing gradient
  const getWatchMetallicFinish = () => {
    if (isUltra) {
      return {
        caseGradient: 'linear-gradient(150deg, #c5beb3 0%, #8c867b 50%, #d8d3ca 100%)',
        bezelRim: '#797368',
        lipHighlight: 'rgba(255, 255, 255, 0.4)',
      };
    }
    if (deviceColor === 'jet-black' || deviceColor === 'black-titanium' || deviceColor === 'obsidian-black') {
      return {
        caseGradient: 'linear-gradient(150deg, #2b2b2e 0%, #0d0d0f 50%, #3a3a3d 100%)',
        bezelRim: '#18181b',
        lipHighlight: 'rgba(255, 255, 255, 0.25)',
      };
    }
    if (deviceColor === 'gold' || deviceColor === 'desert-titanium') {
      return {
        caseGradient: 'linear-gradient(150deg, #dfc09c 0%, #9e7f5e 50%, #f3dec6 100%)',
        bezelRim: '#8c6c49',
        lipHighlight: 'rgba(255, 255, 255, 0.5)',
      };
    }
    if (deviceColor === 'rose-gold') {
      return {
        caseGradient: 'linear-gradient(150deg, #f3bcc8 0%, #b87a8b 50%, #fae2e8 100%)',
        bezelRim: '#a36274',
        lipHighlight: 'rgba(255, 255, 255, 0.5)',
      };
    }
    // Silver / Natural Aluminum / Natural Titanium
    return {
      caseGradient: 'linear-gradient(150deg, #e4e4e7 0%, #a1a1aa 50%, #f4f4f5 100%)',
      bezelRim: '#71717a',
      lipHighlight: 'rgba(255, 255, 255, 0.6)',
    };
  };

  const finish = getWatchMetallicFinish();

  // Watch Band Renderer
  const renderWatchBand = (position: 'top' | 'bottom') => {
    if (!showBand || watchBandType === 'none') return null;

    const bandBg = watchBandColor || (isUltra ? '#f97316' : '#27272a');
    const isTop = position === 'top';

    return (
      <div
        className={`absolute left-1/2 -translate-x-1/2 overflow-hidden pointer-events-none z-0 ${
          isTop ? 'bottom-full -mb-3 rounded-t-2xl' : 'top-full -mt-3 rounded-b-2xl'
        }`}
        style={{
          width: `${dimensions.bandW}px`,
          height: `${dimensions.bandH}px`,
          background: bandBg,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4) inset, 0 10px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Ocean Band Wave Grooves */}
        {watchBandType === 'ocean-band' && (
          <div className="w-full h-full flex flex-col justify-around py-1 opacity-40">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full h-2 rounded-full border-t border-b border-black/30 bg-white/20 mx-auto"
                style={{ width: '88%' }}
              />
            ))}
          </div>
        )}

        {/* Alpine Loop Texture */}
        {watchBandType === 'alpine-loop' && (
          <div className="w-full h-full flex flex-col justify-around py-1.5 opacity-45">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[82%] h-3 rounded-md bg-black/25 mx-auto border border-white/20 shadow-inner"
              />
            ))}
          </div>
        )}

        {/* Sport Band Clean Shadow Ridge */}
        {watchBandType === 'sport-band' && (
          <div className="w-full h-full relative">
            <div className="absolute inset-x-2 inset-y-1 bg-black/15 rounded-xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black/25 border border-white/20" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none transition-transform duration-200 ${className}`}
      style={{
        transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
    >
      {/* Outer Watch Wrapper with Bands */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Top Band */}
        {renderWatchBand('top')}

        {/* Apple Watch Main Case */}
        <div
          className="relative z-10 flex items-center justify-center transition-all"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            borderRadius: `${dimensions.radius}px`,
            background: finish.caseGradient,
            boxShadow: `
              0 30px 60px -12px rgba(0, 0, 0, ${(shadowIntensity / 100) * 0.95}),
              0 0 0 1px ${finish.lipHighlight} inset,
              0 6px 16px -2px rgba(0, 0, 0, 0.5)
            `,
            padding: isUltra ? '7px' : '6px',
          }}
        >
          {/* --- Right Side: Digital Crown & Side Button --- */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[75%] flex flex-col items-start gap-2.5 z-0 pointer-events-none">
            {/* Crown Guard (Ultra Only) */}
            {isUltra && (
              <div
                className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-16 rounded-r-lg bg-[#9c958a] border border-[#d8d3ca]/40"
                style={{ zIndex: -1 }}
              />
            )}

            {/* Digital Crown */}
            <div
              className="relative rounded-r-md border border-neutral-900 shadow-md flex items-center overflow-hidden"
              style={{
                width: `${dimensions.crownW}px`,
                height: `${dimensions.crownH}px`,
                background: 'linear-gradient(180deg, #404044 0%, #1f1f22 50%, #4a4a4f 100%)',
              }}
            >
              {/* Crown Grooves */}
              <div className="w-full h-full flex flex-col justify-around py-0.5 opacity-60">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full h-[1.5px] bg-black/80" />
                ))}
              </div>
              {/* Red / Orange Accent Ring on Crown */}
              <div
                className="absolute left-0.5 top-0 bottom-0 w-[2.5px]"
                style={{ background: isUltra ? '#ea580c' : '#dc2626' }}
              />
            </div>

            {/* Side Flat Button */}
            <div
              className="rounded-r-sm border border-neutral-900 shadow-sm"
              style={{
                width: `${dimensions.crownW * 0.7}px`,
                height: `${dimensions.crownH * 0.75}px`,
                background: 'linear-gradient(180deg, #38383c 0%, #1c1c1e 100%)',
              }}
            />
          </div>

          {/* --- Left Side: Action Button (Ultra) or Speaker Slits --- */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[70%] flex flex-col items-end gap-1.5 z-0 pointer-events-none">
            {isUltra ? (
              // International Orange Action Button
              <div
                className="rounded-l-md shadow-md border border-[#c2410c] flex items-center justify-center"
                style={{
                  width: `${dimensions.actionW}px`,
                  height: `${dimensions.actionH}px`,
                  background: 'linear-gradient(180deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
                }}
              />
            ) : (
              // Speaker Dual Slits
              <div className="flex flex-col gap-1 pr-0.5 opacity-70">
                <div className="w-3 h-1 rounded-full bg-black/80" />
                <div className="w-3 h-1 rounded-full bg-black/80" />
              </div>
            )}
          </div>

          {/* Inner OLED Display Area */}
          <div
            className="w-full h-full relative overflow-hidden bg-black flex flex-col border border-neutral-900 shadow-inner"
            style={{
              borderRadius: `${dimensions.innerRadius}px`,
            }}
          >
            {/* Screenshot or Realistic watchOS Companion Interface */}
            {screenshotUrl ? (
              <div className="w-full h-full flex items-center justify-center overflow-hidden bg-black">
                <img
                  src={screenshotUrl}
                  alt="Apple Watch App Screenshot"
                  className={`w-full h-full ${
                    screenshotFit === 'contain'
                      ? 'object-contain object-center'
                      : screenshotFit === 'fill'
                      ? 'object-fill'
                      : 'object-cover object-center'
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
              // Default High-Quality watchOS Watch Face / App UI
              <div className="w-full h-full flex flex-col justify-between p-3.5 bg-gradient-to-b from-[#09090b] via-[#050507] to-[#020203] text-white">
                {/* Watch Top Complications Bar */}
                <div className="flex items-center justify-between text-[11px] font-bold">
                  {/* Activity Rings Widget */}
                  <div className="flex items-center gap-1 bg-white/[0.08] px-1.5 py-0.5 rounded-full border border-white/[0.06]">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-red-500 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[9px] font-mono text-red-400">580</span>
                  </div>

                  {/* Watch Status Time */}
                  <div className="font-mono text-xs text-orange-400 font-bold tracking-tight">
                    {statusTime || '10:09'}
                  </div>

                  {/* Battery Pill */}
                  <div className="flex items-center gap-0.5 text-emerald-400">
                    <span className="text-[9px] font-mono font-bold">100%</span>
                  </div>
                </div>

                {/* Center Content / Metric / Workout Hero */}
                <div className="flex flex-col items-center justify-center my-auto text-center space-y-1">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-950/60 text-lg">
                    ⚡
                  </div>
                  <div className="font-bold text-xs tracking-tight text-white">即時連動監測</div>
                  <div className="text-[10px] text-neutral-400 font-medium">watchOS 11 支援</div>
                </div>

                {/* Bottom Stats Pill */}
                <div className="flex items-center justify-between bg-white/[0.06] border border-white/[0.08] rounded-xl px-2.5 py-1 text-[10px]">
                  <div className="flex items-center gap-1 text-red-400 font-semibold">
                    <span>❤️</span>
                    <span className="font-mono">72 BPM</span>
                  </div>
                  <div className="text-emerald-400 font-mono font-semibold">● LIVE</div>
                </div>
              </div>
            )}

            {/* Curved Glass Reflection Sheen */}
            {glareEffect && (
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] pointer-events-none z-10" />
            )}
          </div>
        </div>

        {/* Bottom Band */}
        {renderWatchBand('bottom')}
      </div>
    </div>
  );
};
