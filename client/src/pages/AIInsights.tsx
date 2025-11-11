import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
  Zap,
  Brain,
  Eye,
  AlertCircle,
} from "lucide-react";

export default function AIInsights() {
  const aiModels = [
    {
      name: "DQN Agent",
      confidence: 92,
      sentiment: "Bullish",
      opinion:
        "Strong buy signal detected. Market conditions favor upward momentum with 84% confidence.",
      opportunities: [
        "Bitcoin breakout above $44,000 resistance",
        "Ethereum consolidation pattern forming",
        "Arbitrage opportunity: Binance vs Coinbase",
      ],
      risks: ["High volatility ahead", "Potential pullback to $42,000"],
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "PPO Agent",
      confidence: 78,
      sentiment: "Neutral",
      opinion:
        "Market showing mixed signals. Recommend cautious approach with reduced position sizes.",
      opportunities: [
        "Sideways trading range $42,500-$44,000",
        "Potential support at $42,000 level",
        "Momentum indicators showing divergence",
      ],
      risks: ["Indecision in market", "Breakout direction unclear"],
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "A3C Agent",
      confidence: 85,
      sentiment: "Bullish",
      opinion:
        "Positive momentum building. Technical indicators align with uptrend continuation.",
      opportunities: [
        "RSI showing strength above 60",
        "MACD positive crossover confirmed",
        "Volume increasing on up moves",
      ],
      risks: ["Overbought conditions", "Profit-taking likely soon"],
      color: "from-green-500 to-green-600",
    },
    {
      name: "Multi-Agent RL",
      confidence: 88,
      sentiment: "Bullish",
      opinion:
        "Consensus among agents: Strong buy. Multiple models agree on bullish outlook.",
      opportunities: [
        "Target price: $45,500 (next resistance)",
        "Stop loss: $41,800 (support level)",
        "Risk/reward ratio: 1:2.5 (excellent)",
      ],
      risks: ["Black swan events", "Regulatory news"],
      color: "from-orange-500 to-orange-600",
    },
  ];

  const cryptoOpinions = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: "$43,250",
      change: "+2.45%",
      consensus: "Strong Buy",
      models: {
        DQN: { opinion: "Buy", confidence: 92 },
        PPO: { opinion: "Hold", confidence: 65 },
        A3C: { opinion: "Buy", confidence: 85 },
        MultiAgent: { opinion: "Buy", confidence: 88 },
      },
      reasoning:
        "Technical breakout confirmed with increasing volume. Fundamental support from institutional adoption.",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: "$2,650",
      change: "+1.23%",
      consensus: "Buy",
      models: {
        DQN: { opinion: "Buy", confidence: 78 },
        PPO: { opinion: "Hold", confidence: 72 },
        A3C: { opinion: "Buy", confidence: 81 },
        MultiAgent: { opinion: "Buy", confidence: 79 },
      },
      reasoning:
        "Following Bitcoin strength. Layer 2 adoption increasing. Staking rewards attractive.",
    },
    {
      symbol: "ADA",
      name: "Cardano",
      price: "$0.48",
      change: "-0.85%",
      consensus: "Hold",
      models: {
        DQN: { opinion: "Hold", confidence: 68 },
        PPO: { opinion: "Sell", confidence: 55 },
        A3C: { opinion: "Hold", confidence: 62 },
        MultiAgent: { opinion: "Hold", confidence: 65 },
      },
      reasoning:
        "Consolidation phase. Awaiting positive catalyst. Support holding at $0.45.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            AI Insights & Opinions
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Real-time analysis from multiple AI models
          </p>
        </div>

        {/* AI Models Opinions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            AI Models Analysis
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiModels.map((model, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div
                  className={`bg-gradient-to-r ${model.color} p-4 text-white`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{model.name}</h3>
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      <span className="font-semibold">{model.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Sentiment */}
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${
                        model.sentiment === "Bullish"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {model.sentiment === "Bullish" ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {model.sentiment}
                    </Badge>
                  </div>

                  {/* Opinion */}
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {model.opinion}
                  </p>

                  {/* Opportunities */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-green-600" />
                      Opportunities
                    </h4>
                    <ul className="space-y-1">
                      {model.opportunities.map((opp, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2"
                        >
                          <span className="text-green-600 dark:text-green-400 mt-1">
                            ✓
                          </span>
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      Risks
                    </h4>
                    <ul className="space-y-1">
                      {model.risks.map((risk, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2"
                        >
                          <span className="text-red-600 dark:text-red-400 mt-1">
                            ⚠
                          </span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Crypto Consensus */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Cryptocurrency Consensus
          </h2>

          <div className="space-y-4">
            {cryptoOpinions.map((crypto, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {crypto.symbol} - {crypto.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {crypto.price} {crypto.change}
                      </p>
                    </div>
                    <Badge
                      className={`${
                        crypto.consensus === "Strong Buy"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : crypto.consensus === "Buy"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {crypto.consensus}
                    </Badge>
                  </div>

                  {/* Reasoning */}
                  <p className="text-slate-700 dark:text-slate-300">
                    {crypto.reasoning}
                  </p>

                  {/* Models Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(crypto.models).map(([modelName, data]) => (
                      <div
                        key={modelName}
                        className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center"
                      >
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          {modelName}
                        </p>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {data.opinion === "Buy" ? (
                            <ThumbsUp className="w-4 h-4 text-green-600" />
                          ) : data.opinion === "Sell" ? (
                            <ThumbsDown className="w-4 h-4 text-red-600" />
                          ) : (
                            <Zap className="w-4 h-4 text-yellow-600" />
                          )}
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {data.opinion}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {data.confidence}% confidence
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Consensus Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Overall Market Consensus
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Bullish Models
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                3/4
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                75% agreement
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Avg Confidence
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                85.75%
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                High confidence
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Market Signal
              </p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                Strong Buy
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Recommended action
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
