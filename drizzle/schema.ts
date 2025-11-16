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

export const arbitrageOpportunities = mysqlTable("arbitrage_opportunities", {
  id: int("id").autoincrement().primaryKey(),
  asset: varchar("asset", { length: 20 }).notNull(),
  exchangeA: varchar("exchangeA", { length: 50 }).notNull(),
  exchangeB: varchar("exchangeB", { length: 50 }).notNull(),
  priceA: decimal("priceA", { precision: 20, scale: 8 }).notNull(),
  priceB: decimal("priceB", { precision: 20, scale: 8 }).notNull(),
  spread: decimal("spread", { precision: 10, scale: 2 }).notNull(),
  potentialProfit: varchar("potentialProfit", { length: 50 }).notNull(),
  profitMargin: decimal("profitMargin", { precision: 10, scale: 2 }).notNull(),
  isActive: int("isActive").default(1).notNull(),
  detectedAt: timestamp("detectedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ArbitrageOpportunity = typeof arbitrageOpportunities.$inferSelect;
export type InsertArbitrageOpportunity = typeof arbitrageOpportunities.$inferInsert;

/**
 * User Exchange Accounts table
 * Stores API keys and connection info for each exchange
 */
export const userExchangeAccounts = mysqlTable("user_exchange_accounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  exchange: mysqlEnum("exchange", ["binance", "coinbase", "kraken"]).notNull(),
  apiKey: text("apiKey").notNull(), // Encrypted
  apiSecret: text("apiSecret").notNull(), // Encrypted
  passphrase: text("passphrase"), // For Kraken
  isActive: int("isActive").default(1).notNull(),
  lastVerified: timestamp("lastVerified"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserExchangeAccount = typeof userExchangeAccounts.$inferSelect;
export type InsertUserExchangeAccount = typeof userExchangeAccounts.$inferInsert;

/**
 * Account Balances table
 * Tracks balance across different exchanges
 */
export const accountBalances = mysqlTable("account_balances", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  exchange: mysqlEnum("exchange", ["binance", "coinbase", "kraken"]).notNull(),
  currency: varchar("currency", { length: 20 }).notNull(), // USDT, USD, etc.
  available: decimal("available", { precision: 20, scale: 8 }).notNull(),
  locked: decimal("locked", { precision: 20, scale: 8 }).notNull(),
  total: decimal("total", { precision: 20, scale: 8 }).notNull(),
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AccountBalance = typeof accountBalances.$inferSelect;
export type InsertAccountBalance = typeof accountBalances.$inferInsert;

/**
 * Live Orders table
 * Tracks all real orders placed on exchanges
 */
export const liveOrders = mysqlTable("live_orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderId: varchar("orderId", { length: 100 }).notNull(), // Exchange order ID
  exchange: mysqlEnum("exchange", ["binance", "coinbase", "kraken"]).notNull(),
  symbol: varchar("symbol", { length: 20 }).notNull(), // e.g., BTC/USDT
  type: mysqlEnum("type", ["buy", "sell"]).notNull(),
  quantity: decimal("quantity", { precision: 20, scale: 8 }).notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "cancelled", "failed"]).notNull(),
  fee: decimal("fee", { precision: 20, scale: 8 }).notNull(),
  total: decimal("total", { precision: 20, scale: 8 }).notNull(),
  executedAt: timestamp("executedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LiveOrder = typeof liveOrders.$inferSelect;
export type InsertLiveOrder = typeof liveOrders.$inferInsert;

/**
 * Trading Performance table
 * Tracks profit/loss and performance metrics
 */
export const tradingPerformance = mysqlTable("trading_performance", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  totalProfit: decimal("totalProfit", { precision: 20, scale: 8 }).notNull().default("0"),
  totalLoss: decimal("totalLoss", { precision: 20, scale: 8 }).notNull().default("0"),
  profitPercentage: decimal("profitPercentage", { precision: 10, scale: 2 }).notNull().default("0"),
  totalTrades: int("totalTrades").notNull().default(0),
  successfulTrades: int("successfulTrades").notNull().default(0),
  failedTrades: int("failedTrades").notNull().default(0),
  winRate: decimal("winRate", { precision: 10, scale: 2 }).notNull().default("0"),
  averageProfit: decimal("averageProfit", { precision: 20, scale: 8 }).notNull().default("0"),
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TradingPerformance = typeof tradingPerformance.$inferSelect;
export type InsertTradingPerformance = typeof tradingPerformance.$inferInsert;
