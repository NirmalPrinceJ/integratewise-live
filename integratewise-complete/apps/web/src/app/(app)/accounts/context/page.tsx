/**
 * L1 Context Page (Accounts) - Pure Data View (No AI)
 * Displays context from connected sources for accounts
 * Accessed via ⌘J Intelligence button for cognitive features
 */
export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Account Context</h1>
      </div>
      <div className="rounded-xl bg-card border border-border p-8 text-center">
        <p className="text-muted-foreground">Account contextual data will appear here.</p>
      </div>
    </div>
  )
}
