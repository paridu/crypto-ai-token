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
