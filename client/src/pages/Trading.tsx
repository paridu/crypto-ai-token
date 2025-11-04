import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { TrendingUp, TrendingDown, Activity, AlertCircle, Play, Pause, RefreshCw } from "lucide-react";

export default function Trading() {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSymbols, setSelectedSymbols] = useState(["BTC", "ETH", "ADA"]);

  // Fetch trading statistics
  const { data: stats, refetch: refetchStats } = trpc.trading.getStatistics.useQuery();

  // Fetch trading history
  const { data: history } = trpc.trading.getHistory.useQuery();

  // Detect opportunities query
  const { data: opportunities, refetch: refetchOpportunities } = trpc.trading.detectOpportunities.useQuery(
    { symbols: selectedSymbols },
    { enabled: false }
  );

  // Execute arbitrage mutation
  const executeArbitrageMutation = trpc.trading.executeArbitrage.useMutation();

  const handleDetectOpportunities = async () => {
    try {
      const result = await refetchOpportunities();

      if (result.data?.success && result.data?.opportunities.length > 0) {
        // Auto-execute the best opportunity
        const best = result.data.opportunities[0];
        await executeArbitrageMutation.mutateAsync({
          symbol: best.symbol,
          buyExchange: best.buyExchange,
          sellExchange: best.sellExchange,
          buyPrice: best.buyPrice,
          sellPrice: best.sellPrice,
          quantity: 1,
        });

        // Refresh statistics
        refetchStats();
      }
    } catch (error) {
      console.error("Error detecting opportunities:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Automated Trading Engine
          </h1>
          <p className="text-slate-600">
            Real-time arbitrage detection and execution across Binance, Coinbase, and Kraken
          </p>
        </div>

        {/* Trading Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Trading Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-600">Engine Status</span>
                <Badge variant={isRunning ? "default" : "secondary"}>
                  {isRunning ? "Running" : "Stopped"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={isRunning ? "destructive" : "default"}
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex-1"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDetectOpportunities}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Total Profit Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats ? formatCurrency(stats.totalProfit) : "$0.00"}
              </div>
              <p className="text-sm text-slate-600">
                From {stats?.completedExecutions || 0} successful trades
              </p>
            </CardContent>
          </Card>

          {/* Success Rate Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats ? `${stats.successRate.toFixed(1)}%` : "0%"}
              </div>
              <p className="text-sm text-slate-600">
                {stats?.completedExecutions || 0} of {stats?.totalExecutions || 0} trades
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {stats?.totalExecutions || 0}
                </div>
                <p className="text-sm text-slate-600 mt-1">Total Executions</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats?.completedExecutions || 0}
                </div>
                <p className="text-sm text-slate-600 mt-1">Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats?.failedExecutions || 0}
                </div>
                <p className="text-sm text-slate-600 mt-1">Failed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats ? `${stats.averageProfitMargin.toFixed(2)}%` : "0%"}
                </div>
                <p className="text-sm text-slate-600 mt-1">Avg Profit Margin</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trading History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trading Activity</CardTitle>
            <CardDescription>
              Latest automated arbitrage executions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history && history.executions.length > 0 ? (
              <div className="space-y-4">
                {history.executions.slice(0, 10).map((execution) => (
                  <div
                    key={execution.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-slate-900">
                          {execution.symbol}
                        </span>
                        <Badge className={getStatusColor(execution.status)}>
                          {execution.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        {execution.buyExchange} → {execution.sellExchange}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(execution.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-900">
                        Buy: ${execution.buyPrice.toFixed(2)}
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        Sell: ${execution.sellPrice.toFixed(2)}
                      </div>
                      {execution.profit !== undefined && (
                        <div
                          className={`text-sm font-bold mt-2 ${
                            execution.profit > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {execution.profit > 0 ? "+" : ""}
                          {formatCurrency(execution.profit)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">No trading activity yet</p>
                <p className="text-sm text-slate-500">
                  Click "Start" to begin automated trading
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 flex-wrap">
          <Link href="/arbitrage">
            <Button size="lg" variant="outline">
              View Opportunities
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
