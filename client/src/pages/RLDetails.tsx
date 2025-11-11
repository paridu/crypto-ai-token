import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  AlertCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function RLDetails() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Reinforcement Learning Engine
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Advanced AI models learning from market data in real-time
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              icon: Brain,
              label: "Active Models",
              value: "5",
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: TrendingUp,
              label: "Avg Accuracy",
              value: "82.3%",
              color: "from-green-500 to-green-600",
            },
            {
              icon: Zap,
              label: "Training Speed",
              value: "Real-time",
              color: "from-purple-500 to-purple-600",
            },
            {
              icon: Target,
              label: "Reward Signal",
              value: "+$2,450",
              color: "from-orange-500 to-orange-600",
            },
          ].map((item, index) => (
            <Card key={index} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="models" className="w-full">
          <TabsList className="bg-slate-200 dark:bg-slate-700">
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="training">Training Progress</TabsTrigger>
            <TabsTrigger value="rewards">Reward Analysis</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
          </TabsList>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  name: "Deep Q-Network (DQN)",
                  status: "Active",
                  accuracy: "84.2%",
                  trades: 1245,
                  winRate: "72.3%",
                  description:
                    "Learns optimal trading actions through value-based reinforcement learning",
                },
                {
                  name: "Policy Gradient (PPO)",
                  status: "Active",
                  accuracy: "81.5%",
                  trades: 892,
                  winRate: "68.9%",
                  description:
                    "Policy optimization using proximal policy optimization for continuous action spaces",
                },
                {
                  name: "Actor-Critic (A3C)",
                  status: "Training",
                  accuracy: "79.8%",
                  trades: 567,
                  winRate: "65.4%",
                  description:
                    "Combines value and policy methods for faster convergence",
                },
                {
                  name: "Multi-Agent RL",
                  status: "Experimental",
                  accuracy: "77.2%",
                  trades: 234,
                  winRate: "62.1%",
                  description:
                    "Multiple agents cooperating to find optimal trading strategies",
                },
              ].map((model, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {model.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {model.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          model.status === "Active"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : model.status === "Training"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        }`}
                      >
                        {model.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Accuracy
                        </p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          {model.accuracy}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Win Rate
                        </p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          {model.winRate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Total Trades
                        </p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          {model.trades.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Profit
                        </p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          +${(model.trades * 1.2).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-slate-300 dark:border-slate-600"
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Training Progress Tab */}
          <TabsContent value="training" className="space-y-4">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Training Progress & Metrics
              </h3>

              <div className="space-y-8">
                {[
                  {
                    name: "DQN Model",
                    progress: 85,
                    episodes: "45,230 / 50,000",
                    loss: 0.0234,
                  },
                  {
                    name: "PPO Model",
                    progress: 72,
                    episodes: "36,000 / 50,000",
                    loss: 0.0456,
                  },
                  {
                    name: "A3C Model",
                    progress: 58,
                    episodes: "29,000 / 50,000",
                    loss: 0.0678,
                  },
                ].map((model, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {model.name}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {model.episodes}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${model.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>{model.progress}% Complete</span>
                      <span>Loss: {model.loss}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Total Rewards",
                  value: "$12,450",
                  change: "+15.3%",
                  icon: TrendingUp,
                  color: "text-green-600 dark:text-green-400",
                },
                {
                  title: "Avg Reward/Trade",
                  value: "$9.85",
                  change: "+2.1%",
                  icon: Target,
                  color: "text-blue-600 dark:text-blue-400",
                },
                {
                  title: "Max Drawdown",
                  value: "-$2,340",
                  change: "-8.5%",
                  icon: AlertCircle,
                  color: "text-red-600 dark:text-red-400",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {item.title}
                      </h4>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {item.value}
                      </p>
                      <p className={`text-sm mt-1 ${item.color}`}>
                        {item.change}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Reward Distribution
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Profitable Trades", value: 72, color: "bg-green-500" },
                  { label: "Break-even Trades", value: 15, color: "bg-yellow-500" },
                  { label: "Losing Trades", value: 13, color: "bg-red-500" },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">
                        {item.label}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {item.value}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-4">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                RL Strategy Components
              </h3>

              <div className="space-y-6">
                {[
                  {
                    title: "State Space",
                    description:
                      "Market data features: price, volume, volatility, sentiment, technical indicators",
                  },
                  {
                    title: "Action Space",
                    description:
                      "Trading actions: buy, sell, hold with different position sizes and risk levels",
                  },
                  {
                    title: "Reward Function",
                    description:
                      "Profit/loss from trades, risk-adjusted returns, Sharpe ratio optimization",
                  },
                  {
                    title: "Learning Algorithm",
                    description:
                      "Combination of DQN, PPO, and A3C with experience replay and target networks",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
