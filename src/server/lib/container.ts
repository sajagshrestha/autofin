import type { Database } from "@/server/db/connection";
import { db as appDb } from "@/server/db/connection";
import type { CategoryRepository } from "@/server/repositories/category.repository";
import { CategoryRepository as CategoryRepositoryImpl } from "@/server/repositories/category.repository";
import type { GmailOAuthRepository } from "@/server/repositories/gmail-oauth.repository";
import { GmailOAuthRepository as GmailOAuthRepositoryImpl } from "@/server/repositories/gmail-oauth.repository";
import type { InsightsRepository } from "@/server/repositories/insights.repository";
import { InsightsRepository as InsightsRepositoryImpl } from "@/server/repositories/insights.repository";
import type { TransactionRepository } from "@/server/repositories/transaction.repository";
import { TransactionRepository as TransactionRepositoryImpl } from "@/server/repositories/transaction.repository";
import type { UserRepository } from "@/server/repositories/user.repository";
import { UserRepository as UserRepositoryImpl } from "@/server/repositories/user.repository";
import type { DiscordService } from "@/server/services/discord.service";
import { DiscordServiceImpl } from "@/server/services/discord.service";
import type { GmailService } from "@/server/services/gmail.service";
import { GmailService as GmailServiceImpl } from "@/server/services/gmail.service";
import type { InsightsService } from "@/server/services/insights.service";
import { InsightsServiceImpl } from "@/server/services/insights.service";
import type { LoggerService } from "@/server/services/logger.service";
import { LoggerServiceImpl } from "@/server/services/logger.service";
import type { StatementExtractorService } from "@/server/services/statement-extractor.service";
import { StatementExtractorService as StatementExtractorServiceImpl } from "@/server/services/statement-extractor.service";
import type { TransactionExtractorService } from "@/server/services/transaction-extractor.service";
import { TransactionExtractorService as TransactionExtractorServiceImpl } from "@/server/services/transaction-extractor.service";

/**
 * Container interface - defines what dependencies are available.
 * This allows for easy mocking and better type safety.
 */
export interface Container {
	readonly db: Database;
	// Repositories
	readonly userRepo: UserRepository;
	readonly gmailOAuthRepo: GmailOAuthRepository;
	readonly categoryRepo: CategoryRepository;
	readonly transactionRepo: TransactionRepository;
	readonly insightsRepo: InsightsRepository;
	// Services
	readonly loggerService: LoggerService;
	readonly discordService: DiscordService;
	readonly gmailService: GmailService;
	readonly transactionExtractor: TransactionExtractorService;
	readonly statementExtractor: StatementExtractorService;
	readonly insightsService: InsightsService;
}

/**
 * Factory function to create a container with all dependencies.
 *
 * Pure and immutable - easy to test (create multiple instances with mocked
 * repositories) with a clear dependency graph.
 */
export function createContainer(db: Database): Container {
	// Repositories (depend on db)
	const userRepo: UserRepository = new UserRepositoryImpl(db);
	const gmailOAuthRepo: GmailOAuthRepository = new GmailOAuthRepositoryImpl(db);
	const categoryRepo: CategoryRepository = new CategoryRepositoryImpl(db);
	const transactionRepo: TransactionRepository = new TransactionRepositoryImpl(
		db,
	);
	const insightsRepo: InsightsRepository = new InsightsRepositoryImpl(db);

	// Services (depend on db and repositories)
	const loggerService: LoggerService = new LoggerServiceImpl();
	const discordService: DiscordService = new DiscordServiceImpl();
	const transactionExtractor: TransactionExtractorService =
		new TransactionExtractorServiceImpl(loggerService, discordService);
	const statementExtractor: StatementExtractorService =
		new StatementExtractorServiceImpl(loggerService, discordService);
	const gmailService: GmailService = new GmailServiceImpl(
		db,
		gmailOAuthRepo,
		transactionRepo,
		categoryRepo,
		userRepo,
		transactionExtractor,
		discordService,
	);
	const insightsService: InsightsService = new InsightsServiceImpl(
		transactionRepo,
		insightsRepo,
	);

	return {
		db,
		userRepo,
		gmailOAuthRepo,
		categoryRepo,
		transactionRepo,
		insightsRepo,
		loggerService,
		discordService,
		gmailService,
		transactionExtractor,
		statementExtractor,
		insightsService,
	};
}

/**
 * Lazily-instantiated application-wide container.
 *
 * Server functions and route handlers use getContainer() so that the pool and
 * services are created once per server process. The pure createContainer()
 * factory above stays exported for tests.
 */
let instance: Container | null = null;

export function getContainer(): Container {
	if (!instance) {
		instance = createContainer(appDb);
	}
	return instance;
}
