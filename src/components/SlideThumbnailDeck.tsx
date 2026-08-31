import React from 'react';
import { Plus, Copy, Trash2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SlideItem } from '../types';
import { ScreenshotRenderer } from './ScreenshotRenderer';
import { useLanguage } from '../i18n/LanguageContext';

interface SlideThumbnailDeckProps {
  slides: SlideItem[];
  activeSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onMoveSlide: (fromIndex: number, toIndex: number) => void;
}

export const SlideThumbnailDeck: React.FC<SlideThumbnailDeckProps> = ({
  slides,
  activeSlideIndex,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="w-full bg-[#0A0A0C]/90 backdrop-blur-xl border-t border-white/[0.08] px-4 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-neutral-200">
            {language === 'en' ? `Screenshot Deck (${slides.length} slides)` : `截圖套組 (${slides.length} 張)`}
          </span>
          <span className="text-[10px] text-neutral-400 hidden sm:inline">
            • {t.deckHint}
          </span>
        </div>

        {/* Thumbnail Carousel list */}
        <div className="flex items-center gap-3 overflow-x-auto py-1 px-1 custom-scrollbar flex-1 justify-start">
          {slides.map((slide, idx) => {
            const isActive = idx === activeSlideIndex;
            return (
              <div
                key={slide.id}
                onClick={() => onSelectSlide(idx)}
                className={`relative group shrink-0 rounded-2xl p-1.5 transition-all cursor-pointer flex flex-col items-center gap-1.5 border ${
                  isActive
                    ? 'border-blue-500 bg-blue-950/30 ring-2 ring-blue-500/40 shadow-lg shadow-blue-950/50'
                    : 'border-white/[0.08] bg-[#0F0F14]/80 hover:border-white/[0.2] hover:bg-[#14141E]'
                }`}
              >
                {/* Mini Renderer preview */}
                <div className="w-16 h-28 sm:w-20 sm:h-36 rounded-xl overflow-hidden relative shadow-md pointer-events-none flex items-center justify-center bg-[#050507]">
                  <ScreenshotRenderer
                    slide={slide}
                    zoom={0.14}
                    className="border-0 shadow-none"
                  />
                </div>

                {/* Slide label */}
                <div className="flex items-center justify-between w-full px-1">
                  <span
                    className={`text-[10px] font-bold ${
                      isActive ? 'text-blue-300' : 'text-neutral-400'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="text-[9px] text-neutral-400 truncate max-w-[50px]">
                    {slide.name.replace('Slide ', '')}
                  </span>
                </div>

                {/* Hover Quick Action Buttons */}
                <div className="absolute -top-2 -right-1 hidden group-hover:flex items-center gap-0.5 bg-[#050507] border border-white/[0.1] rounded-xl p-0.5 shadow-xl z-20">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveSlide(idx, idx - 1);
                      }}
                      title={t.moveLeft}
                      className="p-1 hover:bg-white/[0.1] text-neutral-400 hover:text-white rounded-lg cursor-pointer"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  )}
                  {idx < slides.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveSlide(idx, idx + 1);
                      }}
                      title={t.moveRight}
                      className="p-1 hover:bg-white/[0.1] text-neutral-400 hover:text-white rounded-lg cursor-pointer"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateSlide(idx);
                    }}
                    title={t.duplicateSlide}
                    className="p-1 hover:bg-white/[0.1] text-neutral-400 hover:text-blue-300 rounded-lg cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {slides.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSlide(idx);
                      }}
                      title={t.deleteSlide}
                      className="p-1 hover:bg-white/[0.1] text-neutral-400 hover:text-red-400 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Slide Button */}
          <button
            type="button"
            onClick={onAddSlide}
            className="w-16 h-28 sm:w-20 sm:h-36 shrink-0 rounded-2xl border-2 border-dashed border-white/[0.12] hover:border-blue-500 bg-white/[0.02] hover:bg-blue-950/20 text-neutral-400 hover:text-blue-300 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-white/[0.06] group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all border border-white/[0.06]">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold">{t.addSlide}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
