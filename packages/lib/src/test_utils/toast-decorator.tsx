import { useMemo } from "react";
import { action } from "storybook/actions";
import { ToastContext } from "../context/toast";
/**
 * Story Decorator that provides a mock ToastContext
 * @param Story - Story to wrap
 * @returns Story with MockToastProvider
 */
const WithToastContext = (Story: () => React.JSX.Element) => (
  <MockToastProvider>
    <Story />
  </MockToastProvider>
);

const MockToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toastContext = useMemo(
    () => ({
      error: (message: React.ReactNode, closable: boolean = true) =>
        action(`Toast Error`)({ closable, message }),
      hide: () => action(`Toast Hide`)(),
      info: (message: React.ReactNode, closable: boolean = true) =>
        action(`Toast Info`)({ closable, message }),
      progress: (
        message: React.ReactNode,
        progress: number = 0.5,
        closable: boolean = true,
      ) => action(`Toast Info`)({ closable, message, progress }),
      success: (message: React.ReactNode, closable: boolean = true) =>
        action(`Toast Success`)({ closable, message }),
      warning: (message: React.ReactNode, closable: boolean = true) =>
        action(`Toast Warning`)({ closable, message }),
    }),
    [],
  );

  return (
    <ToastContext.Provider value={toastContext}>
      {children}
    </ToastContext.Provider>
  );
};
export default WithToastContext;
