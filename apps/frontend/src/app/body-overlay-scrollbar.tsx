import { useOverlayScrollbars } from "overlayscrollbars-react";
import { useEffect } from "react";

/**
 * Mounts a JS-rendered overlay scrollbar on `document.body` so the page
 * scroll has a *true* overlay scrollbar (thumb floats over content, no
 * reserved gutter) on every browser. Pure CSS cannot deliver this on
 * Chrome / Edge / Firefox on Windows / Linux — those browsers reserve a
 * scrollbar gutter that no current CSS property can opt out of.
 *
 * The thumb's lavender styling is defined as `.os-theme-smile-overlay` in
 * `index.css`. Effect-only component — renders nothing.
 */
export function BodyOverlayScrollbar() {
  const [initialize] = useOverlayScrollbars({
    options: {
      scrollbars: {
        theme: "os-theme-smile-overlay",
        autoHide: "leave",
        autoHideDelay: 800,
      },
    },
    defer: true,
  });

  useEffect(() => {
    initialize(document.body);
  }, [initialize]);

  return null;
}
