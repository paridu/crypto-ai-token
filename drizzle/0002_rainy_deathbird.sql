CREATE TABLE `arbitrage_opportunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`asset` varchar(20) NOT NULL,
	`exchangeA` varchar(50) NOT NULL,
	`exchangeB` varchar(50) NOT NULL,
	`priceA` decimal(20,8) NOT NULL,
	`priceB` decimal(20,8) NOT NULL,
	`spread` decimal(10,2) NOT NULL,
	`potentialProfit` varchar(50) NOT NULL,
	`profitMargin` decimal(10,2) NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`detectedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `arbitrage_opportunities_id` PRIMARY KEY(`id`)
);
