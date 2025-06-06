import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { css } from "@leafygreen-ui/emotion";
import {
  ToastProvider as LGToastProvider,
  Variant,
  useToast,
} from "@leafygreen-ui/toast";
import { WordBreak } from "../../components/styles";
import { zIndex } from "../../constants/tokens";
import {
  TOAST_TIMEOUT,
  mapLeafyGreenVariantToTitle,
  mapLeafyGreenVariantToToast,
} from "./constants";
import { DispatchToast, DispatchToastWithProgress, ToastParams } from "./types";

interface ToastContextState {
  success: DispatchToast;
  warning: DispatchToast;
  error: DispatchToast;
  info: DispatchToast;
  progress: DispatchToastWithProgress;
}

export const ToastContext = createContext<ToastContextState | null>(null);

const useToastContext = (): ToastContextState => {
  const context = useContext(ToastContext);
  if (context === null || context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

const ToastProviderCore: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { pushToast } = useToast();
  const dispatchToast = useCallback(
    ({
      closable,
      message,
      onClose,
      progress,
      shouldTimeout,
      title,
      variant,
    }: ToastParams) =>
      pushToast({
        // @ts-expect-error: data-cy doesn't exist as a prop on Toast but it will be propagated correctly.
        "data-cy": "toast",
        "data-variant": mapLeafyGreenVariantToToast[variant],
        description: <WordBreak>{message}</WordBreak>,
        dismissible: closable,
        onClose: closable ? onClose : undefined,
        progress,
        timeout: shouldTimeout ? TOAST_TIMEOUT : null,
        title: title || mapLeafyGreenVariantToTitle[variant],
        variant,
      }),
    [pushToast],
  );

  const toastContext: ToastContextState = useMemo(() => {
    const defaultOptions = {
      onClose: () => {},
      shouldTimeout: true,
      title: "",
    };

    return {
      error: (message = "", closable = true, options = {}) =>
        dispatchToast({
          closable,
          message,
          variant: Variant.Warning,
          ...defaultOptions,
          ...options,
        }),
      info: (message = "", closable = true, options = {}) =>
        dispatchToast({
          closable,
          message,
          variant: Variant.Note,
          ...defaultOptions,
          ...options,
        }),
      progress: (message = "", progress = 0.5, closable = true, options = {}) =>
        dispatchToast({
          closable,
          message,
          progress,
          variant: Variant.Progress,
          ...defaultOptions,
          ...options,
        }),
      success: (message = "", closable = true, options = {}) =>
        dispatchToast({
          closable,
          message,
          variant: Variant.Success,
          ...defaultOptions,
          ...options,
        }),
      warning: (message = "", closable = true, options = {}) =>
        dispatchToast({
          closable,
          message,
          variant: Variant.Important,
          ...defaultOptions,
          ...options,
        }),
    };
  }, [dispatchToast]);

  return (
    <ToastContext.Provider value={toastContext}>
      {children}
    </ToastContext.Provider>
  );
};

const ToastProvider: React.FC<{ children?: ReactNode }> = ({ children }) => (
  <LGToastProvider
    portalClassName={css`
      z-index: ${zIndex.toast};
    `}
  >
    <ToastProviderCore>{children}</ToastProviderCore>
  </LGToastProvider>
);

export { ToastProvider, useToastContext };
