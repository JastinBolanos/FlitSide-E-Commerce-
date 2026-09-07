import { useState, useEffect, useCallback } from 'react';

export type AppView = 'store' | 'admin';

export interface UseAdminNavigationReturn {
  currentView: AppView;
  setView: (view: AppView) => void;
  openStore: () => void;
  openAdmin: () => void;
}

export function useAdminNavigation(): UseAdminNavigationReturn {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || window.location.hash === '#admin') {
        return 'admin';
      }
    }
    return 'store';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '#store' || window.location.hash === '') {
        setCurrentView('store');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Discreet shortcut: Alt + A or Ctrl + Shift + A
      if (
        (e.altKey && (e.key === 'a' || e.key === 'A')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        setCurrentView((prev) => (prev === 'store' ? 'admin' : 'store'));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const setView = useCallback((view: AppView) => {
    setCurrentView(view);
  }, []);

  const openStore = useCallback(() => {
    setCurrentView('store');
  }, []);

  const openAdmin = useCallback(() => {
    setCurrentView('admin');
  }, []);

  return {
    currentView,
    setView,
    openStore,
    openAdmin,
  };
}
