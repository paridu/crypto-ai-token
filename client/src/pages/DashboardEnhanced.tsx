import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  Zap,
  BarChart3,
  Eye,
  Bell,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
} from "lucide-react";

export default function DashboardEnhanced() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  // Market data
  const marketData = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 43250.0,
      change24h: 2.45,
      change7d: 5.32,
      marketCap: 845000000000,
      volume24h: 28500000000,
      dominance: 48.2,
      prediction: "Bullish",
      predictionAccuracy: 80.2,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 2650.0,
      change24h: 1.23,
      change7d: 3.45,
      marketCap: 318000000000,
      volume24h: 12300000000,
      dominance: 18.5,
      prediction: "Bullish",
      predictionAccuracy: 78.5,
    },
    {
      symbol: "ADA",
      name: "Cardano",
      price: 0.485,
      change24h: -0.85,
      change7d: 1.2,
      marketCap: 17300000000,
      volume24h: 450000000,
      dominance: 1.2,
      prediction: "Bearish",
      predictionAccuracy: 65.3,
    },
  ];

  const topGainers = [
    { symbol: "SOL", name: "Solana", change: 5.12 },
    { symbol: "XRP", name: "Ripple", change: 3.45 },
    { symbol: "DOGE", name: "Dogecoin", change: 2.87 },
  ];

  const topLosers = [
    { symbol: "LINK", name: "Chainlink", change: -2.34 },
    { symbol: "UNI", name: "Uniswap", change: -1.89 },
    { symbol: "AAVE", name: "Aave", change: -1.45 },
  ];

  const arbitrageOpportunities = [
    {
      asset: "BTC",
      exchange1: "Binance",
      exchange2: "Coinbase",
      spread: 0.19,
      profit: 80,
    },
    {
      asset: "ETH",
      exchange1: "Kraken",
      exchange2: "Coinbase",
      spread: 1.02,
      profit: 27,
    },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${value.toFixed(2)}`;
  };

  const getTrendIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowDownLeft className="w-4 h-4 text-red-600" />
    );
  };

  const getTrendColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Refresh */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Crypto AI Prediction System
            </h1>
            <p className="text-slate-600">
              Real-time cryptocurrency analysis powered by AI
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            size="lg"
            variant="outline"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Market Cap</p>
                  <p className="text-2xl font-bold text-slate-900">
                    $2.1T
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">24h Volume</p>
                  <p className="text-2xl font-bold text-slate-900">
                    $85.2B
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">BTC Dominance</p>
                  <p className="text-2xl font-bold text-slate-900">
                    48.2%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Fear & Greed</p>
                  <p className="text-2xl font-bold text-slate-900">
                    65
                  </p>
                </div>
                <Zap className="w-8 h-8 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Cryptocurrencies */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Cryptocurrencies</CardTitle>
                <CardDescription>Market leaders and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.map((crypto) => (
                    <div
                      key={crypto.symbol}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {crypto.symbol[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            {crypto.symbol}
                          </p>
                          <p className="text-sm text-slate-600">{crypto.name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          ${crypto.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 justify-end">
                          {getTrendIcon(crypto.change24h)}
                          <span className={`text-sm font-medium ${getTrendColor(crypto.change24h)}`}>
                            {crypto.change24h >= 0 ? "+" : ""}
                            {crypto.change24h.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <Badge
                          variant={
                            crypto.prediction === "Bullish" ? "default" : "destructive"
                          }
                          className="mb-2"
                        >
                          {crypto.prediction}
                        </Badge>
                        <p className="text-xs text-slate-600">
                          {crypto.predictionAccuracy.toFixed(1)}% accurate
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/predictions">
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Predictions
                </Button>
              </Link>

              <Link href="/arbitrage">
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Arbitrage Scan
                </Button>
              </Link>

              <Link href="/trading">
                <Button className="w-full justify-start" variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Auto Trading
                </Button>
              </Link>

              <Link href="/alerts">
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Alerts
                </Button>
              </Link>

              <Link href="/portfolio">
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Portfolio
                </Button>
              </Link>

              <Link href="/settings">
                <Button className="w-full justify-start" variant="outline">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Gainers & Losers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Gainers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Top Gainers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topGainers.map((crypto) => (
                  <div
                    key={crypto.symbol}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {crypto.symbol}
                      </p>
                      <p className="text-xs text-slate-600">{crypto.name}</p>
                    </div>
                    <span className="text-green-600 font-bold">
                      +{crypto.change.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Losers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  Top Losers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topLosers.map((crypto) => (
                  <div
                    key={crypto.symbol}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {crypto.symbol}
                      </p>
                      <p className="text-xs text-slate-600">{crypto.name}</p>
                    </div>
                    <span className="text-red-600 font-bold">
                      {crypto.change.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Arbitrage Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Arbitrage Opportunities</CardTitle>
              <CardDescription>
                Cross-exchange trading opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {arbitrageOpportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{opp.asset}</p>
                    <p className="text-xs text-slate-600">
                      {opp.exchange1} → {opp.exchange2}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">
                      {opp.spread.toFixed(2)}%
                    </p>
                    <p className="text-xs text-slate-600">
                      ${opp.profit} profit
                    </p>
                  </div>
                </div>
              ))}
              <Link href="/arbitrage">
                <Button variant="outline" className="w-full mt-2">
                  View All Opportunities
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
