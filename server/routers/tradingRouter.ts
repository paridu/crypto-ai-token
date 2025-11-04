/**
 * Trading Router
 * tRPC procedures for automated trading operations
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { ArbitrageEngine, ArbitrageOpportunity } from "../trading/arbitrageEngine";
import {
  BinanceClient,
  CoinbaseClient,
  KrakenClient,
} from "../exchanges/exchangeClient";
import { tradingDb } from "../db/tradingDb";

// Initialize exchange clients with dummy keys (will be replaced with real ones)
const binanceClient = new BinanceClient("", "");
const coinbaseClient = new CoinbaseClient("", "");
const krakenClient = new KrakenClient("", "");

// Initialize arbitrage engine
const arbitrageEngine = new ArbitrageEngine(0.5, 1000); // 0.5% min profit, $1000 max trade
arbitrageEngine.registerExchange("binance", binanceClient);
arbitrageEngine.registerExchange("coinbase", coinbaseClient);
arbitrageEngine.registerExchange("kraken", krakenClient);

export const tradingRouter = router({
  /**
   * Detect arbitrage opportunities across exchanges
   */
  detectOpportunities: publicProcedure
    .input(z.object({ symbols: z.array(z.string()) }))
    .query(async ({ input }) => {
      try {
        const opportunities = await arbitrageEngine.detectOpportunities(
          input.symbols
        );
        return {
          success: true,
          opportunities,
          count: opportunities.length,
        };
      } catch (error) {
        console.error("Error detecting opportunities:", error);
        return {
          success: false,
          opportunities: [],
          count: 0,
          error: "Failed to detect opportunities",
        };
      }
    }),

  /**
   * Get available exchanges
   */
  getExchanges: publicProcedure.query(() => {
    return {
      exchanges: arbitrageEngine.getExchanges(),
      count: arbitrageEngine.getExchanges().length,
    };
  }),

  /**
   * Execute arbitrage trade
   */
  executeArbitrage: publicProcedure
    .input(
      z.object({
        symbol: z.string(),
        buyExchange: z.string(),
        sellExchange: z.string(),
        buyPrice: z.number(),
        sellPrice: z.number(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const opportunity: ArbitrageOpportunity = {
          symbol: input.symbol,
          buyExchange: input.buyExchange,
          sellExchange: input.sellExchange,
          buyPrice: input.buyPrice,
          sellPrice: input.sellPrice,
          spread: input.sellPrice - input.buyPrice,
          spreadPercentage:
            ((input.sellPrice - input.buyPrice) / input.buyPrice) * 100,
          potentialProfit:
            input.quantity * (input.sellPrice - input.buyPrice),
          profitMargin:
            ((input.sellPrice - input.buyPrice) / input.buyPrice) * 100,
          timestamp: Date.now(),
        };

        const execution = await arbitrageEngine.executeArbitrage(
          opportunity,
          input.quantity
        );

        // Store execution in database
        tradingDb.addExecution(execution);

        return {
          success: execution.status !== "failed",
          execution,
        };
      } catch (error) {
        console.error("Error executing arbitrage:", error);
        return {
          success: false,
          error: "Failed to execute arbitrage trade",
        };
      }
    }),

  /**
   * Get trading history
   */
  getHistory: publicProcedure.query(() => {
    const executions = tradingDb.getAllExecutions();
    const stats = tradingDb.getStatistics();

    return {
      executions,
      statistics: stats,
    };
  }),

  /**
   * Get trading statistics
   */
  getStatistics: publicProcedure.query(() => {
    return tradingDb.getStatistics();
  }),

  /**
   * Get execution by ID
   */
  getExecution: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const execution = tradingDb.getExecution(input.id);
      return {
        execution,
        found: !!execution,
      };
    }),

  /**
   * Get executions by symbol
   */
  getExecutionsBySymbol: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .query(({ input }) => {
      const executions = tradingDb.getExecutionsBySymbol(input.symbol);
      return {
        executions,
        count: executions.length,
      };
    }),

  /**
   * Simulate arbitrage detection (for testing)
   */
  simulateDetection: publicProcedure
    .input(z.object({ symbols: z.array(z.string()) }))
    .query(async ({ input }) => {
      // Simulate opportunities with random data
      const opportunities = input.symbols.map((symbol) => ({
        symbol,
        buyExchange: "Binance",
        sellExchange: "Coinbase",
        buyPrice: Math.random() * 50000 + 30000,
        sellPrice: Math.random() * 50000 + 30000,
        spread: Math.random() * 500,
        spreadPercentage: Math.random() * 2,
        potentialProfit: Math.random() * 100,
        profitMargin: Math.random() * 2,
        timestamp: Date.now(),
      }));

      // Filter by profit margin
      const filtered = opportunities.filter((o) => o.profitMargin >= 0.5);

      return {
        opportunities: filtered,
        count: filtered.length,
      };
    }),
});
