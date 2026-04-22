export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/95">
      <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm text-secondary-foreground">
          &copy; 2026 <span className="text-primary font-semibold">MovieSearch</span>. All Rights Reserved.
        </p>
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Built by <span className="text-foreground">ZeeshanAbid</span>
        </p>
      </div>
    </footer>
  );
}
