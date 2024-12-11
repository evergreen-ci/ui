import { useEffect } from "react";

export const useAnalyticsAttributes = (userId: string) => {
  const { AttributeStore } = window;

  useEffect(() => {
    if (!AttributeStore) {
      console.error("AttributeStore not found in window object");
      return;
    }
    if (userId !== null) {
      AttributeStore.setGlobalAttribute("user.id", userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
};
