import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function NoticeModal({ open, title, description, onClose, actionLabel, onAction }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-primary/20 bg-card/95 p-7 shadow-[0_30px_100px_-25px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-sky-400 to-primary" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close popup"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-4 pr-8 text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-primary">Notice</p>
              <h3 className="font-display text-4xl text-foreground">{title}</h3>
              <p className="text-sm leading-6 text-secondary-foreground">{description}</p>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {actionLabel && onAction && (
                <button
                  type="button"
                  onClick={onAction}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {actionLabel}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-accent"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
