import { useSyncExternalStore } from "react";

// wouter déclenche ces événements quand il modifie l'historique.
const events = ["popstate", "pushState", "replaceState", "hashchange"];

const subscribe = (callback: () => void) => {
  events.forEach(e => addEventListener(e, callback));
  return () => events.forEach(e => removeEventListener(e, callback));
};

/** Fragment courant de l'URL, sans le « # ». */
export function useHash() {
  return useSyncExternalStore(
    subscribe,
    () => decodeURIComponent(location.hash.slice(1)),
    () => ""
  );
}
