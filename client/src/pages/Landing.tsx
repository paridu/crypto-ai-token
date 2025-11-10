import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  TrendingUp,
  Zap,
  BarChart3,
  Shield,
  Smartphone,
  Rocket,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">CryptoAI</h1>
          </div>
          <a href={getLoginUrl()}>
            <Button className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl sm:text-6xl font-bold leading-tight">
                  AI-Powered Crypto Trading
                </h2>
                <p className="text-xl text-slate-400">
                  Automated arbitrage detection, real-time market analysis, and intelligent trading strategies powered by advanced AI
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href={getLoginUrl()}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800 w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div>
                  <p className="text-3xl font-bold text-blue-400">80%+</p>
                  <p className="text-sm text-slate-400">Prediction Accuracy</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-400">24/7</p>
                  <p className="text-sm text-slate-400">Automated Trading</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-400">3+</p>
                  <p className="text-sm text-slate-400">Major Exchanges</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-20 blur-3xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <span className="text-sm font-medium">BTC/USD</span>
                    <span className="text-green-400 font-bold">$43,250</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <span className="text-sm font-medium">ETH/USD</span>
                    <span className="text-green-400 font-bold">$2,650</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <span className="text-sm font-medium">Arbitrage Profit</span>
                    <span className="text-blue-400 font-bold">+$1,250</span>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-end justify-around p-4">
                  <div className="w-2 h-8 bg-blue-500 rounded"></div>
                  <div className="w-2 h-16 bg-blue-500 rounded"></div>
                  <div className="w-2 h-12 bg-blue-500 rounded"></div>
                  <div className="w-2 h-20 bg-blue-500 rounded"></div>
                  <div className="w-2 h-14 bg-blue-500 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Powerful Features</h3>
            <p className="text-xl text-slate-400">Everything you need for successful crypto trading</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-700/50 backdrop-blur-xl rounded-2xl border border-slate-600 p-8 hover:border-blue-500 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-xl font-bold mb-2">AI Predictions</h4>
              <p className="text-slate-400">Advanced machine learning models predict price movements with 80%+ accuracy</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-700/50 backdrop-blur-xl rounded-2xl border border-slate-600 p-8 hover:border-purple-500 transition-colors group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-xl font-bold mb-2">Automated Trading</h4>
              <p className="text-slate-400">Execute trades 24/7 with intelligent strategies across multiple exchanges</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-700/50 backdrop-blur-xl rounded-2xl border border-slate-600 p-8 hover:border-green-500 transition-colors group">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-xl font-bold mb-2">Arbitrage Detection</h4>
              <p className="text-slate-400">Instantly identify cross-exchange price differences and profit opportunities</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-700/50 backdrop-blur-xl rounded-2xl border border-slate-600 p-8 hover:border-yellow-500 transition-colors group">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/30 transition-colors">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <h4 className="text-xl font-bold mb-2">Risk Management</h4>
              <p className="text-slate-400">Advanced risk controls with stop-loss, take-profit, and position sizing</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-700/50 backdrop-blur-xl rounded-2xl border border-slate-600 p-8 hover:border-red-500 transition-colors group">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500/30 transition-colors">
                <Smartphone className="w-6 h-6 text-red-400" />
              </div>
              <h4 className="text-xl font-bold mb-2">Real-time Alerts</h4>
              <p className="text-slate-400">Get instant notifications for price movements and trading opportunities</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-700/50 backdrop-blur-xl rounded-2xl border border-slate-600 p-8 hover:border-indigo-500 transition-colors group">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors">
                <Rocket className="w-6 h-6 text-indigo-400" />
              </div>
              <h4 className="text-xl font-bold mb-2">Multi-Exchange</h4>
              <p className="text-slate-400">Seamlessly trade across Binance, Coinbase, Kraken, and more</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">How It Works</h3>
            <p className="text-xl text-slate-400">Simple 3-step process to start automated trading</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Connect Exchanges",
                description: "Link your Binance, Coinbase, or Kraken accounts securely",
              },
              {
                step: "2",
                title: "Configure Strategy",
                description: "Choose your trading strategy and set risk parameters",
              },
              {
                step: "3",
                title: "Start Trading",
                description: "Activate automated trading and watch profits grow 24/7",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-slate-400">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-6 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Assets */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Supported Assets</h3>
            <p className="text-xl text-slate-400">Trade the most popular cryptocurrencies</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { symbol: "BTC", name: "Bitcoin", color: "from-orange-500 to-yellow-500" },
              { symbol: "ETH", name: "Ethereum", color: "from-purple-500 to-indigo-500" },
              { symbol: "BNB", name: "Binance", color: "from-yellow-500 to-orange-500" },
              { symbol: "XRP", name: "Ripple", color: "from-blue-500 to-cyan-500" },
              { symbol: "ADA", name: "Cardano", color: "from-blue-600 to-blue-400" },
              { symbol: "SOL", name: "Solana", color: "from-purple-600 to-pink-500" },
            ].map((asset) => (
              <div
                key={asset.symbol}
                className="bg-slate-700/50 backdrop-blur-xl rounded-xl border border-slate-600 p-4 text-center hover:border-blue-500 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${asset.color} mx-auto mb-2`}></div>
                <p className="font-bold text-sm">{asset.symbol}</p>
                <p className="text-xs text-slate-400">{asset.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-4xl font-bold">Ready to Start Trading?</h3>
            <p className="text-xl text-slate-400">
              Join thousands of traders using CryptoAI to automate their trading and maximize profits
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800 w-full sm:w-auto"
            >
              Schedule Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-700">
            {[
              { icon: CheckCircle, text: "Bank-level Security" },
              { icon: CheckCircle, text: "24/7 Customer Support" },
              { icon: CheckCircle, text: "No Hidden Fees" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                <item.icon className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400">© 2024 CryptoAI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
