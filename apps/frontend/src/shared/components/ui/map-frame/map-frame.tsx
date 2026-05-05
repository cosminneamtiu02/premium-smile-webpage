import { cn } from "@/shared/lib/cn";

type MapFrameAspect = "wide" | "video" | "square";

export type MapFrameProps = {
  /** Google Maps "Embed a map" URL — `https://www.google.com/maps/embed?pb=...`.
   *  Other formats (a `maps.app.goo.gl` short link, a regular maps URL) will not
   *  iframe correctly because Google's embed endpoint is the only one that allows
   *  it. The component does not validate — that's a consumer-site responsibility. */
  embedSrc: string;
  /** Required. Becomes `<iframe title>`, the only label assistive tech sees for
   *  the iframe. Should describe what the map is showing. */
  title: string;
  /** Visual aspect ratio. Default `"wide"` (16:10). */
  aspect?: MapFrameAspect;
  className?: string;
};

const ASPECT_CLASS: Record<MapFrameAspect, string> = {
  wide: "aspect-[16/10]",
  video: "aspect-video",
  square: "aspect-square",
};

/**
 * Iframe-based Google Maps Embed wrapper. Renders a rounded, lavender-tinted
 * frame around the iframe and lazy-loads it. The lavender background under the
 * iframe (`bg-bg-subtle`) keeps the load state on-brand instead of flashing
 * white while Google's tiles arrive.
 *
 * `allow=""` is deliberate — the embed needs none of the standard iframe
 * permissions (no fullscreen, no payment, no microphone), so we explicitly
 * grant nothing.
 */
export function MapFrame({ embedSrc, title, aspect = "wide", className }: MapFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border-subtle bg-bg-subtle shadow-sm",
        ASPECT_CLASS[aspect],
        className,
      )}
    >
      <iframe
        src={embedSrc}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
        allow=""
      />
    </div>
  );
}
