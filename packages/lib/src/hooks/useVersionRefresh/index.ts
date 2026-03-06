import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { isLocal as isLocalBuild } from "../../utils/environmentVariables";

const COMMIT_FILE_PATH = "/commit.txt";
const VERSION_CHECK_INTERVAL_MS = 60_000;

const getMetaTagHash = (): string | null =>
  document.querySelector('meta[name="git-hash"]')?.getAttribute("content") ||
  null;

const fetchDeployedHash = async (
  signal: AbortSignal,
): Promise<string | null> => {
  const response = await fetch(COMMIT_FILE_PATH, {
    signal,
    cache: "no-store",
  });
  if (!response.ok) return null;
  const text = await response.text();
  return text.trim() || null;
};

export const useVersionRefresh = (): boolean => {
  const location = useLocation();
  const lastCheckRef = useRef(0);
  const [hasNewVersion, setHasNewVersion] = useState(false);

  useEffect(() => {
    if (isLocalBuild()) return;

    const now = Date.now();
    if (now - lastCheckRef.current < VERSION_CHECK_INTERVAL_MS) return;

    const buildHash = getMetaTagHash();
    if (!buildHash) return;

    const controller = new AbortController();

    fetchDeployedHash(controller.signal)
      .then((deployedHash) => {
        lastCheckRef.current = Date.now();

        if (deployedHash && deployedHash !== buildHash) {
          setHasNewVersion(true);
        }
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          console.error(e);
        }
      });

    // On cleanup cancel in flight call
    return () => controller.abort();
  }, [location]);

  return hasNewVersion;
};
