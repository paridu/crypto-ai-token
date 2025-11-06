import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  TrendingUp,
  AlertCircle,
  Zap,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Wallet,
  Activity,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      description: "Market overview & predictions",
    },
    {
      label: "Watchlist",
      icon: Wallet,
      href: "/watchlist",
      description: "Your favorite cryptos",
    },
    {
      label: "Predictions",
      icon: TrendingUp,
      href: "/predictions",
      description: "AI price forecasts",
    },
    {
      label: "Alerts",
      icon: AlertCircle,
      href: "/alerts",
      description: "Trading notifications",
    },
    {
      label: "Arbitrage",
      icon: BarChart3,
      href: "/arbitrage",
      description: "Cross-exchange opportunities",
    },
    {
      label: "Automated Trading",
      icon: Zap,
      href: "/trading",
      description: "Auto-execution engine",
    },
  ];

  const configItems = [
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      description: "API keys & preferences",
    },
    {
      label: "Portfolio",
      icon: Activity,
      href: "/portfolio",
      description: "Holdings & performance",
    },
  ];

  const isActive = (href: string) => {
    return location === href;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700">
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">CryptoAI</h1>
                <p className="text-xs text-slate-400">Trading Engine</p>
              </div>
            </a>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2 mb-4">
            Main
          </p>

          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-slate-400 group-hover:text-slate-300">
                    {item.description}
                  </p>
                </div>
              </a>
            </Link>
          ))}

          {/* Configuration Section */}
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2 mt-6 mb-4">
            Configuration
          </p>

          {configItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-slate-400 group-hover:text-slate-300">
                    {item.description}
                  </p>
                </div>
              </a>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-700 space-y-3">
          {user && (
            <div className="px-3 py-2 bg-slate-700 rounded-lg">
              <p className="text-xs text-slate-400">Logged in as</p>
              <p className="text-sm font-semibold text-white truncate">
                {user.name || user.email || "User"}
              </p>
            </div>
          )}

          <Button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            variant="outline"
            className="w-full bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
