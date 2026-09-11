import React, { useState } from 'react';
import {
  X,
  Download,
  CheckCircle2,
  AlertCircle,
  Archive,
  Layers,
  FileCheck,
  Smartphone,
  Tablet,
  Watch,
  Sparkles,
  Check,
  FileType,
} from 'lucide-react';
import { SlideItem, AppStoreSpec, ExportFormat, TargetStore } from '../types';
import { APP_STORE_SPECS } from '../data/presets';
import { renderSlideToCanvas, downloadCanvas, batchExportZip } from '../utils/exportEngine';
import { useLanguage } from '../i18n/LanguageContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideItem[];
  activeSlideIndex: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  slides,
  activeSlideIndex,
}) => {
  const { t, language } = useLanguage();

  // Active Store Filter Tab
  const [targetStoreTab, setTargetStoreTab] = useState<TargetStore>('universal');
  // Selected specs
  const [selectedSpecIds, setSelectedSpecIds] = useState<string[]>([
    'iphone-6.7-6.9',
    'ipad-13',
    'apple-watch-ultra',
    'google-play-phone',
    'google-play-feature-graphic',
  ]);
  // Selected Export Format
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter specs by target store
  const filteredSpecs = APP_STORE_SPECS.filter((spec) => {
    if (targetStoreTab === 'app-store') return spec.store === 'app-store';
    if (targetStoreTab === 'google-play') return spec.store === 'google-play';
    return true; // 'universal'
  });

  const toggleSpec = (id: string) => {
    if (selectedSpecIds.includes(id)) {
      if (selectedSpecIds.length === 1) return; // keep at least 1
      setSelectedSpecIds(selectedSpecIds.filter((s) => s !== id));
    } else {
      setSelectedSpecIds([...selectedSpecIds, id]);
    }
  };

  const handleSelectPresets = (preset: 'required' | 'all-phone' | 'all-watch' | 'all-tablet' | 'all') => {
    if (preset === 'required') {
      const requiredIds = APP_STORE_SPECS.filter((s) => s.required).map((s) => s.id);
      setSelectedSpecIds(requiredIds);
    } else if (preset === 'all-phone') {
      const phoneIds = APP_STORE_SPECS.filter((s) => s.category.includes('iPhone') || s.category.includes('Android Phone') || s.category.includes('Android 手機') || s.id.includes('phone')).map((s) => s.id);
      setSelectedSpecIds(phoneIds);
    } else if (preset === 'all-watch') {
      const watchIds = APP_STORE_SPECS.filter((s) => s.category === 'Apple Watch' || s.id.includes('watch')).map((s) => s.id);
      setSelectedSpecIds(watchIds);
    } else if (preset === 'all-tablet') {
      const tabletIds = APP_STORE_SPECS.filter((s) => s.category.includes('iPad') || s.category.includes('Tablet') || s.category.includes('平板') || s.id.includes('tablet')).map((s) => s.id);
      setSelectedSpecIds(tabletIds);
    } else if (preset === 'all') {
      setSelectedSpecIds(APP_STORE_SPECS.map((s) => s.id));
    }
  };

  // Download Single Current Slide
  const handleExportSingle = async (spec: AppStoreSpec) => {
    try {
      setIsExporting(true);
      setProgressStatus(language === 'en' ? `Rendering high-res ${spec.name}...` : `正在高解析度算圖 ${spec.name}...`);
      const currentSlide = slides[activeSlideIndex] || slides[0];
      const canvas = await renderSlideToCanvas(currentSlide, spec, 1.0);
      const ext = exportFormat === 'jpeg' ? 'jpg' : exportFormat;
      const filename = `${spec.store === 'app-store' ? 'AppStore' : 'GooglePlay'}_Screenshot_${activeSlideIndex + 1}_${spec.width}x${spec.height}.${ext}`;
      downloadCanvas(canvas, filename, exportFormat);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Batch Export All Slides as ZIP
  const handleBatchExportZip = async () => {
    try {
      setIsExporting(true);
      setProgress(0);
      const targetSpecs = APP_STORE_SPECS.filter((s) => selectedSpecIds.includes(s.id));

      const zipBlob = await batchExportZip(slides, targetSpecs, exportFormat, (pct: number, status: string) => {
        setProgress(pct);
        setProgressStatus(status);
      });

      // Trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      const storePrefix = targetStoreTab === 'app-store' ? 'AppStore' : targetStoreTab === 'google-play' ? 'GooglePlay' : 'AllStores';
      link.download = `${storePrefix}_Screenshots_Bundle_${slides.length}Slides_${exportFormat.toUpperCase()}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Batch export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-[#0A0A0C]/95 border border-white/[0.08] rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100 backdrop-blur-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#050507]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-md shadow-blue-950/50">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{t.exportModalTitle}</h2>
              <p className="text-xs text-neutral-400">
                {t.exportModalDesc}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs custom-scrollbar">
          {/* Target Store Segmented Bar & Export Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Store Filter */}
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-300 block text-[11px]">{t.targetStore}</label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#13131A] rounded-xl border border-white/[0.06]">
                {[
                  { id: 'universal', label: t.storeUniversal, icon: '✨' },
                  { id: 'app-store', label: 'App Store', icon: '🍎' },
                  { id: 'google-play', label: 'Google Play', icon: '🤖' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTargetStoreTab(tab.id as TargetStore)}
                    className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      targetStoreTab === tab.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Format Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-300 block text-[11px]">{t.exportFormat}</label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#13131A] rounded-xl border border-white/[0.06]">
                {[
                  { id: 'png', label: 'PNG', desc: t.formatPngDesc },
                  { id: 'jpeg', label: 'JPG', desc: t.formatJpgDesc },
                  { id: 'webp', label: 'WebP', desc: t.formatWebpDesc },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setExportFormat(fmt.id as ExportFormat)}
                    className={`py-1.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                      exportFormat === fmt.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span>{fmt.label}</span>
                    <span className="text-[9px] opacity-75 font-normal">{fmt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Selection Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="font-bold text-neutral-200 text-sm">
              {language === 'en' ? `Specs Checklist (${selectedSpecIds.length} selected)` : `規格清單 (已選 ${selectedSpecIds.length} 個規格)`}
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'required', label: t.requiredSpecs },
                { id: 'all-phone', label: t.allPhones },
                { id: 'all-watch', label: 'Apple Watch' },
                { id: 'all-tablet', label: t.allTablets },
                { id: 'all', label: t.selectAllSpecs },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => handleSelectPresets(btn.id as any)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer border border-white/[0.04]"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spec Checklist */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {filteredSpecs.map((spec) => {
              const isSelected = selectedSpecIds.includes(spec.id);
              const isWatch = spec.category === 'Apple Watch' || spec.id.includes('watch');
              const isTablet = spec.category.includes('iPad') || spec.category.includes('Tablet') || spec.category.includes('平板');
              const isBanner = spec.category.includes('Banner') || spec.category.includes('Graphic') || spec.category.includes('圖示');
              return (
                <div
                  key={spec.id}
                  onClick={() => toggleSpec(spec.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-950/30 border-blue-500/80 shadow-md shadow-blue-950/30'
                      : 'bg-[#0F0F14]/70 border-white/[0.06] hover:border-white/[0.18]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border border-white/[0.08] ${
                        isWatch
                          ? 'bg-amber-950/80 text-amber-400'
                          : isTablet
                          ? 'bg-purple-950/80 text-purple-300'
                          : isBanner
                          ? 'bg-emerald-950/80 text-emerald-300'
                          : 'bg-blue-950/80 text-blue-300'
                      }`}
                    >
                      {isWatch ? (
                        <Watch className="w-4 h-4" />
                      ) : isTablet ? (
                        <Tablet className="w-4 h-4" />
                      ) : (
                        <Smartphone className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {spec.name}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border ${
                          spec.store === 'app-store'
                            ? 'bg-blue-950/80 text-blue-400 border-blue-800/40'
                            : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/40'
                        }`}>
                          {spec.store === 'app-store' ? 'iOS' : 'Android'}
                        </span>
                        {spec.required && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/40">
                            {t.requiredBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-400 mt-0.5">
                        {spec.width} × {spec.height} px • {spec.aspectRatio} • {spec.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Individual quick download button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportSingle(spec);
                      }}
                      title={t.quickSingleDownload}
                      disabled={isExporting}
                      className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white transition-colors cursor-pointer border border-white/[0.04]"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSpec(spec.id)}
                      aria-label={`Select ${spec.name}`}
                      className="w-4 h-4 rounded-sm accent-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Store Guidelines Compliance Notice */}
          <div className="p-4 bg-[#050507]/80 rounded-2xl border border-white/[0.06] space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-neutral-200">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.storeComplianceTitle}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-400 text-[11px]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.storeRule1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.storeRule2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.storeRule3}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.storeRule4}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar during export */}
          {isExporting && (
            <div className="p-4 bg-blue-950/30 rounded-2xl border border-blue-800/40 space-y-2">
              <div className="flex justify-between items-center text-blue-300 font-semibold">
                <span>{progressStatus || (language === 'en' ? 'Processing batch...' : '正在批次處理中...')}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#13131A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {downloadSuccess && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/60 rounded-2xl text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t.exportSuccess}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#050507]/90 flex items-center justify-between gap-4">
          <div className="text-xs text-neutral-400">
            {language === 'en' ? (
              <>
                Total <span className="text-white font-bold">{slides.length}</span> slides ×{' '}
                <span className="text-white font-bold">{selectedSpecIds.length}</span> specs ={' '}
                <span className="text-blue-400 font-bold">
                  {slides.length * selectedSpecIds.length} files ({exportFormat.toUpperCase()})
                </span>
              </>
            ) : (
              <>
                共 <span className="text-white font-bold">{slides.length}</span> 張截圖 ×{' '}
                <span className="text-white font-bold">{selectedSpecIds.length}</span> 個規格 ={' '}
                <span className="text-blue-400 font-bold">
                  {slides.length * selectedSpecIds.length} 張圖檔 ({exportFormat.toUpperCase()})
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors font-semibold cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleBatchExportZip}
              disabled={isExporting}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-950/50 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Archive className="w-4 h-4" />
              {t.downloadZip}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
