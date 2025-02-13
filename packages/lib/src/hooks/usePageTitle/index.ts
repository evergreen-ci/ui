import { useEffect, useRef } from "react";

/**
 * `usePageTitle` is a custom hook that changes the page title to be the specified string passed in.
 * When the component it's called from is unmounted, the page title will return to the default page title.
 * @param title - the title to set the page title to
 */
export const usePageTitle = (title: string): void => {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(
    () => () => {
      document.title = defaultTitle.current;
    },
    [],
  );
};
