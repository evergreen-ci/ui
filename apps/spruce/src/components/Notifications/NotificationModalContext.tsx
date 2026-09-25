import { createContext, useContext, useMemo, useState } from "react";
import { NotificationModal, NotificationModalProps } from ".";

type OpenNotificationModalOptions = Omit<
  NotificationModalProps,
  "onCancel" | "visible"
>;

interface NotificationModalContextState {
  openNotificationModal: (options: OpenNotificationModalOptions) => void;
}

// Throwing on use rather than on render lets components that can open the modal render without the provider.
const NotificationModalContext = createContext<NotificationModalContextState>({
  openNotificationModal: () => {
    throw new Error(
      "openNotificationModal must be used within a NotificationModalProvider",
    );
  },
});

/**
 * NotificationModalProvider renders a notification modal above the page so it can be opened from places that may
 * unmount before the user finishes, such as a toast dispatched by a restart that reloads the task page.
 * @param props - React props
 * @param props.children - the app content
 * @returns the provider wrapping the app content
 */
export const NotificationModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [options, setOptions] = useState<OpenNotificationModalOptions | null>(
    null,
  );
  const [visible, setVisible] = useState(false);

  const value = useMemo(
    () => ({
      openNotificationModal: (nextOptions: OpenNotificationModalOptions) => {
        setOptions(nextOptions);
        setVisible(true);
      },
    }),
    [],
  );

  return (
    <NotificationModalContext.Provider value={value}>
      {children}
      {options && (
        <NotificationModal
          {...options}
          onCancel={() => setVisible(false)}
          visible={visible}
        />
      )}
    </NotificationModalContext.Provider>
  );
};

export const useNotificationModal = () => useContext(NotificationModalContext);
