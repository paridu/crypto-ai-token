import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, ArrowLeft, AlertCircle, Bell } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";

export default function Alerts() {
  const [newAlert, setNewAlert] = useState({
    cryptoSymbol: "",
    alertType: "price_above" as const,
    targetPrice: "",
  });
  
  // Fetch user's alerts
  const { data: alerts = [], isLoading, refetch } = trpc.alerts.getList.useQuery();
  
  // Mutations
  const createMutation = trpc.alerts.create.useMutation({
    onSuccess: () => {
      setNewAlert({ cryptoSymbol: "", alertType: "price_above", targetPrice: "" });
      refetch();
    },
  });
  
  const deleteMutation = trpc.alerts.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  
  const updateStatusMutation = trpc.alerts.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  
  const handleCreate = () => {
    if (newAlert.cryptoSymbol.trim()) {
      createMutation.mutate({
        cryptoSymbol: newAlert.cryptoSymbol.toUpperCase(),
        alertType: newAlert.alertType,
        targetPrice: newAlert.targetPrice ? parseFloat(newAlert.targetPrice) : undefined,
      });
    }
  };
  
  const handleDelete = (alertId: number) => {
    deleteMutation.mutate({ alertId });
  };
  
  const handleToggleStatus = (alertId: number, currentStatus: number) => {
    updateStatusMutation.mutate({ alertId, isActive: currentStatus === 1 ? 0 : 1 });
  };
  
  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "price_above":
        return "Price Above";
      case "price_below":
        return "Price Below";
      case "sentiment_change":
        return "Sentiment Change";
      default:
        return type;
    }
  };
  
  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "price_above":
        return "bg-green-100 text-green-800";
      case "price_below":
        return "bg-red-100 text-red-800";
      case "sentiment_change":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Trading Alerts</h1>
          <p className="text-slate-600">Set up alerts for price changes and market sentiment</p>
        </div>

        {/* Create New Alert */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Alert</CardTitle>
            <CardDescription>Get notified when market conditions change</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Cryptocurrency Symbol
                  </label>
                  <Input
                    placeholder="e.g., BTC, ETH"
                    value={newAlert.cryptoSymbol}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, cryptoSymbol: e.target.value })
                    }
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Alert Type
                  </label>
                  <select
                    value={newAlert.alertType}
                    onChange={(e) =>
                      setNewAlert({
                        ...newAlert,
                        alertType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="price_above">Price Above</option>
                    <option value="price_below">Price Below</option>
                    <option value="sentiment_change">Sentiment Change</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Target Price (USD)
                  </label>
                  <Input
                    type="number"
                    placeholder="Optional"
                    value={newAlert.targetPrice}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, targetPrice: e.target.value })
                    }
                    step="0.01"
                  />
                </div>
              </div>
              
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending || !newAlert.cryptoSymbol.trim()}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Your Alerts ({alerts.length})
          </h2>
          
          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="inline-block animate-spin">
                  <Bell className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-slate-600 mt-2">Loading alerts...</p>
              </CardContent>
            </Card>
          ) : alerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-4">No alerts created yet</p>
                <p className="text-slate-500 mb-6">Create an alert to get notified about market changes</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <p className="font-bold text-lg text-slate-900">
                            {alert.cryptoSymbol}
                          </p>
                          <Badge className={getAlertTypeColor(alert.alertType)}>
                            {getAlertTypeLabel(alert.alertType)}
                          </Badge>
                          <Badge
                            variant={alert.isActive === 1 ? "default" : "secondary"}
                          >
                            {alert.isActive === 1 ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-slate-600">
                          {alert.targetPrice && (
                            <p>
                              Target Price:{" "}
                              <span className="font-semibold text-slate-900">
                                ${parseFloat(String(alert.targetPrice)).toFixed(2)}
                              </span>
                            </p>
                          )}
                          <p>
                            Created:{" "}
                            <span className="font-semibold text-slate-900">
                              {new Date(alert.createdAt).toLocaleDateString()}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(alert.id, alert.isActive)}
                          disabled={updateStatusMutation.isPending}
                        >
                          {alert.isActive === 1 ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(alert.id)}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
