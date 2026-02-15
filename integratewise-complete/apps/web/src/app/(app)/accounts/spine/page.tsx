/**
 * L1 Spine Page (Accounts) - Pure Data View (No AI)
 * Displays SSOT entities from Adaptive Spine (L3)
 * Accessed via ⌘J Intelligence button for cognitive features
 */
export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Account Spine</h1>
        <span className="text-xs text-muted-foreground">L3 Adaptive Spine Data</span>
      </div>
      <div className="rounded-xl bg-card border border-border p-8 text-center">
        <p className="text-muted-foreground">Account entity data (SSOT) will appear here.</p>
      </div>
    </div>
  )
}
