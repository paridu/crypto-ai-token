import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getUserExchangeAccounts,
  getExchangeAccount,
  saveExchangeAccount,
  getAccountBalances,
  getExchangeBalance,
  updateAccountBalance,
  getUserOrders,
  getOrdersByStatus,
  createLiveOrder,
  updateOrderStatus,
  getTradingPerformance,
  initializeTradingPerformance,
  updateTradingPerformance,
} from "../db";
import { TRPCError } from "@trpc/server";

export const liveTradeRouter = router({
  // Exchange Account Management
  getExchangeAccounts: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await getUserExchangeAccounts(ctx.user.id);
    } catch (error) {
      console.error("Error fetching exchange accounts:", error);
      return [];
    }
  }),

  connectExchange: protectedProcedure
    .input(
      z.object({
        exchange: z.enum(["binance", "coinbase", "kraken"]),
        apiKey: z.string().min(1),
        apiSecret: z.string().min(1),
        passphrase: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // In production, encrypt the API keys before storing
        await saveExchangeAccount({
          userId: ctx.user.id,
          exchange: input.exchange,
          apiKey: input.apiKey,
          apiSecret: input.apiSecret,
          passphrase: input.passphrase,
          isActive: 1,
        });

        return { success: true, message: `Connected to ${input.exchange}` };
      } catch (error) {
        console.error("Error connecting exchange:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to connect exchange account",
        });
      }
    }),

  disconnectExchange: protectedProcedure
    .input(z.object({ exchange: z.enum(["binance", "coinbase", "kraken"]) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const account = await getExchangeAccount(ctx.user.id, input.exchange);
        if (!account) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Exchange account not found",
          });
        }

        // Mark as inactive instead of deleting
        await saveExchangeAccount({
          ...account,
          isActive: 0,
        });

        return { success: true, message: `Disconnected from ${input.exchange}` };
      } catch (error) {
        console.error("Error disconnecting exchange:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to disconnect exchange account",
        });
      }
    }),

  // Account Balances
  getBalances: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await getAccountBalances(ctx.user.id);
    } catch (error) {
      console.error("Error fetching balances:", error);
      return [];
    }
  }),

  getExchangeBalances: protectedProcedure
    .input(z.object({ exchange: z.enum(["binance", "coinbase", "kraken"]) }))
    .query(async ({ ctx, input }) => {
      try {
        return await getExchangeBalance(ctx.user.id, input.exchange);
      } catch (error) {
        console.error("Error fetching exchange balances:", error);
        return [];
      }
    }),

  updateBalance: protectedProcedure
    .input(
      z.object({
        exchange: z.enum(["binance", "coinbase", "kraken"]),
        currency: z.string(),
        available: z.string(),
        locked: z.string(),
        total: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await updateAccountBalance({
          userId: ctx.user.id,
          exchange: input.exchange,
          currency: input.currency,
          available: input.available,
          locked: input.locked,
          total: input.total,
        });

        return { success: true };
      } catch (error) {
        console.error("Error updating balance:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update balance",
        });
      }
    }),

  // Live Orders
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await getUserOrders(ctx.user.id);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }),

  getOrdersByStatus: protectedProcedure
    .input(z.object({ status: z.enum(["pending", "completed", "cancelled", "failed"]) }))
    .query(async ({ ctx, input }) => {
      try {
        return await getOrdersByStatus(ctx.user.id, input.status);
      } catch (error) {
        console.error("Error fetching orders by status:", error);
        return [];
      }
    }),

  placeOrder: protectedProcedure
    .input(
      z.object({
        exchange: z.enum(["binance", "coinbase", "kraken"]),
        orderId: z.string(),
        symbol: z.string(),
        type: z.enum(["buy", "sell"]),
        quantity: z.string(),
        price: z.string(),
        fee: z.string(),
        total: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await createLiveOrder({
          userId: ctx.user.id,
          orderId: input.orderId,
          exchange: input.exchange,
          symbol: input.symbol,
          type: input.type,
          quantity: input.quantity,
          price: input.price,
          status: "pending",
          fee: input.fee,
          total: input.total,
        });

        return { success: true, message: "Order placed successfully" };
      } catch (error) {
        console.error("Error placing order:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to place order",
        });
      }
    }),

  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum(["pending", "completed", "cancelled", "failed"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await updateOrderStatus(input.orderId, input.status);
        return { success: true };
      } catch (error) {
        console.error("Error updating order status:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update order status",
        });
      }
    }),

  // Trading Performance
  getPerformance: protectedProcedure.query(async ({ ctx }) => {
    try {
      let performance = await getTradingPerformance(ctx.user.id);

      // Initialize if doesn't exist
      if (!performance) {
        await initializeTradingPerformance(ctx.user.id);
        performance = await getTradingPerformance(ctx.user.id);
      }

      return performance;
    } catch (error) {
      console.error("Error fetching performance:", error);
      return null;
    }
  }),

  updatePerformance: protectedProcedure
    .input(
      z.object({
        totalProfit: z.string().optional(),
        totalLoss: z.string().optional(),
        profitPercentage: z.string().optional(),
        totalTrades: z.number().optional(),
        successfulTrades: z.number().optional(),
        failedTrades: z.number().optional(),
        winRate: z.string().optional(),
        averageProfit: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await updateTradingPerformance(ctx.user.id, input);
        return { success: true };
      } catch (error) {
        console.error("Error updating performance:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update performance",
        });
      }
    }),
});
