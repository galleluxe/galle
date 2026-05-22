import { PageShell } from "@/components/layout/page-shell";

export default function StorefrontLoading() {
  return (
    <PageShell className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="space-y-6 text-center animate-pulse">
        <span className="material-symbols-outlined text-4xl text-primary/40 animate-spin">
          progress_activity
        </span>
        <p className="font-label-caps text-xs text-text-muted/60 uppercase tracking-[0.25em] font-semibold">
          Loading Essence
        </p>
      </div>
    </PageShell>
  );
}
