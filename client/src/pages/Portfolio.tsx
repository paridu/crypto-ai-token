import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

export default function Portfolio() {
  // Sample portfolio data
  const portfolio = {
    totalValue: 15250.50,
    totalInvested: 12000,
    totalProfit: 3250.50,
    profitPercentage: 27.09,
    holdings: [
      {
        symbol: "BTC",
        name: "Bitcoin",
        amount: 0.25,
        currentPrice: 43250,
        totalValue: 10812.5,
        invested: 8500,
        profit: 2312.5,
        profitPercentage: 27.21,
        change24h: 2.45,
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        amount: 2.5,
        currentPrice: 2650,
        totalValue: 6625,
        invested: 2500,
        profit: 4125,
        profitPercentage: 165,
        change24h: 1.23,
      },
      {
        symbol: "ADA",
        name: "Cardano",
        amount: 1000,
        currentPrice: 0.485,
        totalValue: 485,
        invested: 1000,
        profit: -515,
        profitPercentage: -51.5,
        change24h: -0.85,
      },
    ],
    trades: [
      {
        id: 1,
        type: "buy",
        symbol: "BTC",
        amount: 0.25,
        price: 34000,
        date: "2025-10-15",
        profit: 2312.5,
      },
      {
        id: 2,
        type: "sell",
        symbol: "ETH",
        amount: 1,
        price: 2200,
        date: "2025-10-20",
        profit: 1650,
      },
      {
        id: 3,
        type: "buy",
        symbol: "ADA",
        amount: 1000,
        price: 1.0,
        date: "2025-10-25",
        profit: -515,
      },
    ],
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getProfitColor = (profit: number) => {
    return profit >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Portfolio</h1>
          <p className="text-slate-600">Your holdings and trading performance</p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(portfolio.totalValue)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Invested</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(portfolio.totalInvested)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-slate-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Profit</p>
                  <p className={`text-2xl font-bold ${getProfitColor(portfolio.totalProfit)}`}>
                    {formatCurrency(portfolio.totalProfit)}
                  </p>
                </div>
                {portfolio.totalProfit >= 0 ? (
                  <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-600 opacity-20" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">ROI</p>
                  <p className={`text-2xl font-bold ${getProfitColor(portfolio.profitPercentage)}`}>
                    {portfolio.profitPercentage.toFixed(2)}%
                  </p>
                </div>
                <Percent className="w-8 h-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Holdings</CardTitle>
            <CardDescription>Your cryptocurrency positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Asset</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">Amount</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">Value</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">Profit</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">ROI</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">24h</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.map((holding) => (
                    <tr key={holding.symbol} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-slate-900">{holding.symbol}</p>
                          <p className="text-sm text-slate-600">{holding.name}</p>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-slate-900">
                        {holding.amount.toFixed(4)}
                      </td>
                      <td className="text-right py-3 px-4 text-slate-900">
                        ${holding.currentPrice.toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 font-semibold text-slate-900">
                        {formatCurrency(holding.totalValue)}
                      </td>
                      <td className={`text-right py-3 px-4 font-semibold ${getProfitColor(holding.profit)}`}>
                        {holding.profit >= 0 ? "+" : ""}
                        {formatCurrency(holding.profit)}
                      </td>
                      <td className={`text-right py-3 px-4 font-semibold ${getProfitColor(holding.profitPercentage)}`}>
                        {holding.profitPercentage >= 0 ? "+" : ""}
                        {holding.profitPercentage.toFixed(2)}%
                      </td>
                      <td className="text-right py-3 px-4">
                        <Badge
                          variant={holding.change24h >= 0 ? "default" : "destructive"}
                          className="bg-opacity-20"
                        >
                          {holding.change24h >= 0 ? "+" : ""}
                          {holding.change24h.toFixed(2)}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Your latest trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {portfolio.trades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant={trade.type === "buy" ? "default" : "secondary"}>
                      {trade.type.toUpperCase()}
                    </Badge>
                    <div>
                      <p className="font-semibold text-slate-900">{trade.symbol}</p>
                      <p className="text-sm text-slate-600">
                        {trade.amount} @ ${trade.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">{trade.date}</p>
                    <p className={`font-semibold ${getProfitColor(trade.profit)}`}>
                      {trade.profit >= 0 ? "+" : ""}
                      {formatCurrency(trade.profit)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
