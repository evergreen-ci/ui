import { useUserSettings } from "../useUserSettings";

// get the timezone for the user
export const useUserTimeZone = () => {
  const { userSettings } = useUserSettings();
  return userSettings?.timezone ?? undefined;
};
