import React from 'react';
import {
  Sparkles,
  Download,
  Smartphone,
  Tablet,
  LayoutGrid,
  Grid,
  Shield,
  ZoomIn,
  ZoomOut,
  FolderOpen,
  Globe,
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/presets';
import { AppPreset } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface AppHeaderProps {
  onSelectPreset: (preset: AppPreset) => void;
  isTabletView: boolean;
  onToggleTabletView: () => void;
  isStoryboardMode: boolean;
  onToggleStoryboardMode: () => void;
  showSafeZones: boolean;
  onToggleSafeZones: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  showAIPanel: boolean;
  onToggleAIPanel: () => void;
  onOpenExportModal: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onSelectPreset,
  isTabletView,
  onToggleTabletView,
  isStoryboardMode,
  onToggleStoryboardMode,
  showSafeZones,
  onToggleSafeZones,
  zoom,
  onZoomChange,
  showAIPanel,
  onToggleAIPanel,
  onOpenExportModal,
}) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="h-16 bg-[#0A0A0C]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between gap-4 z-40 select-none shadow-xl">
      {/* Brand & Preset Loader */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-950/60 flex items-center justify-center">
            <div className="w-full h-full bg-[#0A0A0C] rounded-[14px] flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>{t.appTitle}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/40">
                {t.appBadge}
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="hidden lg:flex items-center gap-1.5 pl-4 border-l border-white/[0.08]">
          <span className="text-xs text-neutral-400 font-semibold flex items-center gap-1">
            <FolderOpen className="w-3.5 h-3.5 text-neutral-500" />
            {t.presetLabel}
          </span>
          <select
            onChange={(e) => {
              const p = SAMPLE_PRESETS.find((preset) => preset.id === e.target.value);
              if (p) onSelectPreset(p);
            }}
            aria-label="選擇範本套版"
            className="bg-[#121217] border border-white/[0.1] text-xs rounded-xl px-3 py-1.5 text-neutral-200 focus:outline-hidden focus:border-blue-500 hover:border-white/[0.2] transition-colors cursor-pointer"
          >
            {SAMPLE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Middle Controls (Device Mode / Storyboard / Safe Zones / Zoom) */}
      <div className="hidden md:flex items-center gap-1.5 bg-[#121217]/90 p-1 rounded-2xl border border-white/[0.08] text-xs shadow-inner">
        {/* iPhone vs iPad View toggle */}
        <button
          onClick={onToggleTabletView}
          className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            !isTabletView
              ? 'bg-white/[0.12] text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          {t.iphoneView}
        </button>
        <button
          onClick={onToggleTabletView}
          className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            isTabletView
              ? 'bg-white/[0.12] text-white shadow-xs'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          {t.ipadView}
        </button>

        <div className="w-px h-4 bg-white/[0.08] mx-1" />

        {/* Storyboard Carousel Mode Toggle */}
        <button
          onClick={onToggleStoryboardMode}
          title={t.storyboardView}
          className={`px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            isStoryboardMode
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          {t.storyboardView}
        </button>

        {/* Safe Zones Toggle */}
        <button
          onClick={onToggleSafeZones}
          title={t.safeZones}
          className={`px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            showSafeZones
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          {t.safeZones}
        </button>

        <div className="w-px h-4 bg-white/[0.08] mx-1" />

        {/* Zoom controls */}
        <button
          onClick={() => onZoomChange(Math.max(0.25, zoom - 0.05))}
          title={t.zoomOut}
          className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-mono text-neutral-400 px-1">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(0.85, zoom + 0.05))}
          title={t.zoomIn}
          className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Actions (Language Switcher + AI Assistant + Export) */}
      <div className="flex items-center gap-2">
        {/* Bilingual Language Switcher Toggle */}
        <div className="bg-[#121217] border border-white/[0.1] rounded-xl p-0.5 flex items-center shadow-xs">
          <button
            type="button"
            onClick={() => setLanguage('zh-TW')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              language === 'zh-TW'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="繁體中文"
          >
            繁中
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="English"
          >
            EN
          </button>
        </div>

        <button
          onClick={onToggleAIPanel}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
            showAIPanel
              ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-950/60'
              : 'bg-[#121217] hover:bg-[#181820] border-white/[0.1] text-neutral-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-300" />
          <span className="hidden sm:inline">{t.aiAssistantBtn}</span>
        </button>

        <button
          onClick={onOpenExportModal}
          className="px-3.5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-500 hover:via-indigo-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-950/60 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{t.exportBtn}</span>
        </button>
      </div>
    </header>
  );
};
