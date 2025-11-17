import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Zap,
  Target,
  BarChart3,
  ArrowRight,
  Clock,
  DollarSign,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Arbitrage() {
  const [sortBy, setSortBy] = useState<"profit" | "spread">("profit");
  const [filterMinProfit, setFilterMinProfit] = useState<string>("0");
  const [selectedExchange, setSelectedExchange] = useState<string>("all");
  const [autoExecute, setAutoExecute] = useState(false);

  // Fetch arbitrage opportunities
  const { data: opportunities = [], isLoading, refetch } = trpc.arbitrage.getOpportunities.useQuery();

  // Execute arbitrage mutation
  const executeArbitrageMutation = trpc.trading.executeArbitrage.useMutation({
    onSuccess: () => {
      toast.success("Arbitrage executed successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to execute arbitrage");
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleExecute = async (opportunity: any) => {
    try {
      await executeArbitrageMutation.mutateAsync({
        symbol: opportunity.asset,
        buyExchange: opportunity.exchangeA,
        sellExchange: opportunity.exchangeB,
        buyPrice: parseFloat(String(opportunity.priceA)),
        sellPrice: parseFloat(String(opportunity.priceB)),
        quantity: 1,
      });
    } catch (error) {
      console.error("Error executing arbitrage:", error);
    }
  };

  // Filter and sort opportunities
  let filteredOpportunities = opportunities.filter((opp: any) => {
    const profitMargin = parseFloat(String(opp.profitMargin));
    const minProfit = parseFloat(filterMinProfit) || 0;

    if (profitMargin < minProfit) return false;
    if (selectedExchange !== "all") {
      return (
        opp.exchangeA.toLowerCase() === selectedExchange ||
        opp.exchangeB.toLowerCase() === selectedExchange
      );
    }
    return true;
  });

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    if (sortBy === "profit") {
      return parseFloat(String(b.profitMargin)) - parseFloat(String(a.profitMargin));
    } else {
      return parseFloat(String(b.spread)) - parseFloat(String(a.spread));
    }
  });

  // Calculate statistics
  const stats = {
    total: sortedOpportunities.length,
    avgProfit:
      sortedOpportunities.length > 0
        ? sortedOpportunities.reduce(
            (sum, opp) => sum + parseFloat(String(opp.profitMargin)),
            0
          ) / sortedOpportunities.length
        : 0,
    totalPotential: sortedOpportunities.reduce(
      (sum, opp) => sum + parseFloat(opp.potentialProfit),
      0
    ),
    highestProfit: sortedOpportunities.length > 0
      ? Math.max(...sortedOpportunities.map((opp) => parseFloat(String(opp.profitMargin))))
      : 0,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Arbitrage Opportunities
              </h1>
              <p className="text-slate-600">
                Find profitable trading opportunities across exchanges
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Zap className="w-6 h-6 text-blue-600 mt-1" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">How Arbitrage Works</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Arbitrage opportunities occur when the same cryptocurrency has different prices
                  on different exchanges. The spread shows the price difference percentage, and
                  potential profit is calculated based on trading one unit between exchanges.
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs text-blue-800">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>Buy low on Exchange A, sell high on Exchange B</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Profit = (Price B - Price A) - Trading Fees</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Active Opportunities</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Avg Profit Margin</p>
                  <p className="text-3xl font-bold text-green-600">{stats.avgProfit.toFixed(2)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Highest Profit</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.highestProfit.toFixed(2)}%</p>
                </div>
                <Zap className="w-8 h-8 text-emerald-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Potential</p>
                  <p className="text-3xl font-bold text-slate-900">{formatCurrency(stats.totalPotential)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Filters & Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Sort Controls */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Sort By</label>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === "profit" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("profit")}
                    className="flex-1"
                  >
                    Profit
                  </Button>
                  <Button
                    variant={sortBy === "spread" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("spread")}
                    className="flex-1"
                  >
                    Spread
                  </Button>
                </div>
              </div>

              {/* Min Profit Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Min Profit Margin (%)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filterMinProfit}
                  onChange={(e) => setFilterMinProfit(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Exchange Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Filter by Exchange
                </label>
                <Select value={selectedExchange} onValueChange={setSelectedExchange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exchanges</SelectItem>
                    <SelectItem value="binance">Binance</SelectItem>
                    <SelectItem value="coinbase">Coinbase</SelectItem>
                    <SelectItem value="kraken">Kraken</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Auto Execute Toggle */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Auto Execute
                </label>
                <Button
                  variant={autoExecute ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoExecute(!autoExecute)}
                  className="w-full"
                >
                  {autoExecute ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities Table */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="inline-block animate-spin">
                <Loader2 className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-slate-600 mt-4">Scanning exchanges for opportunities...</p>
            </CardContent>
          </Card>
        ) : sortedOpportunities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg mb-2">No opportunities found</p>
              <p className="text-slate-500 mb-6">
                Try adjusting filters or check back later for new opportunities
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Scan Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {sortedOpportunities.length} Opportunities Found
              </CardTitle>
              <CardDescription>
                Click "Execute" to automatically trade these opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                        Asset
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                        Buy Exchange
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                        Buy Price
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                        <ArrowRight className="w-4 h-4 mx-auto" />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                        Sell Exchange
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                        Sell Price
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                        Spread
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                        Profit %
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                        Potential Profit
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOpportunities.map((opp: any, index) => {
                      const profitMargin = parseFloat(String(opp.profitMargin));
                      const spread = parseFloat(String(opp.spread));
                      const isProfitable = profitMargin > 0;
                      const priceA = parseFloat(String(opp.priceA));
                      const priceB = parseFloat(String(opp.priceB));

                      return (
                        <tr
                          key={opp.id}
                          className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="font-bold text-base">
                              {opp.asset}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                            {opp.exchangeA}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-slate-900 font-mono">
                            {formatCurrency(priceA)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <ArrowRight className="w-4 h-4 text-slate-400 mx-auto" />
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                            {opp.exchangeB}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-slate-900 font-mono">
                            {formatCurrency(priceB)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <span
                              className={`font-semibold ${
                                spread > 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {spread > 0 ? "+" : ""}
                              {spread.toFixed(3)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <Badge
                              className={
                                isProfitable
                                  ? "bg-green-100 text-green-800 text-xs font-bold"
                                  : "bg-red-100 text-red-800 text-xs font-bold"
                              }
                            >
                              {isProfitable ? "+" : ""}
                              {profitMargin.toFixed(2)}%
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">
                            {formatCurrency(parseFloat(opp.potentialProfit))}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Button
                              size="sm"
                              onClick={() => handleExecute(opp)}
                              disabled={executeArbitrageMutation.isPending}
                              className={`${
                                isProfitable
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-slate-400 hover:bg-slate-500"
                              }`}
                            >
                              {executeArbitrageMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Zap className="w-4 h-4" />
                              )}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Last Updated</p>
              <p>Opportunities are refreshed every 30 seconds. Trading fees and slippage are automatically calculated.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
