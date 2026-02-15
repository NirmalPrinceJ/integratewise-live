import { PageHeader } from "@/components/spine/page-header"
import { Button } from "@/components/ui/button"
import { Plus, Target } from "lucide-react"
import { getGoals, formatCurrency } from "@/lib/supabase/queries"

export default async function GoalsPage() {
  const goals = await getGoals()

  return (
    <div className="p-6">
      <PageHeader
        title="Goals"
        description="Track your targets and progress"
        stageId="GOALS-015"
        actions={
          <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        }
      />

      {/* Goals Grid */}
      <div className="grid grid-cols-2 gap-4">
        {goals.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No goals set yet</h3>
            <p className="text-gray-500 mb-4">Define your business goals to track progress and align your team.</p>
            <Button className="bg-[#2D7A3E] hover:bg-[#236B31]">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Goal
            </Button>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-500">
                    Target: {goal.currency === "INR" ? formatCurrency(Number(goal.target_value)) : goal.target_value}{" "}
                    {goal.target_unit}
                  </p>
                </div>
                <Target className="w-5 h-5 text-gray-400" />
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-[#2D7A3E]">{goal.progress || 0}%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-[#2D7A3E] h-2 rounded-full transition-all"
                    style={{ width: `${goal.progress || 0}%` }}
                  />
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900">
                Current: {goal.currency === "INR" ? formatCurrency(Number(goal.current_value)) : goal.current_value}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
