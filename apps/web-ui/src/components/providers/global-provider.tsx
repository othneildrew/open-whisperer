'use client';

import type { ReactNode } from 'react';
import { StoreProvider } from '@/components/providers/store-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/shad-ui/tooltip';

/**
 * This just neatly organizes all the providers that need to be setup at the layout level.
 * @param children
 * @constructor
 */
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  return (
    <StoreProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </StoreProvider>
  );
};
