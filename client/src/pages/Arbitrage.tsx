import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, TrendingUp, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";

export default function Arbitrage() {
  const [sortBy, setSortBy] = useState<"profit" | "spread">("profit");
  
  // Fetch arbitrage opportunities
  const { data: opportunities = [], isLoading, refetch } = trpc.arbitrage.getOpportunities.useQuery();
  
  const handleRefresh = () => {
    refetch();
  };
  
  // Sort opportunities
  const sortedOpportunities = [...opportunities].sort((a, b) => {
    if (sortBy === "profit") {
      return parseFloat(String(b.profitMargin)) - parseFloat(String(a.profitMargin));
    } else {
      return parseFloat(String(b.spread)) - parseFloat(String(a.spread));
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-slate-900">Arbitrage Opportunities</h1>
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
          <p className="text-slate-600">Find profitable trading opportunities across exchanges</p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">How Arbitrage Works</p>
                <p className="text-sm text-blue-800">
                  Arbitrage opportunities occur when the same cryptocurrency has different prices on different exchanges. 
                  The spread shows the price difference, and potential profit is calculated based on trading one unit between exchanges.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sort Controls */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={sortBy === "profit" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("profit")}
          >
            Sort by Profit Margin
          </Button>
          <Button
            variant={sortBy === "spread" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("spread")}
          >
            Sort by Spread
          </Button>
        </div>

        {/* Opportunities Table */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="inline-block animate-spin">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-slate-600 mt-4">Loading arbitrage opportunities...</p>
            </CardContent>
          </Card>
        ) : sortedOpportunities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg mb-4">No arbitrage opportunities found</p>
              <p className="text-slate-500 mb-6">Check back later for new opportunities</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Asset</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Exchange A</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Price A</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Exchange B</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Price B</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Spread</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Profit Margin</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Potential Profit</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOpportunities.map((opp, index) => {
                      const profitMargin = parseFloat(String(opp.profitMargin));
                      const spread = parseFloat(String(opp.spread));
                      const isProfitable = profitMargin > 0;
                      
                      return (
                        <tr
                          key={opp.id}
                          className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-50"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="font-bold">
                              {opp.asset}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                            {opp.exchangeA}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-slate-900">
                            ${parseFloat(String(opp.priceA)).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                            {opp.exchangeB}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-slate-900">
                            ${parseFloat(String(opp.priceB)).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <span className={`font-semibold ${spread > 0 ? "text-green-600" : "text-red-600"}`}>
                              {spread > 0 ? "+" : ""}
                              {spread.toFixed(2)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-right">
                            <Badge
                              className={
                                isProfitable
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {isProfitable ? "+" : ""}
                              {profitMargin.toFixed(2)}%
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">
                            ${opp.potentialProfit}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Execute
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Statistics */}
        {sortedOpportunities.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600 mb-2">Total Opportunities</p>
                <p className="text-3xl font-bold text-slate-900">
                  {sortedOpportunities.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600 mb-2">Avg Profit Margin</p>
                <p className="text-3xl font-bold text-green-600">
                  {(
                    sortedOpportunities.reduce(
                      (sum, opp) => sum + parseFloat(String(opp.profitMargin)),
                      0
                    ) / sortedOpportunities.length
                  ).toFixed(2)}
                  %
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600 mb-2">Total Potential Profit</p>
                <p className="text-3xl font-bold text-slate-900">
                  $
                  {sortedOpportunities
                    .reduce((sum, opp) => sum + parseFloat(opp.potentialProfit), 0)
                    .toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
