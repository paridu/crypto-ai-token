import { drizzle } from "drizzle-orm/mysql2";
import {
  cryptoPrices,
  predictions,
  sentimentAnalysis,
} from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL || "");

async function seed() {
  console.log("Seeding database with sample data...");

  try {
    // Seed crypto prices
    await db.insert(cryptoPrices).values([
      {
        symbol: "BTC",
        name: "Bitcoin",
        currentPrice: "43250.00",
        priceChange24h: "2.45",
        priceChange7d: "5.32",
        marketCap: "850000000000",
        volume24h: "25000000000",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        currentPrice: "2650.00",
        priceChange24h: "1.23",
        priceChange7d: "3.45",
        marketCap: "318000000000",
        volume24h: "15000000000",
      },
      {
        symbol: "ADA",
        name: "Cardano",
        currentPrice: "0.485",
        priceChange24h: "-0.85",
        priceChange7d: "1.20",
        marketCap: "17000000000",
        volume24h: "500000000",
      },
    ]);

    console.log("✓ Crypto prices seeded");

    // Seed predictions
    await db.insert(predictions).values([
      {
        cryptoSymbol: "BTC",
        predictedPrice: "45000.00",
        priceMovementDirection: "up",
        accuracy: "80.21",
        timeframe: "24h",
        confidence: "75.50",
        predictionDate: new Date(),
      },
      {
        cryptoSymbol: "ETH",
        predictedPrice: "2750.00",
        priceMovementDirection: "up",
        accuracy: "78.45",
        timeframe: "24h",
        confidence: "72.30",
        predictionDate: new Date(),
      },
      {
        cryptoSymbol: "ADA",
        predictedPrice: "0.490",
        priceMovementDirection: "stable",
        accuracy: "65.30",
        timeframe: "24h",
        confidence: "60.15",
        predictionDate: new Date(),
      },
    ]);

    console.log("✓ Predictions seeded");

    // Seed sentiment analysis
    await db.insert(sentimentAnalysis).values([
      {
        cryptoSymbol: "BTC",
        sentimentScore: 73,
        bullishPercentage: "65.50",
        bearishPercentage: "20.30",
        neutralPercentage: "14.20",
        analysisDate: new Date(),
      },
      {
        cryptoSymbol: "ETH",
        sentimentScore: 68,
        bullishPercentage: "58.40",
        bearishPercentage: "25.60",
        neutralPercentage: "16.00",
        analysisDate: new Date(),
      },
      {
        cryptoSymbol: "ADA",
        sentimentScore: 55,
        bullishPercentage: "45.20",
        bearishPercentage: "38.80",
        neutralPercentage: "16.00",
        analysisDate: new Date(),
      },
    ]);

    console.log("✓ Sentiment analysis seeded");
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
