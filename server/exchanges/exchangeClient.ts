/**
 * Exchange API Client Interface
 * Unified interface for multiple cryptocurrency exchanges
 */

export interface ExchangePrice {
  symbol: string;
  price: number;
  timestamp: number;
}

export interface ExchangeBalance {
  currency: string;
  available: number;
  locked: number;
  total: number;
}

export interface ExchangeOrder {
  orderId: string;
  symbol: string;
  side: "buy" | "sell";
  price: number;
  quantity: number;
  status: "pending" | "filled" | "canceled";
  timestamp: number;
}

export interface TradeResult {
  success: boolean;
  orderId?: string;
  error?: string;
  message?: string;
}

export abstract class ExchangeClient {
  protected apiKey: string;
  protected apiSecret: string;
  protected exchangeName: string;

  constructor(apiKey: string, apiSecret: string, exchangeName: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.exchangeName = exchangeName;
  }

  abstract getPrice(symbol: string): Promise<ExchangePrice>;
  abstract getPrices(symbols: string[]): Promise<ExchangePrice[]>;
  abstract getBalance(): Promise<ExchangeBalance[]>;
  abstract placeBuyOrder(
    symbol: string,
    quantity: number,
    price?: number
  ): Promise<TradeResult>;
  abstract placeSellOrder(
    symbol: string,
    quantity: number,
    price?: number
  ): Promise<TradeResult>;
  abstract getOrderStatus(orderId: string): Promise<ExchangeOrder | null>;
  abstract cancelOrder(orderId: string): Promise<TradeResult>;
  abstract getExchangeName(): string;
}

/**
 * Binance Exchange Client
 */
export class BinanceClient extends ExchangeClient {
  private baseUrl = "https://api.binance.com/api";

  constructor(apiKey: string, apiSecret: string) {
    super(apiKey, apiSecret, "Binance");
  }

  async getPrice(symbol: string): Promise<ExchangePrice> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v3/ticker/price?symbol=${symbol}USDT`
      );
      const data = await response.json();
      return {
        symbol: symbol,
        price: parseFloat(data.price),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(`Binance getPrice error for ${symbol}:`, error);
      throw error;
    }
  }

  async getPrices(symbols: string[]): Promise<ExchangePrice[]> {
    try {
      const prices: ExchangePrice[] = [];
      for (const symbol of symbols) {
        const price = await this.getPrice(symbol);
        prices.push(price);
      }
      return prices;
    } catch (error) {
      console.error("Binance getPrices error:", error);
      throw error;
    }
  }

  async getBalance(): Promise<ExchangeBalance[]> {
    console.log("Binance getBalance - requires authentication");
    return [];
  }

  async placeBuyOrder(
    symbol: string,
    quantity: number,
    price?: number
  ): Promise<TradeResult> {
    console.log(
      `Binance placeBuyOrder - ${symbol} ${quantity} @ ${price} - requires authentication`
    );
    return {
      success: false,
      error: "Authentication required",
    };
  }

  async placeSellOrder(
    symbol: string,
    quantity: number,
    price?: number
  ): Promise<TradeResult> {
    console.log(
      `Binance placeSellOrder - ${symbol} ${quantity} @ ${price} - requires authentication`
    );
    return {
      success: false,
      error: "Authentication required",
    };
  }

  async getOrderStatus(orderId: string): Promise<ExchangeOrder | null> {
    console.log(`Binance getOrderStatus - ${orderId} - requires authentication`);
    return null;
  }

  async cancelOrder(orderId: string): Promise<TradeResult> {
    console.log(`Binance cancelOrder - ${orderId} - requires authentication`);
    return {
      success: false,
      error: "Authentication required",
    };
  }

  getExchangeName(): string {
    return this.exchangeName;
  }
}

/**
 * Coinbase Exchange Client
 */
export class CoinbaseClient extends ExchangeClient {
  private baseUrl = "https://api.coinbase.com/v2";

  constructor(apiKey: string, apiSecret: string) {
    super(apiKey, apiSecret, "Coinbase");
  }

  async getPrice(symbol: string): Promise<ExchangePrice> {
    try {
      const response = await fetch(
        `${this.baseUrl}/prices/${symbol}-USD/spot`
      );
      const data = await response.json();
      return {
        symbol: symbol,
        price: parseFloat(data.data.amount),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(`Coinbase getPrice error for ${symbol}:`, error);
      throw error;
    }
  }

  async getPrices(symbols: string[]): Promise<ExchangePrice[]> {
    try {
      const prices: ExchangePrice[] = [];
      for (const symbol of symbols) {
        const price = await this.getPrice(symbol);
        prices.push(price);
      }
      return prices;
    } catch (error) {
      console.error("Coinbase getPrices error:", error);
      throw error;
    }
  }

  async getBalance(): Promise<ExchangeBalance[]> {
    console.log("Coinbase getBalance - requires authentication");
    return [];
  }

  async placeBuyOrder(
    symbol: string,
    quantity: number,
    price?: number
  ): Promise<TradeResult> {
    console.log(
      `Coinbase placeBuyOrder - ${symbol} ${quantity} @ ${price} - requires authentication`
    );
    return {
      success: false,
      error: "Authentication required",
    };
  }

  async placeSellOrder(
    symbol: string,
    quantity: number,
    price?: number
  ): Promise<TradeResult> {
    console.log(
      `Coinbase placeSellOrder - ${symbol} ${quantity} @ ${price} - requires authentication`
    );
    return {
      success: false,
      error: "Authentication required",
    };
  }

  async getOrderStatus(orderId: string): Promise<ExchangeOrder | null> {
    console.log(
      `Coinbase getOrderStatus - ${orderId} - requires authentication`
    );
    return null;
  }

  async cancelOrder(orderId: string): Promise<TradeResult> {
    console.log(`Coinbase cancelOrder - ${orderId} - requires authentication`);
    return {
      success: false,
      error: "Authentication required",
    };
  }

  getExchangeName(): string {
    return this.exchangeName;
  }
}

/**
 * Kraken Exchange Client
 */
export class KrakenClient extends ExchangeClient {
  private baseUrl = "https://api.kraken.com/0/public";

  constructor(apiKey: string, apiSecret: string) {
    super(apiKey, apiSecret, "Kraken");
  }

  async getPrice(symbol: string): Promise<ExchangePrice> {
    try {
      const krakenSymbol = `${symbol}USD`;
      const response = await fetch(`${this.baseUrl}/Ticker?pair=${krakenSymbol}`);
      const data = await response.json();

      if (data.result && data.result[krakenSymbol]) {
        const tickerData = data.result[krakenSymbol];
        return {
          symbol: symbol,
          price: parseFloat(tickerData.c[0]),
          timestamp: Date.now(),
        };
      }

      throw new Error(`No data for ${symbol}`);
    } catch (error) {
      console.error(`Kraken getPrice error for ${symbol}:`, error);
      throw error;
    }
  }

  async getPrices(symbols: string[]): Promise<ExchangePrice[]> {
    try {
      const prices: ExchangePrice[] = [];
      for (const symbol of symbols) {
        const price = await this.getPrice(symbol);
        prices.push(price);
      }
      return prices;
    } catch (error) {
      console.error("Kraken getPrices error:", error);
      throw error;
    }
  }

  async getBalance(): Promise<ExchangeBalance[]> {
    console.log("Kraken getBalance - requires authentication");
    return [];
  }

  async placeBuyOrder(
    symbol: string,
    quantity: number,
    price?: number
  ): Promise<TradeResult> {
    console.log(
      `Kraken placeBuyOrder - ${symbol} ${quantity} @ ${price} - requires authentication`
    );
    return {
      success: false,
      error: "Authentication required",
    };
  }

  async placeSellOrder(
    symbol: string,
    quantity: number,
    price?: number
  ): Promise<TradeResult> {
    console.log(
      `Kraken placeSellOrder - ${symbol} ${quantity} @ ${price} - requires authentication`
    );
    return {
      success: false,
      error: "Authentication required",
    };
  }

  async getOrderStatus(orderId: string): Promise<ExchangeOrder | null> {
    console.log(`Kraken getOrderStatus - ${orderId} - requires authentication`);
    return null;
  }

  async cancelOrder(orderId: string): Promise<TradeResult> {
    console.log(`Kraken cancelOrder - ${orderId} - requires authentication`);
    return {
      success: false,
      error: "Authentication required",
    };
  }

  getExchangeName(): string {
    return this.exchangeName;
  }
}

/**
 * Exchange Factory
 */
export class ExchangeFactory {
  static createClient(
    exchange: "binance" | "coinbase" | "kraken",
    apiKey: string,
    apiSecret: string
  ): ExchangeClient {
    switch (exchange.toLowerCase()) {
      case "binance":
        return new BinanceClient(apiKey, apiSecret);
      case "coinbase":
        return new CoinbaseClient(apiKey, apiSecret);
      case "kraken":
        return new KrakenClient(apiKey, apiSecret);
      default:
        throw new Error(`Unknown exchange: ${exchange}`);
    }
  }
}
