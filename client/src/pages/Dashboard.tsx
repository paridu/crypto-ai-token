import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  
  // Fetch crypto prices
  const { data: cryptoPrices = [], isLoading: pricesLoading } = trpc.crypto.getPrices.useQuery();
  
  // Fetch latest predictions
  const { data: predictions = [], isLoading: predictionsLoading } = trpc.predictions.getLatest.useQuery();
  
  // Fetch latest sentiment analysis
  const { data: sentiments = [], isLoading: sentimentsLoading } = trpc.sentiment.getLatest.useQuery();

  const formatPrice = (price: string | number) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(num);
  };

  const formatPercentage = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;
  };

  const getSentimentColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getPredictionDirection = (direction: string) => {
    if (direction === "up") return { icon: TrendingUp, color: "text-green-600", label: "Bullish" };
    if (direction === "down") return { icon: TrendingDown, color: "text-red-600", label: "Bearish" };
    return { icon: Activity, color: "text-gray-600", label: "Stable" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Crypto AI Prediction System</h1>
          <p className="text-slate-600">Real-time cryptocurrency analysis powered by AI</p>
        </div>

        {/* Market Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricesLoading ? (
              <div className="col-span-3 text-center py-8">
                <div className="inline-block animate-spin">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-slate-600 mt-2">Loading prices...</p>
              </div>
            ) : (
              cryptoPrices.slice(0, 3).map((crypto) => (
                <Card key={crypto.symbol} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{crypto.name}</CardTitle>
                        <CardDescription>{crypto.symbol}</CardDescription>
                      </div>
                      <Badge variant="secondary">{crypto.symbol}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-slate-600">Current Price</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {formatPrice(crypto.currentPrice)}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-slate-600">24h Change</p>
                          <p className={`font-semibold ${parseFloat(String(crypto.priceChange24h)) >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatPercentage(crypto.priceChange24h)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">7d Change</p>
                          <p className={`font-semibold ${parseFloat(String(crypto.priceChange7d)) >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatPercentage(crypto.priceChange7d)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* AI Predictions & Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Predictions */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">AI Predictions</h2>
            <div className="space-y-4">
              {predictionsLoading ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <div className="inline-block animate-spin">
                      <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-slate-600 mt-2">Loading predictions...</p>
                  </CardContent>
                </Card>
              ) : predictions.length > 0 ? (
                predictions.slice(0, 3).map((pred) => {
                  const direction = getPredictionDirection(pred.priceMovementDirection);
                  const DirectionIcon = direction.icon;
                  return (
                    <Card key={pred.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-slate-900">{pred.cryptoSymbol}</p>
                            <p className="text-sm text-slate-600">{pred.timeframe}</p>
                          </div>
                          <div className={`flex items-center gap-1 ${direction.color}`}>
                            <DirectionIcon className="w-5 h-5" />
                            <span className="font-semibold">{direction.label}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-600">Predicted Price</p>
                            <p className="font-bold text-slate-900">
                              {formatPrice(pred.predictedPrice)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600">Accuracy</p>
                            <p className="font-bold text-blue-600">
                              {parseFloat(String(pred.accuracy)).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-xs text-slate-600">Confidence</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${parseFloat(String(pred.confidence))}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-slate-900">
                              {parseFloat(String(pred.confidence)).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600">No predictions available yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Market Sentiment */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Market Sentiment Analysis</h2>
            <div className="space-y-4">
              {sentimentsLoading ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <div className="inline-block animate-spin">
                      <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-slate-600 mt-2">Loading sentiment...</p>
                  </CardContent>
                </Card>
              ) : sentiments.length > 0 ? (
                sentiments.slice(0, 3).map((sentiment) => (
                  <Card key={sentiment.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-semibold text-slate-900">{sentiment.cryptoSymbol}</p>
                          <p className="text-sm text-slate-600">
                            {new Date(sentiment.analysisDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`text-3xl font-bold ${getSentimentColor(sentiment.sentimentScore)}`}>
                          {sentiment.sentimentScore}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Bullish</span>
                          <span className="font-semibold text-green-600">
                            {parseFloat(String(sentiment.bullishPercentage)).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${parseFloat(String(sentiment.bullishPercentage))}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Bearish</span>
                          <span className="font-semibold text-red-600">
                            {parseFloat(String(sentiment.bearishPercentage)).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${parseFloat(String(sentiment.bearishPercentage))}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Neutral</span>
                          <span className="font-semibold text-gray-600">
                            {parseFloat(String(sentiment.neutralPercentage)).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gray-600 h-2 rounded-full"
                            style={{ width: `${parseFloat(String(sentiment.neutralPercentage))}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600">No sentiment data available yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isAuthenticated && (
          <div className="mt-8 flex gap-4">
            <Link href="/watchlist">
              <Button size="lg" variant="default">
                View Watchlist
              </Button>
            </Link>
            <Link href="/alerts">
              <Button size="lg" variant="outline">
                Manage Alerts
              </Button>
            </Link>
            <Link href="/arbitrage">
              <Button size="lg" variant="outline">
                Arbitrage Opportunities
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
