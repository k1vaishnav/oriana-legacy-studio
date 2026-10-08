import { useEffect } from "react";

export function VideoLightbox({
  open,
  onClose,
  title,
  vimeoId,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  vimeoId: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lightbox on-ink" role="dialog" aria-modal="true" aria-label={`Play ${title}`}>
      <button
        type="button"
        onClick={onClose}
        className="lightbox-close flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors duration-300 hover:border-paper hover:bg-paper/10"
        aria-label="Close"
        autoFocus
      >
        <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
          <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      <figure className="lightbox-stage flex flex-col gap-4">
        <div className="relative w-full max-w-[90vw] lg:max-w-[80vw] aspect-video">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
            className="absolute inset-0 h-full w-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
          />
        </div>
      </figure>
    </div>
  );
}
