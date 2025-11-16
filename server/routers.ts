import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { tradingRouter } from "./routers/tradingRouter";
import { liveTradeRouter } from "./routers/liveTrading";
import { z } from "zod";
import {
  getCryptoPrices,
  getCryptoPriceBySymbol,
  getLatestPredictions,
  getPredictionsBySymbol,
  getLatestSentimentAnalysis,
  getSentimentBySymbol,
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getUserAlerts,
  createAlert,
  deleteAlert,
  updateAlertStatus,
  getArbitrageOpportunities,
  getArbitrageByAsset,
} from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  crypto: router({
    getPrices: publicProcedure.query(async () => {
      return await getCryptoPrices();
    }),
    getPrice: publicProcedure
      .input(z.object({ symbol: z.string() }))
      .query(async ({ input }) => {
        return await getCryptoPriceBySymbol(input.symbol);
      }),
  }),

  predictions: router({
    getLatest: publicProcedure.query(async () => {
      return await getLatestPredictions();
    }),
    getBySymbol: publicProcedure
      .input(z.object({ symbol: z.string() }))
      .query(async ({ input }) => {
        return await getPredictionsBySymbol(input.symbol);
      }),
  }),

  sentiment: router({
    getLatest: publicProcedure.query(async () => {
      return await getLatestSentimentAnalysis();
    }),
    getBySymbol: publicProcedure
      .input(z.object({ symbol: z.string() }))
      .query(async ({ input }) => {
        return await getSentimentBySymbol(input.symbol);
      }),
  }),

  watchlist: router({
    getList: protectedProcedure.query(async ({ ctx }) => {
      return await getUserWatchlist(ctx.user.id);
    }),
    add: protectedProcedure
      .input(z.object({ cryptoSymbol: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await addToWatchlist(ctx.user.id, input.cryptoSymbol);
        return { success: true };
      }),
    remove: protectedProcedure
      .input(z.object({ cryptoSymbol: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await removeFromWatchlist(ctx.user.id, input.cryptoSymbol);
        return { success: true };
      }),
  }),

  alerts: router({
    getList: protectedProcedure.query(async ({ ctx }) => {
      return await getUserAlerts(ctx.user.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          cryptoSymbol: z.string(),
          alertType: z.enum(["price_above", "price_below", "sentiment_change"]),
          targetPrice: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await createAlert({
          userId: ctx.user.id,
          cryptoSymbol: input.cryptoSymbol,
          alertType: input.alertType,
          targetPrice: input.targetPrice ? String(input.targetPrice) : undefined,
          isActive: 1,
        });
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ alertId: z.number() }))
      .mutation(async ({ input }) => {
        await deleteAlert(input.alertId);
        return { success: true };
      }),
    updateStatus: protectedProcedure
      .input(z.object({ alertId: z.number(), isActive: z.number() }))
      .mutation(async ({ input }) => {
        await updateAlertStatus(input.alertId, input.isActive);
        return { success: true };
      }),
  }),

  arbitrage: router({
    getOpportunities: publicProcedure.query(async () => {
      return await getArbitrageOpportunities();
    }),
    getByAsset: publicProcedure
      .input(z.object({ asset: z.string() }))
      .query(async ({ input }) => {
        return await getArbitrageByAsset(input.asset);
      }),
  }),

  trading: tradingRouter,
  liveTrade: liveTradeRouter,
});

export type AppRouter = typeof appRouter;
