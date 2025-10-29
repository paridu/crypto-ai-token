import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";

const POPULAR_CRYPTOS = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "ADA", name: "Cardano" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "XRP", name: "Ripple" },
  { symbol: "DOGE", name: "Dogecoin" },
];

export default function Watchlist() {
  const [newCrypto, setNewCrypto] = useState("");
  
  // Fetch user's watchlist
  const { data: watchlist = [], isLoading, refetch } = trpc.watchlist.getList.useQuery();
  
  // Mutations
  const addMutation = trpc.watchlist.add.useMutation({
    onSuccess: () => {
      setNewCrypto("");
      refetch();
    },
  });
  
  const removeMutation = trpc.watchlist.remove.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  
  // Get crypto prices
  const { data: cryptoPrices = [] } = trpc.crypto.getPrices.useQuery();
  
  const handleAdd = () => {
    if (newCrypto.trim()) {
      addMutation.mutate({ cryptoSymbol: newCrypto.toUpperCase() });
    }
  };
  
  const handleRemove = (symbol: string) => {
    removeMutation.mutate({ cryptoSymbol: symbol });
  };
  
  const getPrice = (symbol: string) => {
    return cryptoPrices.find((p) => p.symbol === symbol);
  };
  
  const watchlistSymbols = watchlist.map((w) => w.cryptoSymbol);
  const availableCryptos = POPULAR_CRYPTOS.filter(
    (c) => !watchlistSymbols.includes(c.symbol)
  );

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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Watchlist</h1>
          <p className="text-slate-600">Track your favorite cryptocurrencies</p>
        </div>

        {/* Add New Crypto */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Cryptocurrency</CardTitle>
            <CardDescription>Add a new cryptocurrency to your watchlist</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Enter symbol (e.g., BTC, ETH, ADA)"
                value={newCrypto}
                onChange={(e) => setNewCrypto(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                className="flex-1"
              />
              <Button
                onClick={handleAdd}
                disabled={addMutation.isPending || !newCrypto.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            
            {/* Quick Add Buttons */}
            {availableCryptos.length > 0 && (
              <div>
                <p className="text-sm text-slate-600 mb-2">Quick add popular cryptos:</p>
                <div className="flex flex-wrap gap-2">
                  {availableCryptos.map((crypto) => (
                    <Button
                      key={crypto.symbol}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addMutation.mutate({ cryptoSymbol: crypto.symbol });
                      }}
                      disabled={addMutation.isPending}
                    >
                      {crypto.symbol}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Watchlist Items */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Your Watchlist ({watchlist.length})
          </h2>
          
          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="inline-block animate-spin">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-slate-600 mt-2">Loading watchlist...</p>
              </CardContent>
            </Card>
          ) : watchlist.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-4">Your watchlist is empty</p>
                <p className="text-slate-500 mb-6">Add cryptocurrencies to track them here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {watchlist.map((item) => {
                const price = getPrice(item.cryptoSymbol);
                const priceChange = price ? parseFloat(String(price.priceChange24h)) : 0;
                
                return (
                  <Card key={item.cryptoSymbol} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-bold text-lg text-slate-900">
                            {item.cryptoSymbol}
                          </p>
                          <p className="text-sm text-slate-600">
                            Added {new Date(item.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(item.cryptoSymbol)}
                          disabled={removeMutation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {price ? (
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-slate-600">Current Price</p>
                            <p className="text-2xl font-bold text-slate-900">
                              ${parseFloat(String(price.currentPrice)).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <div>
                              <p className="text-xs text-slate-600">24h Change</p>
                              <div className="flex items-center gap-1">
                                {priceChange >= 0 ? (
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                                <p
                                  className={`font-semibold ${
                                    priceChange >= 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {priceChange > 0 ? "+" : ""}
                                  {priceChange.toFixed(2)}%
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-slate-600">7d Change</p>
                              <p
                                className={`font-semibold ${
                                  parseFloat(String(price.priceChange7d)) >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {parseFloat(String(price.priceChange7d)) > 0 ? "+" : ""}
                                {parseFloat(String(price.priceChange7d)).toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-slate-500 text-sm">Price data not available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
