'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ArchitectContextType {
  isArchitectMode: boolean;
  setIsArchitectMode: (val: boolean) => void;
}

const ArchitectContext = createContext<ArchitectContextType | undefined>(undefined);

export function useArchitect() {
  const context = useContext(ArchitectContext);
  if (!context) throw new Error('useArchitect must be used within an ArchitectProvider');
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isArchitectMode, setIsArchitectMode] = useState(false);

  // Sync with a body class for global CSS overrides
  useEffect(() => {
    if (isArchitectMode) {
      document.documentElement.classList.add('architect-mode');
    } else {
      document.documentElement.classList.remove('architect-mode');
    }
  }, [isArchitectMode]);

  return (
    <ArchitectContext.Provider value={{ isArchitectMode, setIsArchitectMode }}>
      <NextThemesProvider
        attribute="data-theme"
        defaultTheme="dark"
        enableSystem={false}
      >
        {children}
      </NextThemesProvider>
    </ArchitectContext.Provider>
  );
}
