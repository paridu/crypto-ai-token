CREATE TABLE `crypto_prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`symbol` varchar(20) NOT NULL,
	`name` varchar(100) NOT NULL,
	`currentPrice` decimal(20,8) NOT NULL,
	`priceChange24h` decimal(10,2) NOT NULL,
	`priceChange7d` decimal(10,2) NOT NULL,
	`marketCap` varchar(50),
	`volume24h` varchar(50),
	`lastUpdated` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `crypto_prices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `predictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cryptoSymbol` varchar(20) NOT NULL,
	`predictedPrice` decimal(20,8) NOT NULL,
	`priceMovementDirection` enum('up','down','stable') NOT NULL,
	`accuracy` decimal(5,2) NOT NULL,
	`timeframe` varchar(50) NOT NULL,
	`confidence` decimal(5,2) NOT NULL,
	`predictionDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `predictions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sentiment_analysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cryptoSymbol` varchar(20) NOT NULL,
	`sentimentScore` int NOT NULL,
	`bullishPercentage` decimal(5,2) NOT NULL,
	`bearishPercentage` decimal(5,2) NOT NULL,
	`neutralPercentage` decimal(5,2) NOT NULL,
	`analysisDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sentiment_analysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trading_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cryptoSymbol` varchar(20) NOT NULL,
	`alertType` enum('price_above','price_below','sentiment_change') NOT NULL,
	`targetPrice` decimal(20,8),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trading_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_watchlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cryptoSymbol` varchar(20) NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_watchlist_id` PRIMARY KEY(`id`)
);
