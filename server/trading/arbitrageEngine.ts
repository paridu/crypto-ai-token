/**
 * Arbitrage Trading Engine
 * Detects and executes profitable arbitrage trades across exchanges
 */

import {
  ExchangeClient,
  ExchangePrice,
  TradeResult,
} from "../exchanges/exchangeClient";

export interface ArbitrageOpportunity {
  symbol: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  spreadPercentage: number;
  potentialProfit: number;
  profitMargin: number;
  timestamp: number;
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

export class ArbitrageEngine {
  private exchanges: Map<string, ExchangeClient> = new Map();
  private minProfitMargin: number = 0.5; // 0.5% minimum profit
  private maxTradeAmount: number = 1000; // Max USD per trade

  constructor(minProfitMargin: number = 0.5, maxTradeAmount: number = 1000) {
    this.minProfitMargin = minProfitMargin;
    this.maxTradeAmount = maxTradeAmount;
  }

  /**
   * Register an exchange client
   */
  registerExchange(exchangeName: string, client: ExchangeClient): void {
    this.exchanges.set(exchangeName.toLowerCase(), client);
  }

  /**
   * Get all registered exchanges
   */
  getExchanges(): string[] {
    return Array.from(this.exchanges.keys());
  }

  /**
   * Detect arbitrage opportunities
   */
  async detectOpportunities(
    symbols: string[]
  ): Promise<ArbitrageOpportunity[]> {
    const opportunities: ArbitrageOpportunity[] = [];

    try {
      // Get prices from all exchanges
      const pricesByExchange: Map<string, Map<string, number>> = new Map();

      const exchangeNames = Array.from(this.exchanges.keys());
      for (const exchangeName of exchangeNames) {
        const client = this.exchanges.get(exchangeName);
        if (!client) continue;
        try {
          const prices = await client.getPrices(symbols);
          const priceMap = new Map<string, number>();

          for (const price of prices) {
            priceMap.set(price.symbol, price.price);
          }

          pricesByExchange.set(exchangeName, priceMap);
        } catch (error) {
          console.error(`Error fetching prices from ${exchangeName}:`, error);
        }
      }

      // Find arbitrage opportunities
      const exchangeList = Array.from(this.exchanges.keys());

      for (const symbol of symbols) {
        for (let i = 0; i < exchangeList.length; i++) {
          for (let j = i + 1; j < exchangeList.length; j++) {
            const exchange1 = exchangeList[i];
            const exchange2 = exchangeList[j];

            const price1 = pricesByExchange.get(exchange1)?.get(symbol);
            const price2 = pricesByExchange.get(exchange2)?.get(symbol);

            if (!price1 || !price2) continue;

            // Check both directions
            if (price1 < price2) {
              const opp = this.calculateOpportunity(
                symbol,
                exchange1,
                exchange2,
                price1,
                price2
              );
              if (opp && opp.profitMargin >= this.minProfitMargin) {
                opportunities.push(opp);
              }
            } else {
              const opp = this.calculateOpportunity(
                symbol,
                exchange2,
                exchange1,
                price2,
                price1
              );
              if (opp && opp.profitMargin >= this.minProfitMargin) {
                opportunities.push(opp);
              }
            }
          }
        }
      }

      // Sort by profit margin
      opportunities.sort((a, b) => b.profitMargin - a.profitMargin);

      return opportunities;
    } catch (error) {
      console.error("Error detecting arbitrage opportunities:", error);
      return [];
    }
  }

  /**
   * Calculate arbitrage opportunity details
   */
  private calculateOpportunity(
    symbol: string,
    buyExchange: string,
    sellExchange: string,
    buyPrice: number,
    sellPrice: number
  ): ArbitrageOpportunity | null {
    const spread = sellPrice - buyPrice;
    const spreadPercentage = (spread / buyPrice) * 100;
    const quantity = this.maxTradeAmount / buyPrice;
    const potentialProfit = quantity * spread;
    const profitMargin = (potentialProfit / this.maxTradeAmount) * 100;

    if (profitMargin < this.minProfitMargin) {
      return null;
    }

    return {
      symbol,
      buyExchange,
      sellExchange,
      buyPrice,
      sellPrice,
      spread,
      spreadPercentage,
      potentialProfit,
      profitMargin,
      timestamp: Date.now(),
    };
  }

  /**
   * Execute arbitrage trade
   */
  async executeArbitrage(
    opportunity: ArbitrageOpportunity,
    quantity: number
  ): Promise<TradeExecution> {
    const tradeId = `arb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const execution: TradeExecution = {
      id: tradeId,
      symbol: opportunity.symbol,
      buyExchange: opportunity.buyExchange,
      sellExchange: opportunity.sellExchange,
      buyPrice: opportunity.buyPrice,
      sellPrice: opportunity.sellPrice,
      quantity,
      status: "pending",
      createdAt: Date.now(),
    };

    try {
      const buyClient = this.exchanges.get(opportunity.buyExchange);
      const sellClient = this.exchanges.get(opportunity.sellExchange);

      if (!buyClient || !sellClient) {
        execution.status = "failed";
        return execution;
      }

      // Place buy order
      console.log(
        `Placing buy order on ${opportunity.buyExchange}: ${quantity} ${opportunity.symbol} @ ${opportunity.buyPrice}`
      );
      const buyResult = await buyClient.placeBuyOrder(
        opportunity.symbol,
        quantity,
        opportunity.buyPrice
      );

      if (!buyResult.success) {
        execution.status = "failed";
        return execution;
      }

      execution.buyOrderId = buyResult.orderId;
      execution.status = "partial";

      // Wait a bit for the buy order to be filled
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Place sell order
      console.log(
        `Placing sell order on ${opportunity.sellExchange}: ${quantity} ${opportunity.symbol} @ ${opportunity.sellPrice}`
      );
      const sellResult = await sellClient.placeSellOrder(
        opportunity.symbol,
        quantity,
        opportunity.sellPrice
      );

      if (!sellResult.success) {
        execution.status = "partial";
        return execution;
      }

      execution.sellOrderId = sellResult.orderId;
      execution.status = "completed";
      execution.completedAt = Date.now();

      // Calculate actual profit
      const actualProfit =
        quantity * opportunity.sellPrice - quantity * opportunity.buyPrice;
      execution.profit = actualProfit;
      execution.profitMargin = (actualProfit / (quantity * opportunity.buyPrice)) * 100;

      return execution;
    } catch (error) {
      console.error("Error executing arbitrage trade:", error);
      execution.status = "failed";
      return execution;
    }
  }

  /**
   * Get trading statistics
   */
  getStatistics(executions: TradeExecution[]): {
    totalTrades: number;
    successfulTrades: number;
    totalProfit: number;
    averageProfitMargin: number;
  } {
    const completedTrades = executions.filter((e) => e.status === "completed");
    const totalProfit = completedTrades.reduce((sum, e) => sum + (e.profit || 0), 0);
    const avgMargin =
      completedTrades.length > 0
        ? completedTrades.reduce((sum, e) => sum + (e.profitMargin || 0), 0) /
          completedTrades.length
        : 0;

    return {
      totalTrades: executions.length,
      successfulTrades: completedTrades.length,
      totalProfit,
      averageProfitMargin: avgMargin,
    };
  }
}
