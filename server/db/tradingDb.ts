/**
 * Trading Database Operations
 * Handle trading execution history and statistics
 */

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from "../_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export interface TradeExecution {
  id: string;
  symbol: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  buyOrderId?: string;
  sellOrderId?: string;
  status: "pending" | "partial" | "completed" | "failed";
  profit?: number;
  profitMargin?: number;
  createdAt: number;
  completedAt?: number;
}

/**
 * Store trade execution in memory (for demo purposes)
 * In production, this would be stored in database
 */
class TradingDatabase {
  private executions: Map<string, TradeExecution> = new Map();

  addExecution(execution: TradeExecution): void {
    this.executions.set(execution.id, execution);
  }

  getExecution(id: string): TradeExecution | undefined {
    return this.executions.get(id);
  }

  getAllExecutions(): TradeExecution[] {
    return Array.from(this.executions.values());
  }

  getExecutionsBySymbol(symbol: string): TradeExecution[] {
    return Array.from(this.executions.values()).filter(
      (e) => e.symbol === symbol
    );
  }

  getCompletedExecutions(): TradeExecution[] {
    return Array.from(this.executions.values()).filter(
      (e) => e.status === "completed"
    );
  }

  updateExecution(id: string, updates: Partial<TradeExecution>): void {
    const execution = this.executions.get(id);
    if (execution) {
      this.executions.set(id, { ...execution, ...updates });
    }
  }

  getStatistics() {
    const all = this.getAllExecutions();
    const completed = this.getCompletedExecutions();
    const totalProfit = completed.reduce((sum, e) => sum + (e.profit || 0), 0);
    const avgMargin =
      completed.length > 0
        ? completed.reduce((sum, e) => sum + (e.profitMargin || 0), 0) /
          completed.length
        : 0;

    return {
      totalExecutions: all.length,
      completedExecutions: completed.length,
      failedExecutions: all.filter((e) => e.status === "failed").length,
      totalProfit,
      averageProfitMargin: avgMargin,
      successRate:
        all.length > 0 ? (completed.length / all.length) * 100 : 0,
    };
  }
}

// Singleton instance
export const tradingDb = new TradingDatabase();
