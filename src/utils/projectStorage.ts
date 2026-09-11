import { SlideItem } from '../types';

export interface StoredProjectData {
  version: number;
  updatedAt: number;
  slides: SlideItem[];
  activeSlideIndex: number;
  isTabletView?: boolean;
  isStoryboardMode?: boolean;
  zoom?: number;
  projectName?: string;
}

const DB_NAME = 'AppStoreScreenshotStudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';
const CURRENT_PROJECT_KEY = 'active_project';
const LOCAL_STORAGE_FALLBACK_KEY = 'appstore_studio_saved_project';

/**
 * Open or upgrade the IndexedDB database
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open database'));
  });
}

/**
 * Save project data to persistent storage (IndexedDB with LocalStorage fallback)
 */
export async function saveProjectToStorage(project: StoredProjectData): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(project, CURRENT_PROJECT_KEY);

      request.onsuccess = () => {
        // Also save lightweight meta in localStorage
        try {
          localStorage.setItem(
            LOCAL_STORAGE_FALLBACK_KEY + '_meta',
            JSON.stringify({
              updatedAt: project.updatedAt,
              slidesCount: project.slides.length,
            })
          );
        } catch {
          // Ignore localStorage quota errors
        }
        resolve(true);
      };

      request.onerror = () => {
        console.warn('IndexedDB put failed, falling back to localStorage');
        resolve(saveToLocalStorageFallback(project));
      };
    });
  } catch (err) {
    console.warn('IndexedDB failed, saving to localStorage:', err);
    return saveToLocalStorageFallback(project);
  }
}

/**
 * Fallback to localStorage if IndexedDB is unavailable
 */
function saveToLocalStorageFallback(project: StoredProjectData): boolean {
  try {
    const serialized = JSON.stringify(project);
    localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, serialized);
    return true;
  } catch (e) {
    console.error('Failed to save project to localStorage (quota exceeded or disabled):', e);
    return false;
  }
}

/**
 * Load project data from persistent storage
 */
export async function loadProjectFromStorage(): Promise<StoredProjectData | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(CURRENT_PROJECT_KEY);

      request.onsuccess = () => {
        if (request.result && Array.isArray(request.result.slides) && request.result.slides.length > 0) {
          resolve(request.result as StoredProjectData);
        } else {
          // Check localStorage fallback
          resolve(loadFromLocalStorageFallback());
        }
      };

      request.onerror = () => {
        resolve(loadFromLocalStorageFallback());
      };
    });
  } catch (err) {
    console.warn('IndexedDB error on load, trying localStorage fallback:', err);
    return loadFromLocalStorageFallback();
  }
}

/**
 * Fallback loader from localStorage
 */
function loadFromLocalStorageFallback(): StoredProjectData | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
      return parsed as StoredProjectData;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Clear the saved project from storage
 */
export async function clearProjectStorage(): Promise<boolean> {
  try {
    localStorage.removeItem(LOCAL_STORAGE_FALLBACK_KEY);
    localStorage.removeItem(LOCAL_STORAGE_FALLBACK_KEY + '_meta');
  } catch {}

  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(CURRENT_PROJECT_KEY);
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch {
    return true;
  }
}

/**
 * Export project as a downloadable JSON file
 */
export function exportProjectToJsonFile(project: StoredProjectData, filename?: string) {
  const jsonStr = JSON.stringify(project, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  a.download = filename || `appstore-studio-project-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parse an imported JSON file and validate structure
 */
export function importProjectFromJsonFile(file: File): Promise<StoredProjectData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);

        if (!data || !Array.isArray(data.slides) || data.slides.length === 0) {
          throw new Error('Invalid project file: missing slides array');
        }

        // Basic schema verification on slides
        const validSlides = data.slides.every(
          (s: any) => s && typeof s.id === 'string' && s.textConfig && s.bgConfig && s.deviceConfig
        );

        if (!validSlides) {
          throw new Error('Project file has incompatible slide format');
        }

        const project: StoredProjectData = {
          version: data.version || 1,
          updatedAt: Date.now(),
          slides: data.slides,
          activeSlideIndex: typeof data.activeSlideIndex === 'number' ? data.activeSlideIndex : 0,
          isTabletView: !!data.isTabletView,
          isStoryboardMode: !!data.isStoryboardMode,
          zoom: typeof data.zoom === 'number' ? data.zoom : 0.44,
          projectName: data.projectName || file.name.replace(/\.json$/i, ''),
        };

        resolve(project);
      } catch (err: any) {
        reject(new Error(err.message || 'Failed to read project file'));
      }
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsText(file);
  });
}
