import JSZip from 'jszip';
import { SlideItem, AppStoreSpec, ExportFormat } from '../types';

/**
 * Draws a slide accurately onto an HTML5 Canvas at exact pixel dimensions.
 */
export async function renderSlideToCanvas(
  slide: SlideItem,
  spec: AppStoreSpec,
  scaleFactor: number = 1
): Promise<HTMLCanvasElement> {
  const targetWidth = Math.round(spec.width * scaleFactor);
  const targetHeight = Math.round(spec.height * scaleFactor);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Enable high quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const { bgConfig, textConfig, deviceConfig, layout } = slide;

  // 1. Draw Background
  if (bgConfig.imageUrl) {
    // Custom Background Image
    try {
      const bgImg = await loadImage(bgConfig.imageUrl);
      ctx.save();

      // Apply blur filter if requested
      if (bgConfig.imageBlur && bgConfig.imageBlur > 0) {
        const blurPx = Math.round(bgConfig.imageBlur * (targetWidth / 1200));
        ctx.filter = `blur(${blurPx}px)`;
      }

      // Calculate cover dimensions with scale
      const imgScale = (bgConfig.imageScale || 1.0) * 1.05; // slightly overflow to prevent blur edge artifacts
      const imgRatio = bgImg.width / bgImg.height;
      const targetRatio = targetWidth / targetHeight;

      let drawW = targetWidth * imgScale;
      let drawH = targetHeight * imgScale;

      if (imgRatio > targetRatio) {
        drawH = targetHeight * imgScale;
        drawW = drawH * imgRatio;
      } else {
        drawW = targetWidth * imgScale;
        drawH = drawW / imgRatio;
      }

      const drawX = (targetWidth - drawW) / 2;
      const drawY = (targetHeight - drawH) / 2;

      ctx.globalAlpha = (bgConfig.imageOpacity ?? 100) / 100;
      ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
      ctx.restore();

      // Draw dark overlay to ensure text contrast
      const darkOverlayPct = bgConfig.imageDarkOverlay ?? 25;
      if (darkOverlayPct > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${darkOverlayPct / 100})`;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.restore();
      }
    } catch (err) {
      console.error('Error drawing background image, falling back to solid:', err);
      ctx.fillStyle = bgConfig.color1 || '#0f172a';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }
  } else if (bgConfig.type === 'gradient' || bgConfig.type === 'mesh') {
    const rad = ((bgConfig.angle || 160) * Math.PI) / 180;
    const x1 = targetWidth / 2 - (Math.cos(rad) * targetWidth) / 2;
    const y1 = targetHeight / 2 - (Math.sin(rad) * targetHeight) / 2;
    const x2 = targetWidth / 2 + (Math.cos(rad) * targetWidth) / 2;
    const y2 = targetHeight / 2 + (Math.sin(rad) * targetHeight) / 2;

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, bgConfig.color1 || '#02120e');
    if (bgConfig.color2) grad.addColorStop(0.5, bgConfig.color2);
    if (bgConfig.color3) grad.addColorStop(1, bgConfig.color3);
    else grad.addColorStop(1, bgConfig.color2 || '#064e3b');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Draw glowing ambient orbs if enabled
    if (bgConfig.blurOrbs) {
      ctx.save();
      const orbGrad1 = ctx.createRadialGradient(
        targetWidth * 0.25,
        targetHeight * 0.2,
        10,
        targetWidth * 0.25,
        targetHeight * 0.2,
        targetWidth * 0.6
      );
      orbGrad1.addColorStop(0, (bgConfig.orbColor1 || '#34d399') + '55');
      orbGrad1.addColorStop(1, '#00000000');
      ctx.fillStyle = orbGrad1;
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      const orbGrad2 = ctx.createRadialGradient(
        targetWidth * 0.8,
        targetHeight * 0.75,
        10,
        targetWidth * 0.8,
        targetHeight * 0.75,
        targetWidth * 0.7
      );
      orbGrad2.addColorStop(0, (bgConfig.orbColor2 || '#10b981') + '44');
      orbGrad2.addColorStop(1, '#00000000');
      ctx.fillStyle = orbGrad2;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.restore();
    }
  } else {
    ctx.fillStyle = bgConfig.color1 || '#0f172a';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  // Handle Feature Graphic special landscape layout (1024 x 500)
  const isFeatureGraphic = spec.category === 'Store Graphic' && targetWidth === 1024 && targetHeight === 500;
  const isAppIcon = spec.category === 'Store Graphic' && targetWidth === 512 && targetHeight === 512;

  if (isAppIcon) {
    // Render high res App Icon
    ctx.save();
    const iconPadding = 48;
    const iconSize = targetWidth - iconPadding * 2;
    const iconRadius = 110;
    
    // Icon background / shadow
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;
    
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(iconPadding, iconPadding, iconSize, iconSize, iconRadius);
    ctx.fill();
    ctx.restore();

    if (slide.screenshotUrl) {
      try {
        const iconImg = await loadImage(slide.screenshotUrl);
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(iconPadding, iconPadding, iconSize, iconSize, iconRadius);
        ctx.clip();
        ctx.drawImage(iconImg, iconPadding, iconPadding, iconSize, iconSize);
        ctx.restore();
      } catch (e) {
        console.error(e);
      }
    }
    return canvas;
  }

  const isLandscapeBanner = isFeatureGraphic || targetWidth > targetHeight;
  const fontMultiplier = targetWidth / 1290;

  if (isLandscapeBanner) {
    // Landscape Feature Graphic Layout: Headline Left, Angled Phone Right
    const bannerFontScale = targetHeight / 500;
    const leftColWidth = targetWidth * 0.58;
    let bannerY = targetHeight * 0.22;

    // Badge
    if (textConfig.showBadge && textConfig.badgeText) {
      ctx.save();
      const badgeFontSize = Math.round(18 * bannerFontScale);
      ctx.font = `bold ${badgeFontSize}px "${textConfig.fontFamily}", sans-serif`;
      const textMetrics = ctx.measureText(textConfig.badgeText);
      const badgePadX = 16 * bannerFontScale;
      const badgePadY = 8 * bannerFontScale;
      const badgeW = textMetrics.width + badgePadX * 2;
      const badgeH = badgeFontSize + badgePadY * 2;
      const badgeX = targetWidth * 0.08;

      ctx.fillStyle = textConfig.badgeBgColor || '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(badgeX, bannerY, badgeW, badgeH, badgeH / 2);
      ctx.fill();

      ctx.fillStyle = textConfig.badgeTextColor || '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textConfig.badgeText, badgeX + badgeW / 2, bannerY + badgeH / 2);
      ctx.restore();

      bannerY += badgeH + 16 * bannerFontScale;
    }

    // Headline
    ctx.save();
    const hlFontSize = Math.round((textConfig.headlineSize || 36) * 1.3 * bannerFontScale);
    ctx.font = `bold ${hlFontSize}px "${textConfig.fontFamily}", "Noto Sans TC", sans-serif`;
    ctx.fillStyle = textConfig.headlineColor || '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const hlLines = (textConfig.headlineText || 'App Title').split('\n');
    for (const l of hlLines) {
      ctx.fillText(l, targetWidth * 0.08, bannerY);
      bannerY += hlFontSize * 1.25;
    }
    ctx.restore();

    // Subtitle
    if (textConfig.showSubtitle && textConfig.subtitleText) {
      bannerY += 8 * bannerFontScale;
      ctx.save();
      const subFontSize = Math.round((textConfig.subtitleSize || 16) * 1.2 * bannerFontScale);
      ctx.font = `500 ${subFontSize}px "${textConfig.fontFamily}", "Noto Sans TC", sans-serif`;
      ctx.fillStyle = textConfig.subtitleColor || '#94a3b8';
      ctx.globalAlpha = textConfig.subtitleOpacity ?? 0.9;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      const sLines = textConfig.subtitleText.split('\n');
      for (const sl of sLines) {
        ctx.fillText(sl, targetWidth * 0.08, bannerY);
        bannerY += subFontSize * 1.35;
      }
      ctx.restore();
    }

    // Right phone mockup
    if (slide.screenshotUrl) {
      try {
        const img = await loadImage(slide.screenshotUrl);
        const pHeight = targetHeight * 0.92;
        const pWidth = pHeight * (9 / 19.5);
        const pX = targetWidth * 0.68;
        const pY = targetHeight * 0.08;

        ctx.save();
        ctx.translate(pX + pWidth / 2, pY + pHeight / 2);
        ctx.rotate((-4 * Math.PI) / 180);
        ctx.translate(-(pX + pWidth / 2), -(pY + pHeight / 2));

        // Shadow
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 35;
        ctx.shadowOffsetY = 15;
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(pX, pY, pWidth, pHeight, 28);
        ctx.fill();

        // Clip & Draw image
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(pX + 5, pY + 5, pWidth - 10, pHeight - 10, 24);
        ctx.clip();
        ctx.drawImage(img, pX + 5, pY + 5, pWidth - 10, pHeight - 10);
        ctx.restore();

        ctx.restore();
      } catch (err) {
        console.error(err);
      }
    }

    return canvas;
  }

  // Standard Portrait Store Screenshot Layout
  const isTextTop = layout !== 'phone-top-text-bottom';
  const textSectionTop = isTextTop ? targetHeight * 0.07 : targetHeight * 0.72;

  // 3. Draw Badge if enabled
  let currentY = textSectionTop;

  if (textConfig.showBadge && textConfig.badgeText) {
    ctx.save();
    const badgeFontSize = Math.round(28 * fontMultiplier);
    ctx.font = `bold ${badgeFontSize}px "${textConfig.fontFamily}", sans-serif`;
    const textMetrics = ctx.measureText(textConfig.badgeText);
    const badgePaddingX = 24 * fontMultiplier;
    const badgePaddingY = 12 * fontMultiplier;
    const badgeWidth = textMetrics.width + badgePaddingX * 2;
    const badgeHeight = badgeFontSize + badgePaddingY * 2;

    let badgeX = (targetWidth - badgeWidth) / 2;
    if (textConfig.headlineAlign === 'left') badgeX = targetWidth * 0.08;
    if (textConfig.headlineAlign === 'right') badgeX = targetWidth * 0.92 - badgeWidth;

    // Badge capsule background
    ctx.fillStyle = textConfig.badgeBgColor || '#10b981';
    ctx.beginPath();
    ctx.roundRect(badgeX, currentY, badgeWidth, badgeHeight, badgeHeight / 2);
    ctx.fill();

    // Badge text
    ctx.fillStyle = textConfig.badgeTextColor || '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(textConfig.badgeText, badgeX + badgeWidth / 2, currentY + badgeHeight / 2);
    ctx.restore();

    currentY += badgeHeight + 28 * fontMultiplier;
  }

  // 4. Draw Headline
  ctx.save();
  const headlineFontSize = Math.round((textConfig.headlineSize || 42) * 2.2 * fontMultiplier);
  const headlineWeight =
    textConfig.headlineWeight === 'black' ? '900' : textConfig.headlineWeight === 'bold' ? 'bold' : '600';
  ctx.font = `${headlineWeight} ${headlineFontSize}px "${textConfig.fontFamily}", "Noto Sans TC", sans-serif`;
  ctx.fillStyle = textConfig.headlineColor || '#ffffff';
  ctx.textAlign = textConfig.headlineAlign;
  ctx.textBaseline = 'top';

  let headlineX = targetWidth / 2;
  if (textConfig.headlineAlign === 'left') headlineX = targetWidth * 0.08;
  if (textConfig.headlineAlign === 'right') headlineX = targetWidth * 0.92;

  const headlineLines = (textConfig.headlineText || 'App Headline').split('\n');
  const lineHeight = headlineFontSize * 1.22;

  for (const line of headlineLines) {
    ctx.fillText(line, headlineX, currentY);
    currentY += lineHeight;
  }
  ctx.restore();

  // 5. Draw Subtitle
  if (textConfig.showSubtitle && textConfig.subtitleText) {
    currentY += 12 * fontMultiplier;
    ctx.save();
    const subtitleFontSize = Math.round((textConfig.subtitleSize || 18) * 2.0 * fontMultiplier);
    ctx.font = `500 ${subtitleFontSize}px "${textConfig.fontFamily}", "Noto Sans TC", sans-serif`;
    ctx.fillStyle = textConfig.subtitleColor || '#94a3b8';
    ctx.globalAlpha = textConfig.subtitleOpacity ?? 0.9;
    ctx.textAlign = textConfig.headlineAlign;
    ctx.textBaseline = 'top';

    let subX = targetWidth / 2;
    if (textConfig.headlineAlign === 'left') subX = targetWidth * 0.08;
    if (textConfig.headlineAlign === 'right') subX = targetWidth * 0.92;

    const subLines = textConfig.subtitleText.split('\n');
    for (const subLine of subLines) {
      ctx.fillText(subLine, subX, currentY);
      currentY += subtitleFontSize * 1.35;
    }
    ctx.restore();
  }

  // 6. Draw Star Rating if enabled
  if (textConfig.showRatingStars) {
    currentY += 14 * fontMultiplier;
    ctx.save();
    const starFontSize = Math.round(28 * fontMultiplier);
    const starText = '★★★★★';
    ctx.font = `bold ${starFontSize}px sans-serif`;
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = textConfig.headlineAlign;
    ctx.textBaseline = 'top';

    let starX = targetWidth / 2;
    if (textConfig.headlineAlign === 'left') starX = targetWidth * 0.08;
    if (textConfig.headlineAlign === 'right') starX = targetWidth * 0.92;

    ctx.fillText(starText, starX, currentY);

    if (textConfig.ratingCountText) {
      ctx.font = `500 ${Math.round(22 * fontMultiplier)}px "${textConfig.fontFamily}", sans-serif`;
      ctx.fillStyle = '#cbd5e1';
      const starsWidth = ctx.measureText(starText).width;
      if (textConfig.headlineAlign === 'center') {
        ctx.fillText(` ${textConfig.ratingCountText}`, starX + starsWidth / 2 + 10, currentY + 3);
      }
    }
    ctx.restore();
  }

  // 7. Load and Render Screenshot inside realistic Mockup frame
  if (slide.screenshotUrl) {
    try {
      const img = await loadImage(slide.screenshotUrl);
      const isWatchDevice = deviceConfig.deviceType.startsWith('apple-watch');

      if (layout === 'watch-focus' || isWatchDevice) {
        // Render Apple Watch Centered Focus
        await drawWatchOnCanvas(ctx, img, {
          targetWidth,
          targetHeight,
          fontMultiplier,
          deviceConfig,
          isTextTop,
          scale: (deviceConfig.scale || 1.0) * 1.15,
          offsetX: deviceConfig.offsetX,
          offsetY: deviceConfig.offsetY,
          rotateZ: deviceConfig.rotateZ || 0,
        });
      } else if (layout === 'phone-with-watch') {
        // Dual Device: iPhone shifted left + Apple Watch on bottom right
        // 1. Draw Phone slightly to the left
        const phoneScale = (deviceConfig.scale || 1.0) * 0.92;
        await drawPhoneOnCanvas(ctx, img, {
          targetWidth,
          targetHeight,
          fontMultiplier,
          deviceConfig,
          isTextTop,
          scale: phoneScale,
          offsetX: (deviceConfig.offsetX || 0) - 14,
          offsetY: (deviceConfig.offsetY || 0) + 2,
          rotateZ: -3,
          spec,
        });

        // 2. Draw Watch on bottom right overlapping
        const watchImg = slide.secondaryScreenshotUrl
          ? await loadImage(slide.secondaryScreenshotUrl)
          : img;

        await drawWatchOnCanvas(ctx, watchImg, {
          targetWidth,
          targetHeight,
          fontMultiplier,
          deviceConfig: {
            ...deviceConfig,
            deviceType: 'apple-watch-ultra-2',
            deviceColor: 'natural-titanium',
            watchBandType: deviceConfig.watchBandType || 'ocean-band',
            watchBandColor: deviceConfig.watchBandColor || '#f97316',
          },
          isTextTop,
          scale: phoneScale * 0.65,
          offsetX: 30,
          offsetY: 28,
          rotateZ: 6,
        });
      } else {
        // Standard Phone / Tablet / Android
        await drawPhoneOnCanvas(ctx, img, {
          targetWidth,
          targetHeight,
          fontMultiplier,
          deviceConfig,
          isTextTop,
          scale: deviceConfig.scale || 1.0,
          offsetX: deviceConfig.offsetX || 0,
          offsetY: deviceConfig.offsetY || 0,
          rotateZ: layout === 'tilted-3d-left' ? -6 : layout === 'tilted-3d-right' ? 6 : deviceConfig.rotateZ || 0,
          spec,
        });
      }
    } catch (err) {
      console.error('Error drawing screenshot on canvas:', err);
    }
  }

  return canvas;
}

interface DrawPhoneOptions {
  targetWidth: number;
  targetHeight: number;
  fontMultiplier: number;
  deviceConfig: any;
  isTextTop: boolean;
  scale: number;
  offsetX: number;
  offsetY: number;
  rotateZ: number;
  spec: AppStoreSpec;
}

async function drawPhoneOnCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  options: DrawPhoneOptions
) {
  const { targetWidth, targetHeight, fontMultiplier, deviceConfig, isTextTop, scale, offsetX, offsetY, rotateZ, spec } = options;

  const isTablet = spec.category === 'iPad' || spec.category === 'Android Tablet';
  const deviceType = deviceConfig.deviceType || 'iphone-16-pro-max';
  const isGalaxyUltra = deviceType === 'samsung-s25-ultra';
  const isHomeButton = deviceType === 'iphone-8-plus';
  const isNotch = deviceType === 'iphone-13';
  const isAndroid =
    spec.store === 'google-play' ||
    deviceType.startsWith('samsung') ||
    deviceType.startsWith('google') ||
    deviceType.startsWith('oneplus') ||
    deviceType.startsWith('android');

  const frameWidth = isTablet
    ? targetWidth * 0.82 * scale
    : targetWidth * 0.78 * scale;

  const frameRatio = isTablet ? 1.33 : isGalaxyUltra ? 2.16 : isHomeButton ? 1.77 : 2.16;
  const frameHeight = frameWidth * frameRatio;

  const deviceCenterX = targetWidth / 2 + (offsetX / 100) * targetWidth;
  const deviceBaseY = isTextTop
    ? targetHeight * 0.35 + (offsetY / 100) * targetHeight
    : targetHeight * 0.08 + (offsetY / 100) * targetHeight;

  const frameX = deviceCenterX - frameWidth / 2;
  const frameY = deviceBaseY;

  ctx.save();

  if (rotateZ !== 0) {
    ctx.translate(deviceCenterX, frameY + frameHeight / 2);
    ctx.rotate((rotateZ * Math.PI) / 180);
    ctx.translate(-deviceCenterX, -(frameY + frameHeight / 2));
  }

  // Draw Phone Outer Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = Math.round(50 * fontMultiplier * ((deviceConfig.shadowIntensity || 80) / 80));
  ctx.shadowOffsetY = Math.round(30 * fontMultiplier);
  ctx.fillStyle = '#0f172a';

  let cornerRadius = isGalaxyUltra
    ? 18 * fontMultiplier
    : isTablet
    ? 36 * fontMultiplier
    : isHomeButton
    ? 42 * fontMultiplier
    : 54 * fontMultiplier;

  ctx.beginPath();
  ctx.roundRect(frameX, frameY, frameWidth, frameHeight, cornerRadius);
  ctx.fill();
  ctx.restore();

  // Draw Metallic Bezel
  const bezelColor = getDeviceBezelColor(deviceConfig.deviceColor);
  ctx.save();
  ctx.lineWidth = Math.max(6, Math.round((deviceConfig.borderWidth || 8) * fontMultiplier));
  ctx.strokeStyle = bezelColor.border;
  ctx.beginPath();
  ctx.roundRect(frameX, frameY, frameWidth, frameHeight, cornerRadius);
  ctx.stroke();
  ctx.restore();

  // Clip inner screen area
  let innerMargin = Math.round(8 * fontMultiplier);
  let topPadding = innerMargin;
  let bottomPadding = innerMargin;

  if (isHomeButton) {
    topPadding = Math.round(58 * fontMultiplier);
    bottomPadding = Math.round(62 * fontMultiplier);
  }

  const screenX = frameX + innerMargin;
  const screenY = frameY + topPadding;
  const screenW = frameWidth - innerMargin * 2;
  const screenH = frameHeight - topPadding - bottomPadding;
  const innerRadius = Math.max(4, cornerRadius - innerMargin);

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(screenX, screenY, screenW, screenH, innerRadius);
  ctx.clip();

  // Draw user screenshot
  ctx.drawImage(img, screenX, screenY, screenW, screenH);

  // Dynamic Island / Punch Hole / Notch
  if (!isTablet && !isHomeButton) {
    if (isAndroid || isGalaxyUltra) {
      const holeSize = 14 * fontMultiplier;
      const holeX = screenX + screenW / 2;
      const holeY = screenY + 18 * fontMultiplier;

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(holeX, holeY, holeSize / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(holeX, holeY, holeSize * 0.28, 0, Math.PI * 2);
      ctx.fill();
    } else if (isNotch) {
      const notchW = screenW * 0.44;
      const notchH = 30 * fontMultiplier;
      const notchX = screenX + (screenW - notchW) / 2;
      const notchY = screenY;

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(notchX, notchY, notchW, notchH, [0, 0, 16 * fontMultiplier, 16 * fontMultiplier]);
      ctx.fill();
    } else if (deviceConfig.showDynamicIsland) {
      const islandW = screenW * 0.28;
      const islandH = 32 * fontMultiplier;
      const islandX = screenX + (screenW - islandW) / 2;
      const islandY = screenY + 14 * fontMultiplier;

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(islandX, islandY, islandW, islandH, islandH / 2);
      ctx.fill();

      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(islandX + islandW * 0.78, islandY + islandH / 2, islandH * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw Status Bar text if enabled
  if (deviceConfig.showStatusBar && !isHomeButton) {
    ctx.font = `bold ${Math.round(20 * fontMultiplier)}px -apple-system, Roboto, sans-serif`;
    ctx.fillStyle = deviceConfig.statusBarTheme === 'dark' ? '#0f172a' : '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      deviceConfig.statusTime || (isAndroid ? '10:00' : '9:41'),
      screenX + 32 * fontMultiplier,
      screenY + 26 * fontMultiplier
    );
  }

  // Screen Glass Sheen Glare
  if (deviceConfig.glareEffect) {
    const glareGrad = ctx.createLinearGradient(screenX, screenY, screenX + screenW, screenY + screenH * 0.4);
    glareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    glareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
    glareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glareGrad;
    ctx.fillRect(screenX, screenY, screenW, screenH * 0.6);
  }

  ctx.restore(); // end screen clip

  // If Home Button model, draw Touch ID ring at bottom
  if (isHomeButton) {
    ctx.save();
    const btnRadius = 24 * fontMultiplier;
    const btnX = frameX + frameWidth / 2;
    const btnY = frameY + frameHeight - bottomPadding / 2;

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3 * fontMultiplier;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(btnX, btnY, btnRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore(); // end 3D rotation
}

interface DrawWatchOptions {
  targetWidth: number;
  targetHeight: number;
  fontMultiplier: number;
  deviceConfig: any;
  isTextTop: boolean;
  scale: number;
  offsetX: number;
  offsetY: number;
  rotateZ: number;
}

async function drawWatchOnCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  options: DrawWatchOptions
) {
  const { targetWidth, targetHeight, fontMultiplier, deviceConfig, isTextTop, scale, offsetX, offsetY, rotateZ } = options;

  const isUltra = deviceConfig.deviceType === 'apple-watch-ultra-2';
  const watchWidth = targetWidth * 0.54 * scale;
  const watchHeight = watchWidth * (isUltra ? 1.22 : 1.24);

  const centerX = targetWidth / 2 + (offsetX / 100) * targetWidth;
  const baseY = isTextTop
    ? targetHeight * 0.42 + (offsetY / 100) * targetHeight
    : targetHeight * 0.16 + (offsetY / 100) * targetHeight;

  const x = centerX - watchWidth / 2;
  const y = baseY;

  ctx.save();

  if (rotateZ !== 0) {
    ctx.translate(centerX, y + watchHeight / 2);
    ctx.rotate((rotateZ * Math.PI) / 180);
    ctx.translate(-centerX, -(y + watchHeight / 2));
  }

  // 1. Draw Watch Straps (top & bottom)
  const bandType = deviceConfig.watchBandType || 'ocean-band';
  const bandColor = deviceConfig.watchBandColor || '#f97316';

  if (bandType !== 'none') {
    const bandW = watchWidth * 0.64;
    const bandX = centerX - bandW / 2;
    const strapLength = watchHeight * 0.38;

    // Top Strap
    ctx.save();
    ctx.fillStyle = bandColor;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 20 * fontMultiplier;
    ctx.beginPath();
    ctx.roundRect(bandX, y - strapLength + 15, bandW, strapLength, [18 * fontMultiplier, 18 * fontMultiplier, 0, 0]);
    ctx.fill();

    // Ocean band ridges or texture
    if (bandType === 'ocean-band') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let ridgeY = y - strapLength + 25; ridgeY < y; ridgeY += 22 * fontMultiplier) {
        ctx.beginPath();
        ctx.roundRect(bandX + 8, ridgeY, bandW - 16, 8 * fontMultiplier, 4);
        ctx.fill();
      }
    }
    ctx.restore();

    // Bottom Strap
    ctx.save();
    ctx.fillStyle = bandColor;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 20 * fontMultiplier;
    ctx.beginPath();
    ctx.roundRect(bandX, y + watchHeight - 15, bandW, strapLength, [0, 0, 18 * fontMultiplier, 18 * fontMultiplier]);
    ctx.fill();

    if (bandType === 'ocean-band') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let ridgeY = y + watchHeight + 5; ridgeY < y + watchHeight + strapLength - 15; ridgeY += 22 * fontMultiplier) {
        ctx.beginPath();
        ctx.roundRect(bandX + 8, ridgeY, bandW - 16, 8 * fontMultiplier, 4);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // 2. Watch Outer Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = Math.round(45 * fontMultiplier * ((deviceConfig.shadowIntensity || 80) / 80));
  ctx.shadowOffsetY = Math.round(24 * fontMultiplier);

  const cornerRadius = isUltra ? 48 * fontMultiplier : 56 * fontMultiplier;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(x, y, watchWidth, watchHeight, cornerRadius);
  ctx.fill();
  ctx.restore();

  // 3. Digital Crown & Side Button (Right side)
  const crownW = 12 * fontMultiplier;
  const crownH = watchHeight * 0.28;
  const crownX = x + watchWidth - 2;
  const crownY = y + watchHeight * 0.22;

  // Crown
  ctx.save();
  ctx.fillStyle = isUltra ? '#ea580c' : '#71717a';
  ctx.beginPath();
  ctx.roundRect(crownX, crownY, crownW, crownH, [0, 6 * fontMultiplier, 6 * fontMultiplier, 0]);
  ctx.fill();

  // Crown texture grooves
  ctx.fillStyle = '#18181b';
  for (let gy = crownY + 4; gy < crownY + crownH - 4; gy += 6 * fontMultiplier) {
    ctx.fillRect(crownX + 2, gy, crownW - 3, 2 * fontMultiplier);
  }

  // Side Button
  const btnH = watchHeight * 0.24;
  const btnY = y + watchHeight * 0.58;
  ctx.fillStyle = '#3f3f46';
  ctx.beginPath();
  ctx.roundRect(crownX - 1, btnY, crownW * 0.7, btnH, [0, 4 * fontMultiplier, 4 * fontMultiplier, 0]);
  ctx.fill();
  ctx.restore();

  // 4. Watch Casing Bezel
  const bezelColor = getDeviceBezelColor(deviceConfig.deviceColor || (isUltra ? 'natural-titanium' : 'jet-black'));
  ctx.save();
  ctx.lineWidth = Math.max(7, Math.round(10 * fontMultiplier));
  ctx.strokeStyle = bezelColor.border;
  ctx.beginPath();
  ctx.roundRect(x, y, watchWidth, watchHeight, cornerRadius);
  ctx.stroke();
  ctx.restore();

  // 5. Watch Screen Clip & Render
  const screenMargin = Math.round(12 * fontMultiplier);
  const screenX = x + screenMargin;
  const screenY = y + screenMargin;
  const screenW = watchWidth - screenMargin * 2;
  const screenH = watchHeight - screenMargin * 2;
  const screenRadius = Math.max(12, cornerRadius - screenMargin);

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(screenX, screenY, screenW, screenH, screenRadius);
  ctx.clip();

  // Fill black OLED background
  ctx.fillStyle = '#000000';
  ctx.fillRect(screenX, screenY, screenW, screenH);

  // Draw user screenshot
  ctx.drawImage(img, screenX, screenY, screenW, screenH);

  // Watch Screen Glare
  if (deviceConfig.glareEffect) {
    const glareGrad = ctx.createLinearGradient(screenX, screenY, screenX + screenW, screenY + screenH * 0.4);
    glareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
    glareGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.04)');
    glareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glareGrad;
    ctx.fillRect(screenX, screenY, screenW, screenH * 0.5);
  }

  ctx.restore(); // end screen clip
  ctx.restore(); // end rotate
}

function getDeviceBezelColor(color: string) {
  switch (color) {
    case 'desert-titanium':
      return { border: '#c5a880', bg: '#2b241c' };
    case 'natural-titanium':
      return { border: '#9e9992', bg: '#1f1e1d' };
    case 'black-titanium':
      return { border: '#38383a', bg: '#0b0b0c' };
    case 'white-titanium':
      return { border: '#e3e4e5', bg: '#2b2c2e' };
    case 'titanium-gray':
      return { border: '#8e9099', bg: '#1f2022' };
    case 'onyx-black':
      return { border: '#2a2b2e', bg: '#0a0a0b' };
    case 'cobalt-violet':
      return { border: '#6366a6', bg: '#1e1f38' };
    case 'amber-yellow':
      return { border: '#ecd189', bg: '#383018' };
    case 'hazel-green':
      return { border: '#6b8273', bg: '#1c241f' };
    case 'porcelain-white':
      return { border: '#fafafa', bg: '#333333' };
    case 'obsidian-black':
      return { border: '#262626', bg: '#0d0d0d' };
    case 'bay-blue':
      return { border: '#60a5fa', bg: '#172554' };
    case 'midnight-blue':
      return { border: '#2d3748', bg: '#0f172a' };
    case 'gold':
      return { border: '#fbbf24', bg: '#3a2704' };
    case 'rose-gold':
      return { border: '#f472b6', bg: '#3b1227' };
    default:
      return { border: '#71717a', bg: '#18181b' };
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Downloads a single canvas image in chosen format
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  format: ExportFormat = 'png',
  quality: number = 1.0
) {
  const mimeType =
    format === 'jpg' || format === 'jpeg'
      ? 'image/jpeg'
      : format === 'webp'
      ? 'image/webp'
      : 'image/png';
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL(mimeType, quality);
  link.click();
}

/**
 * Batch exports all slides as an organized, store-compliant ZIP bundle
 */
export async function batchExportZip(
  slides: SlideItem[],
  specs: AppStoreSpec[],
  format: ExportFormat = 'png',
  onProgress?: (progress: number, statusText: string) => void,
  quality: number = 1.0
): Promise<Blob> {
  const zip = new JSZip();
  const totalTasks = slides.length * specs.length;
  let completed = 0;

  const mimeType =
    format === 'jpg' || format === 'jpeg'
      ? 'image/jpeg'
      : format === 'webp'
      ? 'image/webp'
      : 'image/png';
  const fileExt =
    format === 'jpg' || format === 'jpeg'
      ? 'jpg'
      : format === 'webp'
      ? 'webp'
      : 'png';

  for (const spec of specs) {
    // Organize into store-specific root folders
    let storeFolder = '01_Apple_AppStore';
    if (spec.store === 'google-play') {
      storeFolder = '02_Google_PlayStore';
    } else if (spec.category === 'Store Graphic') {
      storeFolder = '03_Store_Assets';
    }

    const cleanSpecName = spec.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_');
    const folderPath = `${storeFolder}/${spec.category}_${spec.width}x${spec.height}_(${cleanSpecName})`;
    const folder = zip.folder(folderPath);

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (onProgress) {
        onProgress(
          Math.round((completed / totalTasks) * 100),
          `產生 ${spec.name} - 第 ${i + 1} 張 (${slide.name})...`
        );
      }

      const canvas = await renderSlideToCanvas(slide, spec);
      const dataUrl = canvas.toDataURL(mimeType, quality);
      const base64Data = dataUrl.split(',')[1];

      const cleanSlideName = (slide.name || `Screen_${i + 1}`).replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_');
      const fileName = `${String(i + 1).padStart(2, '0')}_${cleanSlideName}_${spec.width}x${spec.height}.${fileExt}`;
      folder?.file(fileName, base64Data, { base64: true });

      completed++;
    }
  }

  // Generate Store Submission Guide
  const guideContent = `================================================================================
🚀 APP STORE & GOOGLE PLAY STORE 官方截圖上架指南 (SUBMISSION GUIDE)
================================================================================

本壓縮包已自動依據 Apple App Store Connect 與 Google Play Console 規範將截圖分門別類。

--------------------------------------------------------------------------------
🍎 1. Apple App Store 提交規格說明
--------------------------------------------------------------------------------
1. iPhone 6.9" / 6.7" (1290 x 2796):
   - 必填 (Required)。適用於 iPhone 16 Pro Max, 15 Pro Max, 14 Pro Max。
2. iPhone 6.3" / 6.1" (1179 x 2556):
   - 推薦上傳。適用於 iPhone 16 Pro, 15 Pro, 14 Pro。
3. iPhone 5.5" (1242 x 2208):
   - 適用於舊款 16:9 機型 (iPhone 8 Plus, 7 Plus, SE)。
4. iPad Pro 13" / 12.9" (2048 x 2732):
   - 若您的 App 支援 iPad，則此解析度為必填項目。
5. 顏色空間規範: sRGB 或 Display P3。
6. 檔案格式: 72 dpi, RGB, 平坦化 (Flattened), 無透明度的 PNG 或 高品質 JPEG。

--------------------------------------------------------------------------------
🤖 2. Google Play Store 提交規格說明
--------------------------------------------------------------------------------
1. 手機截圖 (Phone Screenshots):
   - 最少上傳 2 張，最多 8 張。
   - 解析度: 1080 x 2400 (FHD+ 9:20) 或 1440 x 3120 (QHD+ 9:19.5)。
   - 長寬比必須在 16:9 到 9:16 之間。
2. 平板電腦截圖 (7" & 10" Tablets):
   - 7 吋平板: 1200 x 1920 (若支援平板則建議上傳)。
   - 10 吋平板: 1600 x 2560 (推薦且能獲得 Google Play 平板專區推薦)。
3. 主打宣傳圖 (Feature Graphic):
   - 必填 (Required)。尺寸精準要求 1024 x 500 px (JPG 或 24-bit PNG, 無透明度)。
4. 應用程式圖示 (High-Res Icon):
   - 尺寸 512 x 512 px, 32-bit PNG, 最大 1024 KB。

--------------------------------------------------------------------------------
✨ 產生時間: ${new Date().toLocaleString('zh-TW')}
產生工具: App Screenshot Studio
================================================================================
`;

  zip.file('STORE_SUBMISSION_GUIDE.txt', guideContent);

  if (onProgress) onProgress(99, '正在打包 ZIP 壓縮包...');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
}
