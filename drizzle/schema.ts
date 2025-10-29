import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Cryptocurrency price data table
 */
export const cryptoPrices = mysqlTable("crypto_prices", {
  id: int("id").autoincrement().primaryKey(),
  symbol: varchar("symbol", { length: 20 }).notNull(), // e.g., BTC, ETH, ADA
  name: varchar("name", { length: 100 }).notNull(), // e.g., Bitcoin, Ethereum
  currentPrice: decimal("currentPrice", { precision: 20, scale: 8 }).notNull(),
  priceChange24h: decimal("priceChange24h", { precision: 10, scale: 2 }).notNull(), // percentage
  priceChange7d: decimal("priceChange7d", { precision: 10, scale: 2 }).notNull(), // percentage
  marketCap: varchar("marketCap", { length: 50 }), // can be very large
  volume24h: varchar("volume24h", { length: 50 }), // can be very large
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CryptoPrice = typeof cryptoPrices.$inferSelect;
export type InsertCryptoPrice = typeof cryptoPrices.$inferInsert;

/**
 * AI Predictions table
 */
export const predictions = mysqlTable("predictions", {
  id: int("id").autoincrement().primaryKey(),
  cryptoSymbol: varchar("cryptoSymbol", { length: 20 }).notNull(), // e.g., BTC
  predictedPrice: decimal("predictedPrice", { precision: 20, scale: 8 }).notNull(),
  priceMovementDirection: mysqlEnum("priceMovementDirection", ["up", "down", "stable"]).notNull(),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }).notNull(), // percentage (0-100)
  timeframe: varchar("timeframe", { length: 50 }).notNull(), // e.g., "24h", "7d", "30d"
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(), // percentage (0-100)
  predictionDate: timestamp("predictionDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = typeof predictions.$inferInsert;

/**
 * Market Sentiment Analysis table
 */
export const sentimentAnalysis = mysqlTable("sentiment_analysis", {
  id: int("id").autoincrement().primaryKey(),
  cryptoSymbol: varchar("cryptoSymbol", { length: 20 }).notNull(),
  sentimentScore: int("sentimentScore").notNull(), // 0-100, higher = more bullish
  bullishPercentage: decimal("bullishPercentage", { precision: 5, scale: 2 }).notNull(),
  bearishPercentage: decimal("bearishPercentage", { precision: 5, scale: 2 }).notNull(),
  neutralPercentage: decimal("neutralPercentage", { precision: 5, scale: 2 }).notNull(),
  analysisDate: timestamp("analysisDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SentimentAnalysis = typeof sentimentAnalysis.$inferSelect;
export type InsertSentimentAnalysis = typeof sentimentAnalysis.$inferInsert;

/**
 * User Watchlist table
 */
export const userWatchlist = mysqlTable("user_watchlist", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cryptoSymbol: varchar("cryptoSymbol", { length: 20 }).notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type UserWatchlist = typeof userWatchlist.$inferSelect;
export type InsertUserWatchlist = typeof userWatchlist.$inferInsert;

/**
 * Trading Alerts table
 */
export const tradingAlerts = mysqlTable("trading_alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cryptoSymbol: varchar("cryptoSymbol", { length: 20 }).notNull(),
  alertType: mysqlEnum("alertType", ["price_above", "price_below", "sentiment_change"]).notNull(),
  targetPrice: decimal("targetPrice", { precision: 20, scale: 8 }),
  isActive: int("isActive").default(1).notNull(), // 1 = active, 0 = inactive
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TradingAlert = typeof tradingAlerts.$inferSelect;
export type InsertTradingAlert = typeof tradingAlerts.$inferInsert;