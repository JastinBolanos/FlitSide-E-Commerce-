/**
 * Resilient LocalStorage Adapter with fallback handling, type safety, and migration support.
 */
export class LocalStorageAdapter {
  public static getItem<T>(key: string, fallback: T, legacyKey?: string): T {
    if (typeof window === 'undefined') return fallback;

    try {
      let data = localStorage.getItem(key);

      // Check legacy migration if current key is empty
      if (!data && legacyKey) {
        data = localStorage.getItem(legacyKey);
        if (data) {
          localStorage.setItem(key, data);
        }
      }

      if (!data) return fallback;

      // Handle any image URL migrations seamlessly
      if (data.includes('photo-1521572267360-ee0c2909d518')) {
        data = data.replace(
          /https:\/\/images\.unsplash\.com\/photo-1521572267360-ee0c2909d518\?auto=format&fit=crop&w=\d+&q=\d+/g,
          'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80'
        );
        localStorage.setItem(key, data);
      }

      return JSON.parse(data) as T;
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Failed to parse key "${key}", using fallback.`, error);
      return fallback;
    }
  }

  public static setItem<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[LocalStorageAdapter] Failed to save key "${key}".`, error);
      return false;
    }
  }

  public static removeItem(key: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
}
