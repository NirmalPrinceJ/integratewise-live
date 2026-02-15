import { GridLayout, StandardEmptyState, Card } from "@/components/layouts/page-layouts"
import { Button } from "@/components/ui/button"
import { Plus, Target } from "lucide-react"
import { getGoals, formatCurrency } from "@/lib/supabase/queries"

export default async function GoalsPage() {
  const goals = await getGoals()

  if (goals.length === 0) {
    return (
      <GridLayout title="Goals" description="Track your targets and progress" stageId="GOALS-015" columns={2}>
        <div className="col-span-2">
          <StandardEmptyState
            icon={<Target className="w-12 h-12 text-muted-foreground/50" />}
            title="No goals set yet"
            description="Define your business goals to track progress and align your team."
            action={
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Goal
              </Button>
            }
          />
        </div>
      </GridLayout>
    )
  }

  return (
    <GridLayout 
      title="Goals" 
      description="Track your targets and progress" 
      stageId="GOALS-015" 
      columns={2}
      actions={
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      }
    >
      {goals.map((goal) => (
        <Card key={goal.id}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">{goal.title}</h3>
              <p className="text-sm text-muted-foreground">
                Target: {goal.currency === "INR" ? formatCurrency(Number(goal.target_value)) : goal.target_value}{" "}
                {goal.target_unit}
              </p>
            </div>
            <Target className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{goal.progress || 0}%</span>
            </div>
            <div className="bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${goal.progress || 0}%` }}
              />
            </div>
          </div>
          <p className="text-lg font-bold text-foreground">
            Current: {goal.currency === "INR" ? formatCurrency(Number(goal.current_value)) : goal.current_value}
          </p>
        </Card>
      ))}
    </GridLayout>
  )
}
