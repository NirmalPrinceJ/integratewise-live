import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, TrendingUp, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useEntities, useEntityStats } from "../../hooks/useEntities";

export function AccountsPage() {
  const { entities, loading } = useEntities({ type: "account" });
  const { stats } = useEntityStats();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Accounts</h1>
        <p className="text-gray-500">Manage your customer relationships</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Accounts</p>
                <p className="text-2xl font-medium">{stats?.total || 0}</p>
              </div>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total ARR</p>
                <p className="text-2xl font-medium">$1.2M</p>
              </div>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">At Risk</p>
                <p className="text-2xl font-medium text-orange-600">{stats?.atRisk || 0}</p>
              </div>
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Healthy</p>
                <p className="text-2xl font-medium text-green-600">{stats?.healthy || 0}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts table */}
      <Card>
        <CardHeader>
          <CardTitle>Account Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {entities.map((entity) => (
              <div key={entity.id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{entity.name}</p>
                  <p className="text-sm text-gray-500">
                    {entity.completeness_status} • {entity.insights_count} insights
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Completeness badge */}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entity.completeness_status === "complete"
                        ? "bg-green-100 text-green-700"
                        : entity.completeness_status === "partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {entity.completeness_score}%
                  </span>
                  
                  {/* Health bar */}
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        entity.health_score > 80
                          ? "bg-green-500"
                          : entity.health_score > 50
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${entity.health_score}%` }}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium w-12 text-right ${
                      entity.health_score > 80
                        ? "text-green-600"
                        : entity.health_score > 50
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {entity.health_score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
