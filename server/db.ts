import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  cryptoPrices,
  InsertCryptoPrice,
  predictions,
  sentimentAnalysis,
  userWatchlist,
  tradingAlerts,
  InsertTradingAlert,
  arbitrageOpportunities,
  InsertArbitrageOpportunity,
  userExchangeAccounts,
  InsertUserExchangeAccount,
  accountBalances,
  InsertAccountBalance,
  liveOrders,
  InsertLiveOrder,
  tradingPerformance,
  InsertTradingPerformance,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Crypto Price queries
export async function getCryptoPrices() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(cryptoPrices).orderBy(cryptoPrices.symbol);
}

export async function getCryptoPriceBySymbol(symbol: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(cryptoPrices)
    .where(eq(cryptoPrices.symbol, symbol))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertCryptoPrice(data: InsertCryptoPrice) {
  const db = await getDb();
  if (!db) return;
  await db
    .insert(cryptoPrices)
    .values(data)
    .onDuplicateKeyUpdate({
      set: {
        currentPrice: data.currentPrice,
        priceChange24h: data.priceChange24h,
        priceChange7d: data.priceChange7d,
        marketCap: data.marketCap,
        volume24h: data.volume24h,
        lastUpdated: new Date(),
      },
    });
}

// Prediction queries
export async function getLatestPredictions() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(predictions)
    .orderBy(predictions.cryptoSymbol, predictions.createdAt)
    .limit(10);
}

export async function getPredictionsBySymbol(symbol: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(predictions)
    .where(eq(predictions.cryptoSymbol, symbol))
    .orderBy(predictions.predictionDate);
}

// Sentiment Analysis queries
export async function getLatestSentimentAnalysis() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(sentimentAnalysis)
    .orderBy(sentimentAnalysis.cryptoSymbol, sentimentAnalysis.createdAt)
    .limit(10);
}

export async function getSentimentBySymbol(symbol: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(sentimentAnalysis)
    .where(eq(sentimentAnalysis.cryptoSymbol, symbol))
    .orderBy(sentimentAnalysis.createdAt)
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Watchlist queries
export async function getUserWatchlist(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(userWatchlist)
    .where(eq(userWatchlist.userId, userId));
}

export async function addToWatchlist(userId: number, cryptoSymbol: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(userWatchlist).values({ userId, cryptoSymbol });
}

export async function removeFromWatchlist(userId: number, cryptoSymbol: string) {
  const db = await getDb();
  if (!db) return;
  await db
    .delete(userWatchlist)
    .where(
      and(
        eq(userWatchlist.userId, userId),
        eq(userWatchlist.cryptoSymbol, cryptoSymbol)
      )
    );
}

// Trading Alerts queries
export async function getUserAlerts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(tradingAlerts)
    .where(eq(tradingAlerts.userId, userId))
    .orderBy(tradingAlerts.createdAt);
}

export async function createAlert(data: InsertTradingAlert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(tradingAlerts).values(data);
}

export async function deleteAlert(alertId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(tradingAlerts).where(eq(tradingAlerts.id, alertId));
}

export async function updateAlertStatus(alertId: number, isActive: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(tradingAlerts)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(tradingAlerts.id, alertId));
}

// Arbitrage Opportunities queries
export async function getArbitrageOpportunities() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(arbitrageOpportunities)
    .where(eq(arbitrageOpportunities.isActive, 1))
    .orderBy(arbitrageOpportunities.profitMargin);
}

export async function getArbitrageByAsset(asset: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(arbitrageOpportunities)
    .where(
      and(
        eq(arbitrageOpportunities.asset, asset),
        eq(arbitrageOpportunities.isActive, 1)
      )
    );
}

export async function createArbitrageOpportunity(data: InsertArbitrageOpportunity) {
  const db = await getDb();
  if (!db) return;
  await db.insert(arbitrageOpportunities).values(data);
}

export async function updateArbitrageStatus(opportunityId: number, isActive: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(arbitrageOpportunities)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(arbitrageOpportunities.id, opportunityId));
}


// User Exchange Accounts queries
export async function getUserExchangeAccounts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(userExchangeAccounts)
    .where(eq(userExchangeAccounts.userId, userId));
}

export async function getExchangeAccount(userId: number, exchange: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(userExchangeAccounts)
    .where(
      and(
        eq(userExchangeAccounts.userId, userId),
        eq(userExchangeAccounts.exchange, exchange as any)
      )
    )
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function saveExchangeAccount(data: InsertUserExchangeAccount) {
  const db = await getDb();
  if (!db) return;
  await db
    .insert(userExchangeAccounts)
    .values(data)
    .onDuplicateKeyUpdate({
      set: {
        apiKey: data.apiKey,
        apiSecret: data.apiSecret,
        passphrase: data.passphrase,
        isActive: data.isActive,
        updatedAt: new Date(),
      },
    });
}

// Account Balances queries
export async function getAccountBalances(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(accountBalances)
    .where(eq(accountBalances.userId, userId));
}

export async function getExchangeBalance(userId: number, exchange: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(accountBalances)
    .where(
      and(
        eq(accountBalances.userId, userId),
        eq(accountBalances.exchange, exchange as any)
      )
    );
}

export async function updateAccountBalance(data: InsertAccountBalance) {
  const db = await getDb();
  if (!db) return;
  await db
    .insert(accountBalances)
    .values(data)
    .onDuplicateKeyUpdate({
      set: {
        available: data.available,
        locked: data.locked,
        total: data.total,
        lastUpdated: new Date(),
      },
    });
}

// Live Orders queries
export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(liveOrders)
    .where(eq(liveOrders.userId, userId))
    .orderBy(liveOrders.createdAt);
}

export async function getOrdersByStatus(userId: number, status: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(liveOrders)
    .where(
      and(
        eq(liveOrders.userId, userId),
        eq(liveOrders.status, status as any)
      )
    );
}

export async function createLiveOrder(data: InsertLiveOrder) {
  const db = await getDb();
  if (!db) return;
  await db.insert(liveOrders).values(data);
}

export async function updateOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(liveOrders)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(liveOrders.id, orderId));
}

// Trading Performance queries
export async function getTradingPerformance(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(tradingPerformance)
    .where(eq(tradingPerformance.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function initializeTradingPerformance(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(tradingPerformance).values({
    userId,
    totalProfit: "0",
    totalLoss: "0",
    profitPercentage: "0",
    totalTrades: 0,
    successfulTrades: 0,
    failedTrades: 0,
    winRate: "0",
    averageProfit: "0",
  });
}

export async function updateTradingPerformance(
  userId: number,
  updates: Partial<InsertTradingPerformance>
) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(tradingPerformance)
    .set({ ...updates, lastUpdated: new Date() })
    .where(eq(tradingPerformance.userId, userId));
}
