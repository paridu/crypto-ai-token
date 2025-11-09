/**
 * Export data utilities for CSV and JSON formats
 */

export interface ExportOptions {
  filename: string;
  format: "csv" | "json";
}

/**
 * Export array of objects to CSV format
 */
export function exportToCSV(
  data: Record<string, any>[],
  filename: string = "export.csv"
) {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === "string" && value.includes(",")) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadFile(blob, filename);
}

/**
 * Export data to JSON format
 */
export function exportToJSON(
  data: Record<string, any> | Record<string, any>[],
  filename: string = "export.json"
) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], {
    type: "application/json;charset=utf-8;",
  });
  downloadFile(blob, filename);
}

/**
 * Helper function to trigger file download
 */
function downloadFile(blob: Blob, filename: string) {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export trading history to CSV
 */
export function exportTradingHistory(
  trades: Array<{
    id: string;
    asset: string;
    type: "buy" | "sell";
    amount: number;
    price: number;
    total: number;
    profit?: number;
    timestamp: Date;
  }>,
  filename: string = `trading-history-${new Date().toISOString().split("T")[0]}.csv`
) {
  const data = trades.map((trade) => ({
    ID: trade.id,
    Asset: trade.asset,
    Type: trade.type.toUpperCase(),
    Amount: trade.amount,
    Price: trade.price,
    Total: trade.total,
    Profit: trade.profit || "-",
    Timestamp: new Date(trade.timestamp).toLocaleString(),
  }));

  exportToCSV(data, filename);
}

/**
 * Export portfolio snapshot to CSV
 */
export function exportPortfolioSnapshot(
  portfolio: Array<{
    asset: string;
    amount: number;
    value: number;
    percentage: number;
  }>,
  filename: string = `portfolio-${new Date().toISOString().split("T")[0]}.csv`
) {
  const data = portfolio.map((item) => ({
    Asset: item.asset,
    Amount: item.amount,
    "Current Value": `$${item.value.toFixed(2)}`,
    Percentage: `${item.percentage.toFixed(2)}%`,
  }));

  exportToCSV(data, filename);
}

/**
 * Export predictions to CSV
 */
export function exportPredictions(
  predictions: Array<{
    asset: string;
    currentPrice: number;
    predictedPrice: number;
    accuracy: number;
    confidence: number;
    signal: string;
  }>,
  filename: string = `predictions-${new Date().toISOString().split("T")[0]}.csv`
) {
  const data = predictions.map((pred) => ({
    Asset: pred.asset,
    "Current Price": `$${pred.currentPrice}`,
    "Predicted Price": `$${pred.predictedPrice}`,
    "Change %": `${(((pred.predictedPrice - pred.currentPrice) / pred.currentPrice) * 100).toFixed(2)}%`,
    Accuracy: `${pred.accuracy}%`,
    Confidence: `${pred.confidence}%`,
    Signal: pred.signal,
  }));

  exportToCSV(data, filename);
}
