import React from 'react';
import { SlideItem, LayoutTemplate } from '../types';
import { DeviceMockupFrame } from './DeviceMockupFrame';
import { WatchMockupFrame } from './WatchMockupFrame';

interface ScreenshotRendererProps {
  slide: SlideItem;
  zoom?: number; // scale multiplier for preview UI (e.g. 0.45 to 1.0)
  showSafeZones?: boolean;
  onUpdateText?: (field: 'headlineText' | 'subtitleText' | 'badgeText', value: string) => void;
  className?: string;
  isTabletView?: boolean;
}

export const ScreenshotRenderer: React.FC<ScreenshotRendererProps> = ({
  slide,
  zoom = 0.42,
  showSafeZones = false,
  onUpdateText,
  className = '',
  isTabletView = false,
}) => {
  const { bgConfig, textConfig, deviceConfig, layout } = slide;

  // Base canvas dimension for 1290 x 2796 (or 2048 x 2732 for iPad / 820 x 1004 for Watch)
  const isWatchSpec = layout === 'watch-focus' && (deviceConfig.deviceType?.startsWith('apple-watch') || isTabletView);
  const canvasWidth = isTabletView ? 768 : isWatchSpec ? 500 : 500;
  const canvasHeight = isTabletView ? 1024 : isWatchSpec ? 800 : 1083;

  // Compute background style
  const getBackgroundStyle = () => {
    if (bgConfig.type === 'image' && bgConfig.imageUrl) {
      return {
        backgroundColor: '#020617',
      };
    }
    if (bgConfig.type === 'gradient' || bgConfig.type === 'mesh') {
      const angle = bgConfig.angle ?? 160;
      const c1 = bgConfig.color1 || '#02120e';
      const c2 = bgConfig.color2 || '#064e3b';
      const c3 = bgConfig.color3;

      if (c3) {
        return {
          background: `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`,
        };
      }
      return {
        background: `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`,
      };
    }
    if (bgConfig.type === 'solid') {
      return { background: bgConfig.color1 || '#0f172a' };
    }
    return { background: '#020617' };
  };

  const isTextTop = layout !== 'phone-top-text-bottom' && layout !== 'watch-top-text-bottom';
  const isWatchDevice = deviceConfig.deviceType?.startsWith('apple-watch');

  // Alignment classes
  const textAlignClass =
    textConfig.headlineAlign === 'left'
      ? 'text-left items-start'
      : textConfig.headlineAlign === 'right'
      ? 'text-right items-end'
      : 'text-center items-center';

  return (
    <div
      className={`relative shadow-2xl rounded-3xl overflow-hidden select-none border border-neutral-800/80 transition-all ${className}`}
      style={{
        width: `${canvasWidth * zoom}px`,
        height: `${canvasHeight * zoom}px`,
      }}
    >
      {/* Scaled Render Container */}
      <div
        className="origin-top-left absolute top-0 left-0 flex flex-col overflow-hidden"
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `scale(${zoom})`,
          ...getBackgroundStyle(),
        }}
      >
        {/* Custom Uploaded Background Image Layer */}
        {bgConfig.imageUrl && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <img
              src={bgConfig.imageUrl}
              alt="Custom Background"
              className="w-full h-full object-cover transition-all"
              style={{
                filter: `blur(${bgConfig.imageBlur || 0}px)`,
                opacity: (bgConfig.imageOpacity ?? 100) / 100,
                transform: `scale(${bgConfig.imageScale || 1.0})`,
                objectFit: bgConfig.imageFit || 'cover',
              }}
              referrerPolicy="no-referrer"
            />
            {/* Dark Dimmer Overlay on top of background image */}
            {bgConfig.imageDarkOverlay && bgConfig.imageDarkOverlay > 0 && (
              <div
                className="absolute inset-0 bg-black transition-opacity pointer-events-none"
                style={{ opacity: bgConfig.imageDarkOverlay / 100 }}
              />
            )}
          </div>
        )}

        {/* Background Ambient Glow Orbs */}
        {bgConfig.blurOrbs && !bgConfig.imageUrl && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full blur-[90px] opacity-40"
              style={{ background: bgConfig.orbColor1 || '#34d399' }}
            />
            <div
              className="absolute -bottom-24 -right-20 w-[450px] h-[450px] rounded-full blur-[100px] opacity-35"
              style={{ background: bgConfig.orbColor2 || '#10b981' }}
            />
          </div>
        )}

        {/* Subtle Noise Texture Overlay */}
        {bgConfig.noiseOverlay && (
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 0)`,
              backgroundSize: '16px 16px',
            }}
          />
        )}

        {/* Safe Zone Overlay Guides (App Store submission check) */}
        {showSafeZones && (
          <div className="absolute inset-0 pointer-events-none z-50 border-2 border-dashed border-emerald-400/40 m-6 rounded-2xl flex flex-col justify-between p-3 text-[10px] font-mono text-emerald-400">
            <div className="flex justify-between items-center bg-emerald-950/60 backdrop-blur-xs px-2 py-0.5 rounded border border-emerald-500/30">
              <span>▲ App Store Safe Zone Top (8%)</span>
              <span>1290 x 2796</span>
            </div>
            <div className="flex justify-between items-center bg-emerald-950/60 backdrop-blur-xs px-2 py-0.5 rounded border border-emerald-500/30">
              <span>▼ App Store Safe Zone Bottom (6%)</span>
              <span>Pixel-Checked</span>
            </div>
          </div>
        )}

        {/* --- Content Area --- */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-10 box-border">
          {/* Top Section */}
          {isTextTop ? (
            <div className={`w-full flex flex-col ${textAlignClass} pt-6 space-y-3`}>
              {/* Badge */}
              {textConfig.showBadge && textConfig.badgeText && (
                <div
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm tracking-wider uppercase"
                  style={{
                    backgroundColor: textConfig.badgeBgColor || '#10b981',
                    color: textConfig.badgeTextColor || '#022c22',
                  }}
                >
                  <span>{textConfig.badgeText}</span>
                </div>
              )}

              {/* Headline */}
              <h2
                className="leading-[1.18] font-black tracking-tight whitespace-pre-line break-words max-w-full drop-shadow-sm"
                style={{
                  fontFamily: `"${textConfig.fontFamily}", "Noto Sans TC", sans-serif`,
                  fontSize: `${textConfig.headlineSize || 42}px`,
                  color: textConfig.headlineColor || '#ffffff',
                  letterSpacing: `${textConfig.headlineLetterSpacing || -0.5}px`,
                  fontWeight:
                    textConfig.headlineWeight === 'black'
                      ? 900
                      : textConfig.headlineWeight === 'bold'
                      ? 700
                      : 600,
                }}
              >
                {textConfig.headlineText || 'App Headline'}
              </h2>

              {/* Subtitle */}
              {textConfig.showSubtitle && textConfig.subtitleText && (
                <p
                  className="leading-snug max-w-[92%] whitespace-pre-line break-words font-medium"
                  style={{
                    fontFamily: `"${textConfig.fontFamily}", "Noto Sans TC", sans-serif`,
                    fontSize: `${textConfig.subtitleSize || 18}px`,
                    color: textConfig.subtitleColor || '#a7f3d0',
                    opacity: textConfig.subtitleOpacity ?? 0.95,
                  }}
                >
                  {textConfig.subtitleText}
                </p>
              )}

              {/* Star Rating Widget */}
              {textConfig.showRatingStars && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex text-amber-400 text-base tracking-widest">
                    {'★'.repeat(textConfig.ratingValue || 5)}
                  </div>
                  {textConfig.ratingCountText && (
                    <span className="text-xs text-neutral-300 font-medium">
                      {textConfig.ratingCountText}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Inverted: Mockup at Top
            <div className="w-full flex-1 flex items-center justify-center pt-2">
              {isWatchDevice || layout === 'watch-top-text-bottom' ? (
                <WatchMockupFrame
                  deviceConfig={deviceConfig}
                  screenshotUrl={slide.screenshotUrl}
                  size="hero"
                />
              ) : (
                <DeviceMockupFrame
                  deviceConfig={deviceConfig}
                  screenshotUrl={slide.screenshotUrl}
                  isTablet={isTabletView}
                />
              )}
            </div>
          )}

          {/* Bottom Section */}
          {isTextTop ? (
            <div
              className="w-full flex-1 flex items-end justify-center relative pb-0"
              style={{
                transform: `translate(${deviceConfig.offsetX}%, ${deviceConfig.offsetY}%)`,
              }}
            >
              {/* 1. iPhone + Apple Watch Dual Companion Layout */}
              {layout === 'phone-with-watch' ? (
                <div className="relative flex items-end justify-center w-full h-[600px]">
                  {/* Left: iPhone Phone Frame */}
                  <div className="relative z-10 bottom-0 -left-10 rotate-[-4deg] scale-[0.92]">
                    <DeviceMockupFrame
                      deviceConfig={deviceConfig}
                      screenshotUrl={slide.screenshotUrl}
                      isTablet={isTabletView}
                    />
                  </div>
                  {/* Right: Apple Watch Frame Overlapping */}
                  <div className="absolute right-0 bottom-12 z-20 rotate-[6deg] drop-shadow-2xl">
                    <WatchMockupFrame
                      deviceConfig={{
                        ...deviceConfig,
                        deviceType: 'apple-watch-ultra-2',
                        scale: 1.05,
                        watchBandType: deviceConfig.watchBandType || 'ocean-band',
                        watchBandColor: deviceConfig.watchBandColor || '#f97316',
                      }}
                      screenshotUrl={
                        slide.secondaryScreenshotUrl ||
                        deviceConfig.watchScreenshotUrl
                      }
                      size="md"
                      showBand={true}
                    />
                  </div>
                </div>
              ) : layout === 'watch-focus' || isWatchDevice ? (
                // 2. Apple Watch Centered Focus Layout
                <div className="relative flex items-center justify-center w-full h-[520px] pb-4">
                  <WatchMockupFrame
                    deviceConfig={deviceConfig}
                    screenshotUrl={slide.screenshotUrl}
                    size="hero"
                    showBand={true}
                  />
                </div>
              ) : layout === 'dual-devices' ? (
                // 3. Dual overlapping phones
                <div className="relative flex items-end justify-center w-full h-[580px]">
                  <div className="absolute -left-6 bottom-0 rotate-[-8deg] scale-90 opacity-90">
                    <DeviceMockupFrame
                      deviceConfig={{ ...deviceConfig, rotateZ: -8, scale: 0.88 }}
                      screenshotUrl={slide.secondaryScreenshotUrl || slide.screenshotUrl}
                      isTablet={isTabletView}
                    />
                  </div>
                  <div className="relative z-10 bottom-0 rotate-[4deg]">
                    <DeviceMockupFrame
                      deviceConfig={deviceConfig}
                      screenshotUrl={slide.screenshotUrl}
                      isTablet={isTabletView}
                    />
                  </div>
                </div>
              ) : (
                // 4. Standard Single Mockup
                <DeviceMockupFrame
                  deviceConfig={deviceConfig}
                  screenshotUrl={slide.screenshotUrl}
                  isTablet={isTabletView}
                />
              )}
            </div>
          ) : (
            // Inverted: Text at Bottom
            <div className={`w-full flex flex-col ${textAlignClass} pb-8 space-y-3`}>
              {textConfig.showBadge && textConfig.badgeText && (
                <div
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm uppercase"
                  style={{
                    backgroundColor: textConfig.badgeBgColor || '#10b981',
                    color: textConfig.badgeTextColor || '#022c22',
                  }}
                >
                  <span>{textConfig.badgeText}</span>
                </div>
              )}
              <h2
                className="leading-[1.18] font-black tracking-tight whitespace-pre-line break-words max-w-full"
                style={{
                  fontFamily: `"${textConfig.fontFamily}", "Noto Sans TC", sans-serif`,
                  fontSize: `${textConfig.headlineSize || 42}px`,
                  color: textConfig.headlineColor || '#ffffff',
                }}
              >
                {textConfig.headlineText}
              </h2>
              {textConfig.showSubtitle && textConfig.subtitleText && (
                <p
                  className="leading-snug max-w-[92%] whitespace-pre-line font-medium"
                  style={{
                    fontFamily: `"${textConfig.fontFamily}", "Noto Sans TC", sans-serif`,
                    fontSize: `${textConfig.subtitleSize || 18}px`,
                    color: textConfig.subtitleColor || '#a7f3d0',
                  }}
                >
                  {textConfig.subtitleText}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

