import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  Send,
  DollarSign,
  Wallet,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface AccountBalance {
  exchange: string;
  currency: string;
  available: number;
  locked: number;
  total: number;
}

interface LiveOrder {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  status: "pending" | "completed" | "cancelled" | "failed";
  timestamp: string;
  fee: number;
  total: number;
}

export default function LiveTrading() {
  const [selectedExchange, setSelectedExchange] = useState<string>("binance");
  const [showBalances, setShowBalances] = useState(true);
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([]);
  const [orderForm, setOrderForm] = useState({
    symbol: "BTC",
    type: "buy" as "buy" | "sell",
    quantity: "",
    price: "",
  });

  // Fetch account balances
  const { data: balancesData = [] } = trpc.liveTrade.getBalances.useQuery();
  
  // Fetch live orders
  const { data: ordersData = [], refetch: refetchOrders } = trpc.liveTrade.getOrders.useQuery();
  
  // Fetch trading performance
  const { data: performance } = trpc.liveTrade.getPerformance.useQuery();
  
  // Place order mutation
  const placeOrderMutation = trpc.liveTrade.placeOrder.useMutation({
    onSuccess: () => {
      toast.success("Order placed successfully!");
      refetchOrders();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to place order");
    },
  });

  // Convert backend data to frontend format
  const accountBalances: AccountBalance[] = balancesData.map((balance: any) => ({
    exchange: balance.exchange,
    currency: balance.currency,
    available: parseFloat(balance.available),
    locked: parseFloat(balance.locked),
    total: parseFloat(balance.total),
  }));

  // Sync orders from backend
  useEffect(() => {
    if (ordersData && ordersData.length > 0) {
      const formattedOrders: LiveOrder[] = ordersData.map((order: any) => ({
        id: order.id.toString(),
        symbol: order.symbol,
        type: order.type,
        quantity: parseFloat(order.quantity),
        price: parseFloat(order.price),
        status: order.status,
        timestamp: order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString(),
        fee: parseFloat(order.fee),
        total: parseFloat(order.total),
      }));
      setLiveOrders(formattedOrders);
    }
  }, [ordersData]);

  const totalProfit = performance?.totalProfit ? parseFloat(performance.totalProfit) : 0;
  const profitPercentage = performance?.profitPercentage ? parseFloat(performance.profitPercentage) : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
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

  const handlePlaceOrder = async () => {
    if (!orderForm.symbol || !orderForm.quantity || !orderForm.price) {
      toast.error("Please fill in all fields");
      return;
    }

    const orderId = `order-${Date.now()}`;
    const quantity = parseFloat(orderForm.quantity);
    const price = parseFloat(orderForm.price);
    const total = quantity * price;
    const fee = total * 0.001; // 0.1% fee

    await placeOrderMutation.mutateAsync({
      exchange: selectedExchange as "binance" | "coinbase" | "kraken",
      orderId,
      symbol: `${orderForm.symbol}/USDT`,
      type: orderForm.type,
      quantity: quantity.toString(),
      price: price.toString(),
      fee: fee.toString(),
      total: total.toString(),
    });

    // Reset form
    setOrderForm({
      symbol: "BTC",
      type: "buy",
      quantity: "",
      price: "",
    });
  };

  const currentBalance = accountBalances.find((b) => b.exchange === selectedExchange);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Live Trading</h1>
          <p className="text-slate-600">
            Execute real trades across Binance, Coinbase, and Kraken exchanges
          </p>
        </div>

        {/* Profit Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Profit */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Total Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 mb-2">
                {formatCurrency(totalProfit)}
              </div>
              <Badge className="bg-green-200 text-green-800">
                +{profitPercentage.toFixed(2)}% ROI
              </Badge>
            </CardContent>
          </Card>

          {/* Account Balance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Account Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Available:</span>
                  <span className="font-semibold">
                    {formatCurrency(currentBalance?.available || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Locked:</span>
                  <span className="font-semibold">
                    {formatCurrency(currentBalance?.locked || 0)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-700">Total:</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(currentBalance?.total || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Orders */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Active Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Pending:</span>
                  <Badge variant="secondary">
                    {liveOrders.filter((o) => o.status === "pending").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Completed:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {liveOrders.filter((o) => o.status === "completed").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Failed:</span>
                  <Badge className="bg-red-100 text-red-800">
                    {liveOrders.filter((o) => o.status === "failed").length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Place Order Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Place Order</CardTitle>
              <CardDescription>Execute a new trade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Exchange Selection */}
              <div className="space-y-2">
                <Label htmlFor="exchange">Exchange</Label>
                <Select value={selectedExchange} onValueChange={setSelectedExchange}>
                  <SelectTrigger id="exchange">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="binance">Binance</SelectItem>
                    <SelectItem value="coinbase">Coinbase</SelectItem>
                    <SelectItem value="kraken">Kraken</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Order Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Order Type</Label>
                <Select
                  value={orderForm.type}
                  onValueChange={(value) =>
                    setOrderForm({ ...orderForm, type: value as "buy" | "sell" })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Symbol */}
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  placeholder="BTC, ETH, ADA..."
                  value={orderForm.symbol}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, symbol: e.target.value.toUpperCase() })
                  }
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0.5"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price (USDT)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="43250"
                  value={orderForm.price}
                  onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })}
                />
              </div>

              {/* Order Summary */}
              {orderForm.quantity && orderForm.price && (
                <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total:</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        parseFloat(orderForm.quantity) * parseFloat(orderForm.price)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Fee (0.1%):</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        parseFloat(orderForm.quantity) *
                          parseFloat(orderForm.price) *
                          0.001
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={placeOrderMutation.isPending}
                className={`w-full ${
                  orderForm.type === "buy"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {placeOrderMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Place {orderForm.type.toUpperCase()} Order
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Account Balances */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Account Balances</CardTitle>
                <CardDescription>Across all connected exchanges</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalances(!showBalances)}
              >
                {showBalances ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accountBalances.length > 0 ? (
                  accountBalances.map((balance) => (
                    <div
                      key={balance.exchange}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-semibold capitalize text-slate-900">
                          {balance.exchange}
                        </div>
                        <div className="text-sm text-slate-600">{balance.currency}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">
                          {showBalances
                            ? formatCurrency(balance.total)
                            : "••••••••"}
                        </div>
                        <div className="text-xs text-slate-600">
                          {showBalances
                            ? `Available: ${formatCurrency(balance.available)}`
                            : "••••••••"}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No account balances connected. Connect an exchange in Settings.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trading History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Trading History</CardTitle>
              <CardDescription>Recent orders and executions</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchOrders()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {liveOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">
                        Symbol
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">
                        Type
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">
                        Quantity
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">
                        Price
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">
                        Total
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">
                        Fee
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveOrders.map((order) => (
                      <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-900 font-mono text-xs">
                          {order.id}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {order.symbol}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              order.type === "buy"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {order.type.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-900">
                          {order.quantity}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-900">
                          {formatCurrency(order.price)}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-600">
                          {formatCurrency(order.fee)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs">{order.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No orders yet. Place your first order to get started!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
