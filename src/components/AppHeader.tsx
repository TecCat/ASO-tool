import React, { useState, useRef, useEffect } from 'react';
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
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  RefreshCw,
  FileJson,
  ChevronDown,
  HardDrive,
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
  // Persistent storage & auto-save props
  saveStatus?: 'saved' | 'saving' | 'error' | 'idle';
  lastSavedText?: string;
  onManualSave?: () => void;
  onExportProjectBackup?: () => void;
  onImportProjectBackup?: (file: File) => void;
  onResetProject?: () => void;
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
  saveStatus = 'saved',
  lastSavedText = '',
  onManualSave,
  onExportProjectBackup,
  onImportProjectBackup,
  onResetProject,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const projectMenuRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Close project menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (projectMenuRef.current && !projectMenuRef.current.contains(e.target as Node)) {
        setShowProjectMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportProjectBackup) {
      onImportProjectBackup(file);
      setShowProjectMenu(false);
      e.target.value = '';
    }
  };

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

        {/* Project Storage & Auto-save Status */}
        <div className="flex items-center gap-2 pl-3 border-l border-white/[0.08]">
          {/* Real-time Auto-save status button */}
          <button
            type="button"
            onClick={onManualSave}
            title={language === 'en' ? 'Click to save changes now (automatically synced)' : '點擊手動立即儲存（離開頁面自動保留，不遺失進度）'}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
              saveStatus === 'saving'
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                : saveStatus === 'error'
                ? 'bg-red-950/40 border-red-500/30 text-red-300'
                : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
            }`}
          >
            {saveStatus === 'saving' ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                <span className="hidden sm:inline">{t.saveStatusSaving}</span>
              </>
            ) : saveStatus === 'error' ? (
              <>
                <AlertCircle className="w-3 h-3 text-red-400" />
                <span className="hidden sm:inline">{t.saveStatusError}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">
                  {t.saveStatusSaved} {lastSavedText ? `(${lastSavedText})` : ''}
                </span>
                <span className="sm:hidden text-emerald-400">✓</span>
              </>
            )}
          </button>

          {/* Project Management Dropdown */}
          <div className="relative" ref={projectMenuRef}>
            <button
              type="button"
              onClick={() => setShowProjectMenu((prev) => !prev)}
              className="px-2.5 py-1.5 bg-[#121217] hover:bg-[#1A1A22] border border-white/[0.1] hover:border-white/[0.2] rounded-xl text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title={t.projectMenu}
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">{t.projectMenu}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Dropdown Popover */}
            {showProjectMenu && (
              <div className="absolute left-0 mt-2 w-64 bg-[#0F0F14]/98 border border-white/[0.12] rounded-2xl shadow-2xl backdrop-blur-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2.5 py-2 border-b border-white/[0.06] mb-1">
                  <span className="text-[11px] font-bold text-white block">{t.projectMenu}</span>
                  <span className="text-[10px] text-neutral-400 block">
                    {language === 'en' ? 'Auto-saved locally in browser' : '離開頁面不遺失，可隨時備份還原'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onExportProjectBackup?.();
                    setShowProjectMenu(false);
                  }}
                  className="w-full px-2.5 py-2 hover:bg-blue-600/20 text-left rounded-xl text-xs text-neutral-200 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileJson className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold block leading-tight">{t.backupProjectJson}</span>
                    <span className="text-[9px] text-neutral-400 block">{t.backupProjectJsonDesc}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => importInputRef.current?.click()}
                  className="w-full px-2.5 py-2 hover:bg-emerald-600/20 text-left rounded-xl text-xs text-neutral-200 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold block leading-tight">{t.importProjectJson}</span>
                    <span className="text-[9px] text-neutral-400 block">{t.importProjectJsonDesc}</span>
                  </div>
                </button>

                <div className="h-px bg-white/[0.06] my-1" />

                <button
                  type="button"
                  onClick={() => {
                    onResetProject?.();
                    setShowProjectMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 hover:bg-red-600/20 text-left rounded-xl text-xs text-red-300 hover:text-red-200 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-red-400" />
                  <span>{t.resetProject}</span>
                </button>
              </div>
            )}

            {/* Hidden Input for Project JSON import */}
            <input
              ref={importInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
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
