import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Target, AlertCircle, RefreshCw, Clock } from "lucide-react";

export default function Predictions() {
  const [timeframe, setTimeframe] = useState("24h");
  const [sortBy, setSortBy] = useState("accuracy");

  // Sample prediction data
  const predictions = [
    {
      id: 1,
      symbol: "BTC",
      name: "Bitcoin",
      currentPrice: 43250,
      predictedPrice: 45000,
      priceChange: 1750,
      priceChangePercent: 4.04,
      accuracy: 80.2,
      confidence: 76,
      trend: "bullish",
      timeframe: "24h",
      factors: [
        "Strong buying pressure",
        "Technical support at $42,500",
        "Positive market sentiment",
      ],
      risks: [
        "Potential resistance at $44,500",
        "Regulatory news impact",
      ],
    },
    {
      id: 2,
      symbol: "ETH",
      name: "Ethereum",
      currentPrice: 2650,
      predictedPrice: 2750,
      priceChange: 100,
      priceChangePercent: 3.77,
      accuracy: 78.5,
      confidence: 72,
      trend: "bullish",
      timeframe: "24h",
      factors: [
        "Positive correlation with BTC",
        "Strong DeFi activity",
        "Layer 2 adoption growth",
      ],
      risks: [
        "Ethereum network congestion",
        "Competitor pressure",
      ],
    },
    {
      id: 3,
      symbol: "ADA",
      name: "Cardano",
      currentPrice: 0.485,
      predictedPrice: 0.45,
      priceChange: -0.035,
      priceChangePercent: -7.22,
      accuracy: 65.3,
      confidence: 60,
      trend: "bearish",
      timeframe: "24h",
      factors: [
        "Profit taking after recent rally",
        "Lower trading volume",
        "Bearish divergence on charts",
      ],
      risks: [
        "Unexpected positive news",
        "Market reversal",
      ],
    },
    {
      id: 4,
      symbol: "SOL",
      name: "Solana",
      currentPrice: 185.5,
      predictedPrice: 195,
      priceChange: 9.5,
      priceChangePercent: 5.12,
      accuracy: 72.1,
      confidence: 68,
      trend: "bullish",
      timeframe: "24h",
      factors: [
        "Network upgrades coming",
        "Institutional interest",
        "Strong ecosystem growth",
      ],
      risks: [
        "Network stability concerns",
        "Competition from other L1s",
      ],
    },
    {
      id: 5,
      symbol: "XRP",
      name: "Ripple",
      currentPrice: 2.15,
      predictedPrice: 2.05,
      priceChange: -0.1,
      priceChangePercent: -4.65,
      accuracy: 68.9,
      confidence: 64,
      trend: "bearish",
      timeframe: "24h",
      factors: [
        "Regulatory uncertainty",
        "Profit taking",
        "Technical resistance breach",
      ],
      risks: [
        "Regulatory clarity positive news",
        "Market sentiment shift",
      ],
    },
  ];

  const timeframes = ["1h", "4h", "24h", "7d", "30d"];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
  };

  const getTrendColor = (trend: string) => {
    return trend === "bullish" ? "text-green-600" : "text-red-600";
  };

  const getTrendBgColor = (trend: string) => {
    return trend === "bullish" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 75) return "bg-green-100 text-green-800";
    if (accuracy >= 65) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const sortedPredictions = [...predictions].sort((a, b) => {
    if (sortBy === "accuracy") return b.accuracy - a.accuracy;
    if (sortBy === "confidence") return b.confidence - a.confidence;
    return b.priceChangePercent - a.priceChangePercent;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">AI Price Predictions</h1>
          <p className="text-slate-600">
            Machine learning-powered cryptocurrency price forecasts
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Timeframe Selector */}
          <Card>
            <CardContent className="pt-6">
              <label className="text-sm font-medium text-slate-700 block mb-3">
                Timeframe
              </label>
              <div className="flex flex-wrap gap-2">
                {timeframes.map((tf) => (
                  <Button
                    key={tf}
                    size="sm"
                    variant={timeframe === tf ? "default" : "outline"}
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sort Selector */}
          <Card>
            <CardContent className="pt-6">
              <label className="text-sm font-medium text-slate-700 block mb-3">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="accuracy">Accuracy</option>
                <option value="confidence">Confidence</option>
                <option value="change">Price Change %</option>
              </select>
            </CardContent>
          </Card>

          {/* Refresh Button */}
          <Card>
            <CardContent className="pt-6">
              <Button size="lg" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Predictions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Bullish Signals</p>
                <p className="text-3xl font-bold text-green-600">3</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Bearish Signals</p>
                <p className="text-3xl font-bold text-red-600">2</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Avg Accuracy</p>
                <p className="text-3xl font-bold text-blue-600">73.0%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Avg Confidence</p>
                <p className="text-3xl font-bold text-purple-600">68%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Predictions List */}
        <div className="space-y-4">
          {sortedPredictions.map((prediction) => (
            <Card key={prediction.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Asset Info */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {prediction.symbol[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{prediction.symbol}</p>
                        <p className="text-sm text-slate-600">{prediction.name}</p>
                      </div>
                    </div>
                    <Badge className={getTrendBgColor(prediction.trend)}>
                      {prediction.trend.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Price Info */}
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Current Price</p>
                    <p className="text-2xl font-bold text-slate-900 mb-3">
                      {formatCurrency(prediction.currentPrice)}
                    </p>
                    <p className="text-sm text-slate-600">Predicted</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {formatCurrency(prediction.predictedPrice)}
                    </p>
                  </div>

                  {/* Change Info */}
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Expected Change</p>
                    <div className={`text-2xl font-bold ${getTrendColor(prediction.trend)} mb-3`}>
                      {prediction.priceChange >= 0 ? "+" : ""}
                      {formatCurrency(prediction.priceChange)}
                    </div>
                    <div className={`text-lg font-semibold ${getTrendColor(prediction.trend)}`}>
                      {prediction.priceChangePercent >= 0 ? "+" : ""}
                      {prediction.priceChangePercent.toFixed(2)}%
                    </div>
                  </div>

                  {/* Metrics */}
                  <div>
                    <div className="mb-4">
                      <p className="text-sm text-slate-600 mb-2">Accuracy</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${prediction.accuracy}%` }}
                          />
                        </div>
                        <Badge className={getAccuracyColor(prediction.accuracy)}>
                          {prediction.accuracy.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                            style={{ width: `${prediction.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">
                          {prediction.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Button */}
                  <div className="flex flex-col justify-center">
                    <Button size="lg" variant="outline" className="mb-2">
                      <Target className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <p className="text-xs text-slate-500 text-center">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {prediction.timeframe}
                    </p>
                  </div>
                </div>

                {/* Expandable Details */}
                <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bullish Factors */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <p className="font-semibold text-slate-900">Bullish Factors</p>
                    </div>
                    <ul className="space-y-2">
                      {prediction.factors.map((factor, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risk Factors */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="font-semibold text-slate-900">Risk Factors</p>
                    </div>
                    <ul className="space-y-2">
                      {prediction.risks.map((risk, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-red-600 mt-1">⚠</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Disclaimer</p>
                <p className="text-sm text-yellow-800">
                  These predictions are based on historical data and machine learning models. They are not financial advice.
                  Cryptocurrency markets are highly volatile and unpredictable. Always do your own research and consult with
                  a financial advisor before making investment decisions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
