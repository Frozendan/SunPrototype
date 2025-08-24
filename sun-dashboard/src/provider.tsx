import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n-context";
import { ToastProvider } from "@/components/toast";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <I18nProvider>
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </HeroUIProvider>
    </I18nProvider>
  );
}
