import { useCallback, useRef, useState } from "react";

/**
 * Prevents rapid double-taps from firing overlapping Homey requests.
 */
export const useActionLock = () => {
  const lockedRef = useRef(false);
  const [pending, setPending] = useState(false);

  const run = useCallback(async (action) => {
    if (lockedRef.current) return false;
    lockedRef.current = true;
    setPending(true);
    try {
      await action();
      return true;
    } finally {
      lockedRef.current = false;
      setPending(false);
    }
  }, []);

  return [run, pending];
};
