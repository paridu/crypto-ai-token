import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Save, AlertCircle, CheckCircle } from "lucide-react";

export default function Settings() {
  const [showKeys, setShowKeys] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [apiKeys, setApiKeys] = useState({
    binanceKey: "",
    binanceSecret: "",
    coinbaseKey: "",
    coinbaseSecret: "",
    coinbasePassphrase: "",
    krakenKey: "",
    krakenSecret: "",
  });

  const [preferences, setPreferences] = useState({
    minProfitMargin: "0.5",
    maxTradeAmount: "1000",
    autoExecute: false,
    notifyOnTrade: true,
  });

  const handleKeyChange = (key: string, value: string) => {
    setApiKeys({ ...apiKeys, [key]: value });
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences({ ...preferences, [key]: value });
  };

  const handleSaveKeys = () => {
    // In production, this would send to backend securely
    localStorage.setItem("apiKeys", JSON.stringify(apiKeys));
    setSavedMessage("API Keys saved successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("preferences", JSON.stringify(preferences));
    setSavedMessage("Preferences saved successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const exchanges = [
    {
      name: "Binance",
      icon: "🔵",
      keys: ["binanceKey", "binanceSecret"],
      labels: ["API Key", "API Secret"],
      docs: "https://www.binance.com/en/account/api-management",
    },
    {
      name: "Coinbase",
      icon: "🟦",
      keys: ["coinbaseKey", "coinbaseSecret", "coinbasePassphrase"],
      labels: ["API Key", "API Secret", "Passphrase"],
      docs: "https://www.coinbase.com/settings/api",
    },
    {
      name: "Kraken",
      icon: "🟩",
      keys: ["krakenKey", "krakenSecret"],
      labels: ["API Key", "API Secret"],
      docs: "https://www.kraken.com/settings/api",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">
            Configure your API keys and trading preferences
          </p>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">{savedMessage}</p>
            </CardContent>
          </Card>
        )}

        {/* API Keys Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Exchange API Keys</CardTitle>
            <CardDescription>
              Connect your trading accounts securely. Your keys are stored locally and never sent to our servers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {exchanges.map((exchange) => (
              <div key={exchange.name} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{exchange.icon}</span>
                    <div>
                      <h3 className="font-semibold text-slate-900">{exchange.name}</h3>
                      <p className="text-sm text-slate-600">
                        {apiKeys[exchange.keys[0] as keyof typeof apiKeys]
                          ? "✓ Connected"
                          : "Not configured"}
                      </p>
                    </div>
                  </div>
                  <a
                    href={exchange.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Get API Keys →
                  </a>
                </div>

                <div className="space-y-3">
                  {exchange.keys.map((keyName, index) => (
                    <div key={keyName}>
                      <label className="text-sm font-medium text-slate-700 block mb-1">
                        {exchange.labels[index]}
                      </label>
                      <div className="relative">
                        <Input
                          type={showKeys ? "text" : "password"}
                          placeholder={`Enter ${exchange.labels[index]}`}
                          value={apiKeys[keyName as keyof typeof apiKeys]}
                          onChange={(e) => handleKeyChange(keyName, e.target.value)}
                          className="pr-10"
                        />
                        <button
                          onClick={() => setShowKeys(!showKeys)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                        >
                          {showKeys ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button onClick={handleSaveKeys} size="lg" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save API Keys
            </Button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Security Notice</p>
                <p>
                  API keys are stored in your browser's local storage. Never share your API keys with anyone.
                  Consider using API keys with restricted permissions (read-only or trading-only).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Trading Preferences</CardTitle>
            <CardDescription>
              Configure your automated trading parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Minimum Profit Margin (%)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={preferences.minProfitMargin}
                  onChange={(e) =>
                    handlePreferenceChange("minProfitMargin", e.target.value)
                  }
                  placeholder="0.5"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Only execute trades with profit margin above this threshold
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Max Trade Amount (USD)
                </label>
                <Input
                  type="number"
                  value={preferences.maxTradeAmount}
                  onChange={(e) =>
                    handlePreferenceChange("maxTradeAmount", e.target.value)
                  }
                  placeholder="1000"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Maximum amount to invest per trade
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-200 pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.autoExecute}
                  onChange={(e) =>
                    handlePreferenceChange("autoExecute", e.target.checked)
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-slate-700">
                  Auto-execute trades when opportunities are detected
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifyOnTrade}
                  onChange={(e) =>
                    handlePreferenceChange("notifyOnTrade", e.target.checked)
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium text-slate-700">
                  Send notifications when trades are executed
                </span>
              </label>
            </div>

            <Button onClick={handleSavePreferences} size="lg" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
