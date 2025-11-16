CREATE TABLE `account_balances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`exchange` enum('binance','coinbase','kraken') NOT NULL,
	`currency` varchar(20) NOT NULL,
	`available` decimal(20,8) NOT NULL,
	`locked` decimal(20,8) NOT NULL,
	`total` decimal(20,8) NOT NULL,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `account_balances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `live_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderId` varchar(100) NOT NULL,
	`exchange` enum('binance','coinbase','kraken') NOT NULL,
	`symbol` varchar(20) NOT NULL,
	`type` enum('buy','sell') NOT NULL,
	`quantity` decimal(20,8) NOT NULL,
	`price` decimal(20,8) NOT NULL,
	`status` enum('pending','completed','cancelled','failed') NOT NULL,
	`fee` decimal(20,8) NOT NULL,
	`total` decimal(20,8) NOT NULL,
	`executedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `live_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trading_performance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalProfit` decimal(20,8) NOT NULL DEFAULT '0',
	`totalLoss` decimal(20,8) NOT NULL DEFAULT '0',
	`profitPercentage` decimal(10,2) NOT NULL DEFAULT '0',
	`totalTrades` int NOT NULL DEFAULT 0,
	`successfulTrades` int NOT NULL DEFAULT 0,
	`failedTrades` int NOT NULL DEFAULT 0,
	`winRate` decimal(10,2) NOT NULL DEFAULT '0',
	`averageProfit` decimal(20,8) NOT NULL DEFAULT '0',
	`lastUpdated` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trading_performance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_exchange_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`exchange` enum('binance','coinbase','kraken') NOT NULL,
	`apiKey` text NOT NULL,
	`apiSecret` text NOT NULL,
	`passphrase` text,
	`isActive` int NOT NULL DEFAULT 1,
	`lastVerified` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_exchange_accounts_id` PRIMARY KEY(`id`)
);
