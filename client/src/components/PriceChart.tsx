import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PriceChartProps {
  symbol: string;
  name: string;
  currentPrice: number;
  priceHistory: Array<{ time: string; price: number }>;
  change24h: number;
}

export default function PriceChart({
  symbol,
  name,
  currentPrice,
  priceHistory,
  change24h,
}: PriceChartProps) {
  // Calculate chart dimensions
  const chartHeight = 300;
  const chartWidth = 800;
  const padding = 40;

  // Calculate min and max prices
  const prices = priceHistory.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  // Generate SVG path for line chart
  const points = priceHistory.map((d, i) => {
    const x = padding + (i / (priceHistory.length - 1)) * (chartWidth - padding * 2);
    const y =
      chartHeight -
      padding -
      ((d.price - minPrice) / priceRange) * (chartHeight - padding * 2);
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(" L ")}`;

  // Generate gradient area
  const areaPoints = [
    `M ${padding},${chartHeight - padding}`,
    ...points.map((p) => `L ${p}`),
    `L ${chartWidth - padding},${chartHeight - padding}`,
    "Z",
  ].join(" ");

  const getTrendColor = () => {
    return change24h >= 0 ? "#10b981" : "#ef4444";
  };

  const getTrendBgColor = () => {
    return change24h >= 0 ? "#d1fae5" : "#fee2e2";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {symbol[0]}
              </span>
              {symbol} / USD
            </CardTitle>
            <CardDescription>{name}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">
              ${currentPrice.toFixed(2)}
            </p>
            <Badge
              style={{
                backgroundColor: getTrendBgColor(),
                color: getTrendColor(),
              }}
            >
              {change24h >= 0 ? "+" : ""}
              {change24h.toFixed(2)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* SVG Chart */}
        <div className="w-full overflow-x-auto">
          <svg
            width={chartWidth}
            height={chartHeight}
            className="min-w-full"
            style={{ background: "linear-gradient(to bottom, #f8fafc, #f1f5f9)" }}
          >
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`grid-${i}`}
                x1={padding}
                y1={padding + (i / 4) * (chartHeight - padding * 2)}
                x2={chartWidth - padding}
                y2={padding + (i / 4) * (chartHeight - padding * 2)}
                stroke="#e2e8f0"
                strokeDasharray="4"
              />
            ))}

            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map((i) => {
              const price = minPrice + ((4 - i) / 4) * priceRange;
              return (
                <text
                  key={`label-${i}`}
                  x={padding - 10}
                  y={padding + 5 + (i / 4) * (chartHeight - padding * 2)}
                  textAnchor="end"
                  fontSize="12"
                  fill="#64748b"
                >
                  ${price.toFixed(0)}
                </text>
              );
            })}

            {/* Gradient area under line */}
            <defs>
              <linearGradient id={`gradient-${symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={getTrendColor()} stopOpacity="0.2" />
                <stop offset="100%" stopColor={getTrendColor()} stopOpacity="0.01" />
              </linearGradient>
            </defs>

            <path
              d={areaPoints}
              fill={`url(#gradient-${symbol})`}
              stroke="none"
            />

            {/* Line chart */}
            <path
              d={pathData}
              stroke={getTrendColor()}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {points.map((point, i) => {
              const [x, y] = point.split(",").map(Number);
              return (
                <circle
                  key={`point-${i}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={getTrendColor()}
                  opacity={i === points.length - 1 ? 1 : 0.5}
                />
              );
            })}

            {/* X-axis */}
            <line
              x1={padding}
              y1={chartHeight - padding}
              x2={chartWidth - padding}
              y2={chartHeight - padding}
              stroke="#cbd5e1"
              strokeWidth="1"
            />

            {/* Y-axis */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={chartHeight - padding}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Chart info */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-slate-600 mb-1">High</p>
            <p className="text-lg font-semibold text-slate-900">
              ${maxPrice.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Low</p>
            <p className="text-lg font-semibold text-slate-900">
              ${minPrice.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Range</p>
            <p className="text-lg font-semibold text-slate-900">
              ${priceRange.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
