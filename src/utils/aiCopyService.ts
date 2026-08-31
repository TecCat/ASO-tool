import { AIPitchDeckResponse, AICopyVariation, SlideItem } from '../types';

export type KeyStorageMode = 'session' | 'local' | 'offline';

export interface ApiKeySettings {
  apiKey: string;
  storageMode: KeyStorageMode; // 'session' | 'local' | 'offline'
  hasConfirmedDisclaimer: boolean;
}

const LOCAL_STORAGE_KEY = 'screenshot_studio_gemini_api_key';
const LOCAL_STORAGE_MODE = 'screenshot_studio_key_mode';
const LOCAL_STORAGE_DISCLAIMER = 'screenshot_studio_disclaimer_confirmed';

let inMemoryApiKey = '';
let inMemoryMode: KeyStorageMode = 'offline';
let inMemoryDisclaimer = false;

export function loadApiKeySettings(): ApiKeySettings {
  if (typeof window === 'undefined') {
    return { apiKey: '', storageMode: 'offline', hasConfirmedDisclaimer: false };
  }

  const savedMode = (localStorage.getItem(LOCAL_STORAGE_MODE) as KeyStorageMode) || inMemoryMode;
  const confirmed = localStorage.getItem(LOCAL_STORAGE_DISCLAIMER) === 'true' || inMemoryDisclaimer;

  if (savedMode === 'local') {
    const savedKey = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
    return {
      apiKey: savedKey,
      storageMode: 'local',
      hasConfirmedDisclaimer: confirmed,
    };
  } else if (savedMode === 'session') {
    const sessionKey = sessionStorage.getItem(LOCAL_STORAGE_KEY) || inMemoryApiKey;
    return {
      apiKey: sessionKey,
      storageMode: 'session',
      hasConfirmedDisclaimer: confirmed,
    };
  } else {
    return {
      apiKey: '',
      storageMode: 'offline',
      hasConfirmedDisclaimer: confirmed,
    };
  }
}

export function saveApiKeySettings(key: string, mode: KeyStorageMode, confirmDisclaimer = true): void {
  if (typeof window === 'undefined') return;

  inMemoryApiKey = key.trim();
  inMemoryMode = mode;
  inMemoryDisclaimer = confirmDisclaimer;

  localStorage.setItem(LOCAL_STORAGE_DISCLAIMER, confirmDisclaimer ? 'true' : 'false');
  localStorage.setItem(LOCAL_STORAGE_MODE, mode);

  if (mode === 'local') {
    localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
    sessionStorage.removeItem(LOCAL_STORAGE_KEY);
  } else if (mode === 'session') {
    sessionStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } else {
    // Offline mode: wipe all stored keys
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    sessionStorage.removeItem(LOCAL_STORAGE_KEY);
    inMemoryApiKey = '';
  }
}

export function clearApiKeySettings(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  localStorage.removeItem(LOCAL_STORAGE_MODE);
  sessionStorage.removeItem(LOCAL_STORAGE_KEY);
  inMemoryApiKey = '';
  inMemoryMode = 'offline';
}

export function maskApiKey(key: string): string {
  if (!key) return '';
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

// ----------------------------------------------------
// 🌟 智慧 ASO 離線文案備援引擎 (Smart Heuristic Generator)
// ----------------------------------------------------

interface KeywordExtract {
  mainTopic: string;
  actionVerb: string;
  benefit: string;
  categoryName: string;
}

function extractKeywords(appName: string, appCategory: string, textContext: string, lang: string): KeywordExtract {
  const cleanApp = appName.trim() || (lang === 'en' ? 'App' : '應用');
  const cleanCat = appCategory.trim() || (lang === 'en' ? 'Productivity' : '生產力');
  const cleanCtx = textContext.trim() || cleanApp;

  // Simple category detection
  const lower = (cleanApp + ' ' + cleanCat + ' ' + cleanCtx).toLowerCase();

  if (lower.includes('記帳') || lower.includes('理財') || lower.includes('錢') || lower.includes('budget') || lower.includes('finance') || lower.includes('money') || lower.includes('crypto')) {
    return {
      mainTopic: lang === 'en' ? 'Wealth & Expenses' : '資產與日常收支',
      actionVerb: lang === 'en' ? 'Track' : '掌控',
      benefit: lang === 'en' ? 'Achieve Financial Freedom' : '看清每一筆金流，實現財務自由',
      categoryName: 'Finance',
    };
  }

  if (lower.includes('健身') || lower.includes('運動') || lower.includes('跑步') || lower.includes('健康') || lower.includes('fitness') || lower.includes('workout') || lower.includes('gym') || lower.includes('health') || lower.includes('running')) {
    return {
      mainTopic: lang === 'en' ? 'Workouts & Health' : '科學化健身與心率',
      actionVerb: lang === 'en' ? 'Elevate' : '突破',
      benefit: lang === 'en' ? 'Crush Your Fitness Goals' : '實時數據洞察，見證每一次蛻變',
      categoryName: 'Fitness',
    };
  }

  if (lower.includes('任務') || lower.includes('todo') || lower.includes('時間') || lower.includes('習慣') || lower.includes('筆記') || lower.includes('note') || lower.includes('task') || lower.includes('productivity') || lower.includes('focus')) {
    return {
      mainTopic: lang === 'en' ? 'Focus & Daily Tasks' : '極致專注與高效待辦',
      actionVerb: lang === 'en' ? 'Master' : '掌握',
      benefit: lang === 'en' ? 'Double Your Daily Output' : '告別拖延，讓每一步都精準從容',
      categoryName: 'Productivity',
    };
  }

  if (lower.includes('ai') || lower.includes('智慧') || lower.includes('chat') || lower.includes('gpt') || lower.includes('bot') || lower.includes('對話')) {
    return {
      mainTopic: lang === 'en' ? 'Next-Gen AI Assistant' : '新世代 AI 智慧助手',
      actionVerb: lang === 'en' ? 'Create' : '賦能',
      benefit: lang === 'en' ? 'Instant Answers in Seconds' : '秒級深度推理，解放您的創造力',
      categoryName: 'AI',
    };
  }

  // Default fallback
  return {
    mainTopic: cleanCtx,
    actionVerb: lang === 'en' ? 'Experience' : '探索',
    benefit: lang === 'en' ? 'Built for Peak Performance' : '極致流暢，專為卓越體驗而生',
    categoryName: 'General',
  };
}

export function generateOfflineDeck(
  appName: string,
  appCategory: string,
  appDescription: string,
  slideCount: number,
  language: 'zh-TW' | 'en' | 'ja' = 'zh-TW',
  tone: string = 'apple-minimal'
): AIPitchDeckResponse {
  const kw = extractKeywords(appName, appCategory, appDescription, language);
  const count = Math.max(3, Math.min(10, slideCount));

  if (language === 'en') {
    const templates = [
      {
        badge: '★ 4.9 RATED',
        headline: `${kw.actionVerb} ${kw.mainTopic}. Reimagined.`,
        subtitle: `Experience the cleanest, most powerful way to ${kw.actionVerb.toLowerCase()} on iOS.`,
        featureFocus: 'Core Interface & Hero Value',
        asoTip: 'High-converting hero hook with trust-building badge for 6.9" display.',
      },
      {
        badge: 'LIGHTNING FAST',
        headline: 'Instant, Frictionless Flow.',
        subtitle: 'Designed to save hours every single week with seamless gesture controls.',
        featureFocus: 'Workflow & Key Feature Highlight',
        asoTip: 'Focuses on speed and effortless daily usage.',
      },
      {
        badge: 'DEEP INSIGHTS',
        headline: 'Intelligent Visual Metrics.',
        subtitle: 'Uncover patterns with stunning real-time charts and custom filters.',
        featureFocus: 'Analytics & Detailed Data View',
        asoTip: 'Attracts power users looking for comprehensive control.',
      },
      {
        badge: 'ECOSYSTEM READY',
        headline: 'iPhone & Apple Watch in Sync.',
        subtitle: 'Live Activities, Dynamic Island, and instant cross-device updates.',
        featureFocus: 'Multi-device & Wearable Synergy',
        asoTip: 'Leverages Apple ecosystem synergy for higher retention.',
      },
      {
        badge: '100% PRIVATE',
        headline: 'Your Data Stays on Device.',
        subtitle: 'Zero trackers, end-to-end encrypted, and completely offline-capable.',
        featureFocus: 'Privacy & Security Reassurance',
        asoTip: 'Crucial for privacy-conscious users in 2026 App Store.',
      },
    ];

    return {
      appStorylineSummary: `A proven 5-stage Apple HIG conversion storyline tailored for ${appName}.`,
      slides: Array.from({ length: count }, (_, i) => {
        const tpl = templates[i % templates.length];
        return {
          slideIndex: i + 1,
          ...tpl,
        };
      }),
    };
  }

  if (language === 'ja') {
    const templates = [
      {
        badge: '★ 4.9 高評価',
        headline: `美しく、洗練された${appName || '体験'}。`,
        subtitle: '指先ひとつで、あなたの毎日をよりスマートにアップデート。',
        featureFocus: 'メイン機能と直感的なUI',
        asoTip: '日本のApp Storeで信頼を獲得する王道のミニマル訴求。',
      },
      {
        badge: '超高速動作',
        headline: '迷わない、圧倒的な使い心地。',
        subtitle: '必要な情報へ瞬時にアクセス。ストレスフリーな操作感を実現。',
        featureFocus: '快適な操作性と時短',
        asoTip: '日々の利便性と快適さをアピールしてインストール率を向上。',
      },
      {
        badge: 'スマート分析',
        headline: 'すべてのデータを美しく可視化。',
        subtitle: 'リアルタイムグラフで、日々の変化と成果が一目でわかります。',
        featureFocus: 'グラフとデータ詳細画面',
        asoTip: '洗練されたビジュアルで機能性の高さを印象付けます。',
      },
      {
        badge: 'エコシステム連携',
        headline: 'iPhoneとApple Watchが完全同期。',
        subtitle: '手元で素早く確認。ダイナミックアイランドにも完全対応。',
        featureFocus: 'Apple Watch＆マルチデバイス連携',
        asoTip: 'Appleエコシステムとの親和性を強調。',
      },
      {
        badge: '安心のプライバシー',
        headline: '完全オフライン・データは端末内のみ。',
        subtitle: 'トラッカーなし。あなたのプライバシーを最優先に保護します。',
        featureFocus: '安心・安全のセキュリティ',
        asoTip: 'セキュリティ意識の高いユーザーへの最終決定打。',
      },
    ];

    return {
      appStorylineSummary: `${appName} に最適化された高CVRスクリーンショット構成。`,
      slides: Array.from({ length: count }, (_, i) => {
        const tpl = templates[i % templates.length];
        return {
          slideIndex: i + 1,
          ...tpl,
        };
      }),
    };
  }

  // Default: Traditional Chinese (zh-TW)
  const templates = [
    {
      badge: '★ 4.9 萬人好評',
      headline: `極致簡約，專為${kw.mainTopic}打造。`,
      subtitle: `全新世代的優雅介面，讓${kw.actionVerb}變得無比直覺流暢。`,
      featureFocus: '主視覺與核心價值亮點',
      asoTip: '經典 Apple HIG 61.8% 視覺鉤子，大幅提升搜尋列表第一眼點擊率。',
    },
    {
      badge: '3秒極速上手',
      headline: '直覺流暢，顛覆繁瑣體驗。',
      subtitle: '專注核心本質，省去所有多餘步驟，每天為您省下寶貴時間。',
      featureFocus: '核心操作介面與效率優勢',
      asoTip: '強調省時與極簡手感，解決使用者轉換痛點。',
    },
    {
      badge: '深度數據洞察',
      headline: '即時視覺化，掌控所有細節。',
      subtitle: '專業級動態圖表與多維度篩選，趨勢走向一目了然。',
      featureFocus: '統計圖表與深度分析畫面',
      asoTip: '吸引對功能深度有要求的進階專業用戶。',
    },
    {
      badge: '雙機無縫聯動',
      headline: 'iPhone 與 Apple Watch 完美同步。',
      subtitle: '支援動態島、即時動態與手錶即時提醒，隨時隨地從容掌握。',
      featureFocus: '手錶生態與跨設備展示',
      asoTip: '展現蘋果生態系聯動深度，提升產品高價值感。',
    },
    {
      badge: '100% 隱私承諾',
      headline: '純本機運算，數據絕對私密。',
      subtitle: '零追蹤代碼、無伺服器上傳，完全屬於您個人的安全空間。',
      featureFocus: '隱私安全與離線可用性',
      asoTip: '消除隱私疑慮，促成猶豫用戶的最終下載決策。',
    },
  ];

  return {
    appStorylineSummary: `為 ${appName} 量身規劃的 5 大 ASO 轉化故事線，精準吸附黃金比例。`,
    slides: Array.from({ length: count }, (_, i) => {
      const tpl = templates[i % templates.length];
      return {
        slideIndex: i + 1,
        ...tpl,
      };
    }),
  };
}

export function generateOfflineVariations(
  currentHeadline: string,
  currentSubtitle: string,
  appName: string,
  category: string,
  featureContext: string,
  language: 'zh-TW' | 'en' | 'ja' = 'zh-TW'
): { variations: AICopyVariation[] } {
  const kw = extractKeywords(appName, category, featureContext, language);

  if (language === 'en') {
    return {
      variations: [
        {
          angle: 'Apple Minimalist',
          badge: 'PURE & ELEGANT',
          headline: `${kw.actionVerb} Everything. Beautifully.`,
          subtitle: 'Designed with precision for iOS 18 with fluid animations.',
          rationale: 'Clean, confident, uncluttered wording that matches Apple design aesthetic.',
        },
        {
          angle: 'Action & Concrete Outcome',
          badge: 'SAVE 3+ HOURS / WEEK',
          headline: `Master Your ${kw.mainTopic} in Seconds.`,
          subtitle: 'Instant gesture shortcuts cut repetitive steps down to zero.',
          rationale: 'Direct verb + measurable benefit drives higher tap conversion.',
        },
        {
          angle: 'Pain Point & Solution',
          badge: 'ZERO STRESS',
          headline: `Never Lose Track of ${kw.mainTopic} Again.`,
          subtitle: 'Automated smart alerts keep everything effortlessly in order.',
          rationale: 'Directly speaks to everyday frustration and offers instant relief.',
        },
        {
          angle: 'Social Proof & Rating',
          badge: '★ 4.9 / 5.0 RATED',
          headline: `The #1 Choice for Modern ${kw.categoryName}.`,
          subtitle: 'Loved by over 100,000+ power users and featured by top creators.',
          rationale: 'Builds immediate credibility and removes download hesitation.',
        },
      ],
    };
  }

  if (language === 'ja') {
    return {
      variations: [
        {
          angle: 'Apple ミニマル風',
          badge: '洗練の美',
          headline: `美しく、直感的に。${kw.mainTopic}の新しい形。`,
          subtitle: 'iOS 18に完全対応した滑らかなアニメーションとデザイン。',
          rationale: '無駄のない言葉で高品質感を伝えるAppleデザインスタイル。',
        },
        {
          angle: '行動＆成果重視',
          badge: '時短革命',
          headline: `わずか数秒で、${kw.mainTopic}をスマート管理。`,
          subtitle: '毎日の作業を驚くほどスムーズに。ワンタップで完了。',
          rationale: '具体的な時短メリットを伝えることでダウンロード意欲を刺激。',
        },
        {
          angle: '悩み解決アプローチ',
          badge: 'ストレスゼロ',
          headline: `もう${kw.mainTopic}で迷わない、忘れない。`,
          subtitle: 'スマート通知と自動同期で、いつでも安心の整理術。',
          rationale: 'ユーザーの日常の不安や不便を直接解消するメッセージ。',
        },
        {
          angle: '信頼＆高評価訴求',
          badge: '★ 4.9 ユーザー絶賛',
          headline: `多くのユーザーに選ばれる、定番${kw.categoryName}アプリ。`,
          subtitle: 'シンプルさと使いやすさで圧倒的な支持を獲得。',
          rationale: '高評価バッジで信頼感を高め、迷いのあるユーザーを後押し。',
        },
      ],
    };
  }

  // zh-TW
  return {
    variations: [
      {
        angle: '極簡 Apple 官方風',
        badge: '全新世代',
        headline: `每一次${kw.actionVerb}，都優雅從容。`,
        subtitle: `深植 iOS 18 核心設計哲學，細膩動效流暢無比。`,
        rationale: '頂級旗艦簡約美學，強調高質感與精緻工藝，適合注重設計的 iOS 用戶。',
      },
      {
        angle: '痛點解決與效率',
        badge: '效率倍增',
        headline: `告別繁瑣，3 秒完成 ${kw.mainTopic}。`,
        subtitle: '直覺手勢即時響應，每日為您省下超過 30 分鐘寶貴時間。',
        rationale: '以數字與強烈動詞直擊痛點，大幅提高搜尋瀏覽時的點擊動機。',
      },
      {
        angle: '強烈效益與行動驅動',
        badge: '掌控全域',
        headline: `隨時隨地，掌控您的 ${kw.mainTopic}。`,
        subtitle: '多維度視覺化動態追蹤，重要資訊一目了然。',
        rationale: '賦予使用者主控權與成就感，強化產品的不可或缺性。',
      },
      {
        angle: '社群背書與權威認證',
        badge: '★ 4.9 萬人推薦',
        headline: `超過 10 萬用戶信賴的 ${kw.categoryName} 首選。`,
        subtitle: '業界頂尖評選一致推薦，帶來無可挑剔的極致體驗。',
        rationale: '消除潛在用戶的信任疑慮，是 App Store 縮圖中最穩定的高轉化版型。',
      },
    ],
  };
}

export function generateOfflineLocalize(
  slides: { slideIndex: number; badge?: string; headline: string; subtitle?: string }[],
  targetLanguages: string[]
): { localizedSets: any[] } {
  const langNames: Record<string, string> = {
    en: 'English (US)',
    'zh-TW': '繁體中文 (台灣/香港)',
    ja: '日本語 (Japan)',
  };

  const localizedSets = targetLanguages.map((lang) => {
    const isEn = lang === 'en';
    const isJa = lang === 'ja';

    return {
      languageCode: lang,
      languageName: langNames[lang] || lang,
      slides: slides.map((s, idx) => {
        if (isEn) {
          const enTemplates = [
            { badge: '★ 4.9 RATED', headline: 'Redefining Mobile Simplicity.', subtitle: 'The fastest, cleanest way to get things done on iOS.' },
            { badge: 'LIGHTNING FAST', headline: 'Intuitive & Ultra Smooth.', subtitle: 'Engineered for seamless gestures and fluid performance.' },
            { badge: 'DEEP INSIGHTS', headline: 'Actionable Visual Analytics.', subtitle: 'Understand your patterns at a single glance.' },
            { badge: 'CONNECTED', headline: 'iPhone & Watch in Harmony.', subtitle: 'Instant Live Activities and Dynamic Island sync.' },
            { badge: '100% PRIVATE', headline: 'Zero Tracking. Total Peace of Mind.', subtitle: 'All computations stay strictly on your device.' },
          ];
          const t = enTemplates[idx % enTemplates.length];
          return {
            slideIndex: s.slideIndex,
            badge: s.badge ? t.badge : '',
            headline: t.headline,
            subtitle: t.subtitle,
          };
        }

        if (isJa) {
          const jaTemplates = [
            { badge: '★ 4.9 高評価', headline: '美しく洗練された体験を。', subtitle: '毎日の作業をスマートに変える新しいスタンダード。' },
            { badge: '超快適操作', headline: '迷わず使える、圧倒的な快適さ。', subtitle: '指先ひとつでスムーズに完結する操作感。' },
            { badge: 'スマート分析', headline: 'すべてのデータを直感的に可視化。', subtitle: 'リアルタイムグラフで変化が一目でわかります。' },
            { badge: '手元で同期', headline: 'iPhoneとApple Watchが連動。', subtitle: 'ダイナミックアイランドと手元通知に対応。' },
            { badge: '完全プライベート', headline: '安心のオンデバイス処理。', subtitle: 'あなたのデータは端末内でのみ安全に保護。' },
          ];
          const t = jaTemplates[idx % jaTemplates.length];
          return {
            slideIndex: s.slideIndex,
            badge: s.badge ? t.badge : '',
            headline: t.headline,
            subtitle: t.subtitle,
          };
        }

        // Default zh-TW
        const zhTemplates = [
          { badge: '★ 4.9 推薦', headline: '極致簡約，專為卓越而生。', subtitle: '全新世代的行動介面，為您帶來前所未有的流暢體驗。' },
          { badge: '極速上手', headline: '直覺流暢，省時更省心。', subtitle: '專注核心本質，告別一切繁瑣步驟。' },
          { badge: '精準圖表', headline: '即時可視化，掌控所有細節。', subtitle: '多維度動態分析，趨勢走向一目了然。' },
          { badge: '手錶連動', headline: 'iPhone 與 Watch 完美同步。', subtitle: '支援動態島與即時活動，手腕隨時掌握最新狀態。' },
          { badge: '100% 隱私', headline: '本機專屬運算，數據絕對安全。', subtitle: '零資料收集，給您最安心的隱私保護承諾。' },
        ];
        const t = zhTemplates[idx % zhTemplates.length];
        return {
          slideIndex: s.slideIndex,
          badge: s.badge ? t.badge : '',
          headline: t.headline,
          subtitle: t.subtitle,
        };
      }),
    };
  });

  return { localizedSets };
}

// ----------------------------------------------------
// 🌐 統一呼叫分發器 (Universal Dispatcher)
// ----------------------------------------------------

async function callClientGemini(apiKey: string, prompt: string, schema: any): Promise<any> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.7,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Google API HTTP ${res.status}`);
  }

  const result = await res.json();
  const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('No content returned from Gemini');
  return JSON.parse(rawText);
}

export async function requestDeckCopy(
  params: {
    appName: string;
    appCategory: string;
    appDescription: string;
    slideCount: number;
    language: 'zh-TW' | 'en' | 'ja';
    tone: string;
  },
  settings: ApiKeySettings
): Promise<{ data: AIPitchDeckResponse; source: 'gemini-custom' | 'gemini-server' | 'smart-offline' }> {
  // If user selected offline mode or has no key
  if (settings.storageMode === 'offline' || (!settings.apiKey && typeof window !== 'undefined')) {
    // Try server-side first (if running on local dev server with GEMINI_API_KEY)
    try {
      const res = await fetch('/api/ai/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      // Check if response is actually JSON and not 404 HTML
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const json = await res.json();
        if (json.success && json.data) {
          return { data: json.data, source: 'gemini-server' };
        }
      }
    } catch {
      // Server not reachable (Cloudflare static hosting) -> Fallback seamlessly
    }

    // Return intelligent offline deck without errors
    const fallback = generateOfflineDeck(
      params.appName,
      params.appCategory,
      params.appDescription,
      params.slideCount,
      params.language,
      params.tone
    );
    return { data: fallback, source: 'smart-offline' };
  }

  // If user provided a custom BYOK API key -> call direct Google endpoint
  try {
    const prompt = `
You are an expert iOS App Store Optimization (ASO) and Conversion Copywriter.
Create a high-converting ${params.slideCount}-slide App Store screenshot story arc for:
App Name: ${params.appName}
Category: ${params.appCategory}
Description: ${params.appDescription}
Tone: ${params.tone}
Language: ${params.language}

Rules:
1. Slide 1 is the high-converting hook.
2. Headlines must be punchy (< 8 words in English, < 12 characters in Chinese/Japanese).
3. Badges like "★ 4.9", "NEW", "100% PRIVATE".
4. Provide asoTip explaining why it converts.
`;

    const schema = {
      type: 'OBJECT',
      properties: {
        appStorylineSummary: { type: 'STRING' },
        slides: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              slideIndex: { type: 'INTEGER' },
              badge: { type: 'STRING' },
              headline: { type: 'STRING' },
              subtitle: { type: 'STRING' },
              featureFocus: { type: 'STRING' },
              asoTip: { type: 'STRING' },
            },
            required: ['slideIndex', 'headline', 'subtitle', 'featureFocus', 'asoTip'],
          },
        },
      },
      required: ['appStorylineSummary', 'slides'],
    };

    const parsed = await callClientGemini(settings.apiKey, prompt, schema);
    return { data: parsed, source: 'gemini-custom' };
  } catch (err: any) {
    console.warn('Direct Gemini API call failed, falling back to smart offline engine:', err);
    const fallback = generateOfflineDeck(
      params.appName,
      params.appCategory,
      params.appDescription,
      params.slideCount,
      params.language,
      params.tone
    );
    return { data: fallback, source: 'smart-offline' };
  }
}

export async function requestVariations(
  params: {
    currentHeadline: string;
    currentSubtitle: string;
    appName: string;
    category: string;
    featureContext: string;
    language: 'zh-TW' | 'en' | 'ja';
  },
  settings: ApiKeySettings
): Promise<{ variations: AICopyVariation[]; source: 'gemini-custom' | 'gemini-server' | 'smart-offline' }> {
  if (settings.storageMode === 'offline' || (!settings.apiKey && typeof window !== 'undefined')) {
    try {
      const res = await fetch('/api/ai/suggest-variations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const json = await res.json();
        if (json.success && json.data?.variations) {
          return { variations: json.data.variations, source: 'gemini-server' };
        }
      }
    } catch {
      // Fallback
    }

    const fallback = generateOfflineVariations(
      params.currentHeadline,
      params.currentSubtitle,
      params.appName,
      params.category,
      params.featureContext,
      params.language
    );
    return { variations: fallback.variations, source: 'smart-offline' };
  }

  // Custom Key
  try {
    const prompt = `
Generate 4 distinct high-converting App Store screenshot copy variations:
App: ${params.appName} (${params.category})
Current: "${params.currentHeadline}" / "${params.currentSubtitle}"
Feature: "${params.featureContext}"
Language: ${params.language}

Provide 4 psychological angles: Action & Outcome, Apple Minimalist, Pain Point & Solution, Social Proof.
`;

    const schema = {
      type: 'OBJECT',
      properties: {
        variations: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              angle: { type: 'STRING' },
              badge: { type: 'STRING' },
              headline: { type: 'STRING' },
              subtitle: { type: 'STRING' },
              rationale: { type: 'STRING' },
            },
            required: ['angle', 'headline', 'subtitle', 'rationale'],
          },
        },
      },
      required: ['variations'],
    };

    const parsed = await callClientGemini(settings.apiKey, prompt, schema);
    return { variations: parsed.variations || [], source: 'gemini-custom' };
  } catch (err: any) {
    console.warn('Custom Gemini API call failed, falling back to smart offline engine:', err);
    const fallback = generateOfflineVariations(
      params.currentHeadline,
      params.currentSubtitle,
      params.appName,
      params.category,
      params.featureContext,
      params.language
    );
    return { variations: fallback.variations, source: 'smart-offline' };
  }
}

export async function requestLocalize(
  slides: { slideIndex: number; badge?: string; headline: string; subtitle?: string }[],
  targetLanguages: string[],
  settings: ApiKeySettings
): Promise<{ localizedSets: any[]; source: 'gemini-custom' | 'gemini-server' | 'smart-offline' }> {
  if (settings.storageMode === 'offline' || (!settings.apiKey && typeof window !== 'undefined')) {
    try {
      const res = await fetch('/api/ai/localize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides, targetLanguages }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const json = await res.json();
        if (json.success && json.data?.localizedSets) {
          return { localizedSets: json.data.localizedSets, source: 'gemini-server' };
        }
      }
    } catch {
      // Fallback
    }

    const fallback = generateOfflineLocalize(slides, targetLanguages);
    return { localizedSets: fallback.localizedSets, source: 'smart-offline' };
  }

  // Custom key
  try {
    const prompt = `
Translate and culturally localize these App Store screenshot copies for iOS App Store localization.
Slides: ${JSON.stringify(slides)}
Target Languages: ${targetLanguages.join(', ')}
`;

    const schema = {
      type: 'OBJECT',
      properties: {
        localizedSets: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              languageCode: { type: 'STRING' },
              languageName: { type: 'STRING' },
              slides: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    slideIndex: { type: 'INTEGER' },
                    badge: { type: 'STRING' },
                    headline: { type: 'STRING' },
                    subtitle: { type: 'STRING' },
                  },
                  required: ['slideIndex', 'headline', 'subtitle'],
                },
              },
            },
            required: ['languageCode', 'languageName', 'slides'],
          },
        },
      },
      required: ['localizedSets'],
    };

    const parsed = await callClientGemini(settings.apiKey, prompt, schema);
    return { localizedSets: parsed.localizedSets || [], source: 'gemini-custom' };
  } catch (err: any) {
    console.warn('Localization Gemini API failed, using smart offline translation sets:', err);
    const fallback = generateOfflineLocalize(slides, targetLanguages);
    return { localizedSets: fallback.localizedSets, source: 'smart-offline' };
  }
}
