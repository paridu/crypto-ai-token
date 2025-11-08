import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PriceChart from "@/components/PriceChart";
import { ArrowLeft, Share2, Heart, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "wouter";

export default function CryptoDetails() {
  const [location] = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);

  // Sample data for Bitcoin
  const cryptoData = {
    symbol: "BTC",
    name: "Bitcoin",
    description:
      "Bitcoin is a decentralized digital currency that was created in 2009 by an unknown person or group using the pseudonym Satoshi Nakamoto.",
    currentPrice: 43250.0,
    change24h: 2.45,
    change7d: 5.32,
    change30d: 12.5,
    marketCap: 845000000000,
    volume24h: 28500000000,
    circulatingSupply: 21000000,
    maxSupply: 21000000,
    dominance: 48.2,
    allTimeHigh: 69000,
    allTimeLow: 65.53,
    website: "https://bitcoin.org",
    whitepaper: "https://bitcoin.org/bitcoin.pdf",
    socialLinks: {
      twitter: "https://twitter.com/bitcoin",
      github: "https://github.com/bitcoin",
      reddit: "https://reddit.com/r/bitcoin",
    },
  };

  // Sample price history
  const priceHistory = [
    { time: "00:00", price: 42500 },
    { time: "04:00", price: 42800 },
    { time: "08:00", price: 42300 },
    { time: "12:00", price: 43100 },
    { time: "16:00", price: 43500 },
    { time: "20:00", price: 43250 },
    { time: "24:00", price: 43250 },
  ];

  // Sample news
  const news = [
    {
      id: 1,
      title: "Bitcoin Reaches New All-Time High",
      source: "CoinDesk",
      date: "2 hours ago",
      sentiment: "positive",
    },
    {
      id: 2,
      title: "SEC Approves Bitcoin Spot ETF",
      source: "Bloomberg",
      date: "5 hours ago",
      sentiment: "positive",
    },
    {
      id: 3,
      title: "Bitcoin Mining Difficulty Increases",
      source: "The Block",
      date: "1 day ago",
      sentiment: "neutral",
    },
  ];

  // Sample related cryptocurrencies
  const relatedCryptos = [
    { symbol: "ETH", name: "Ethereum", price: 2650, change: 1.23 },
    { symbol: "BNB", name: "Binance Coin", price: 612, change: 0.89 },
    { symbol: "SOL", name: "Solana", price: 185.5, change: 5.12 },
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

  const getTrendColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                {cryptoData.symbol[0]}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  {cryptoData.name}
                </h1>
                <p className="text-slate-600">{cryptoData.symbol}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-end gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-2">Current Price</p>
                <p className="text-5xl font-bold text-slate-900 mb-4">
                  ${cryptoData.currentPrice.toLocaleString()}
                </p>

                <div className="flex gap-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">24h Change</p>
                    <p className={`text-lg font-semibold ${getTrendColor(cryptoData.change24h)}`}>
                      {cryptoData.change24h >= 0 ? "+" : ""}
                      {cryptoData.change24h.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">7d Change</p>
                    <p className={`text-lg font-semibold ${getTrendColor(cryptoData.change7d)}`}>
                      {cryptoData.change7d >= 0 ? "+" : ""}
                      {cryptoData.change7d.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">30d Change</p>
                    <p className={`text-lg font-semibold ${getTrendColor(cryptoData.change30d)}`}>
                      {cryptoData.change30d >= 0 ? "+" : ""}
                      {cryptoData.change30d.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="ml-auto">
                <Badge className="bg-orange-100 text-orange-800 text-base px-4 py-2">
                  Market Cap Rank #1
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="chart" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chart">Price Chart</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>

          {/* Chart Tab */}
          <TabsContent value="chart">
            <PriceChart
              symbol={cryptoData.symbol}
              name={cryptoData.name}
              currentPrice={cryptoData.currentPrice}
              priceHistory={priceHistory}
              change24h={cryptoData.change24h}
            />
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-slate-600">Market Cap</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(cryptoData.marketCap)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-slate-600">24h Volume</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(cryptoData.volume24h)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-slate-600">Market Dominance</span>
                    <span className="font-semibold text-slate-900">
                      {cryptoData.dominance}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Volume/Market Cap</span>
                    <span className="font-semibold text-slate-900">
                      {((cryptoData.volume24h / cryptoData.marketCap) * 100).toFixed(2)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supply Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-slate-600">Circulating Supply</span>
                    <span className="font-semibold text-slate-900">
                      {cryptoData.circulatingSupply.toLocaleString()} {cryptoData.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-slate-600">Max Supply</span>
                    <span className="font-semibold text-slate-900">
                      {cryptoData.maxSupply.toLocaleString()} {cryptoData.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-slate-600">All Time High</span>
                    <span className="font-semibold text-slate-900">
                      ${cryptoData.allTimeHigh.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">All Time Low</span>
                    <span className="font-semibold text-slate-900">
                      ${cryptoData.allTimeLow.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Latest News</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 pb-4 border-b last:border-b-0"
                  >
                    <Badge
                      className={
                        item.sentiment === "positive"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {item.sentiment}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 mb-1">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        {item.source} • {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Related Tab */}
          <TabsContent value="related">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCryptos.map((crypto) => (
                <Card key={crypto.symbol}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mx-auto mb-3">
                        {crypto.symbol[0]}
                      </div>
                      <p className="font-semibold text-slate-900 mb-1">
                        {crypto.symbol}
                      </p>
                      <p className="text-sm text-slate-600 mb-3">
                        {crypto.name}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mb-2">
                        ${crypto.price.toFixed(2)}
                      </p>
                      <p className={`font-semibold ${getTrendColor(crypto.change)}`}>
                        {crypto.change >= 0 ? "+" : ""}
                        {crypto.change.toFixed(2)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About {cryptoData.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6">{cryptoData.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Official Links
                </p>
                <ul className="space-y-2">
                  <li>
                    <a
                      href={cryptoData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Official Website →
                    </a>
                  </li>
                  <li>
                    <a
                      href={cryptoData.whitepaper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Whitepaper →
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Social Media
                </p>
                <ul className="space-y-2">
                  <li>
                    <a
                      href={cryptoData.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Twitter →
                    </a>
                  </li>
                  <li>
                    <a
                      href={cryptoData.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      GitHub →
                    </a>
                  </li>
                  <li>
                    <a
                      href={cryptoData.socialLinks.reddit}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Reddit →
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Quick Actions
                </p>
                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    Add to Watchlist
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Set Price Alert
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
