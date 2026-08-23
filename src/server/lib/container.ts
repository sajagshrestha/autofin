import type { Database } from "@/server/db/connection";
import { db as appDb } from "@/server/db/connection";
import type { CategoryRepository } from "@/server/repositories/category.repository";
import { CategoryRepository as CategoryRepositoryImpl } from "@/server/repositories/category.repository";
import type { GmailOAuthRepository } from "@/server/repositories/gmail-oauth.repository";
import { GmailOAuthRepository as GmailOAuthRepositoryImpl } from "@/server/repositories/gmail-oauth.repository";
import type { LoanRepository } from "@/server/repositories/loan.repository";
import { LoanRepository as LoanRepositoryImpl } from "@/server/repositories/loan.repository";
import type { TransactionRepository } from "@/server/repositories/transaction.repository";
import { TransactionRepository as TransactionRepositoryImpl } from "@/server/repositories/transaction.repository";
import type { UserRepository } from "@/server/repositories/user.repository";
import { UserRepository as UserRepositoryImpl } from "@/server/repositories/user.repository";
import type { UserPreferenceRepository } from "@/server/repositories/user-preference.repository";
import { UserPreferenceRepository as UserPreferenceRepositoryImpl } from "@/server/repositories/user-preference.repository";
import type { DiscordService } from "@/server/services/discord.service";
import { DiscordServiceImpl } from "@/server/services/discord.service";
import type { GmailService } from "@/server/services/gmail.service";
import { GmailService as GmailServiceImpl } from "@/server/services/gmail.service";
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
	readonly userPreferenceRepo: UserPreferenceRepository;
	readonly gmailOAuthRepo: GmailOAuthRepository;
	readonly categoryRepo: CategoryRepository;
	readonly loanRepo: LoanRepository;
	readonly transactionRepo: TransactionRepository;
	// Services
	readonly loggerService: LoggerService;
	readonly discordService: DiscordService;
	readonly gmailService: GmailService;
	readonly transactionExtractor: TransactionExtractorService;
	readonly statementExtractor: StatementExtractorService;
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
	const userPreferenceRepo: UserPreferenceRepository =
		new UserPreferenceRepositoryImpl(db);
	const gmailOAuthRepo: GmailOAuthRepository = new GmailOAuthRepositoryImpl(db);
	const categoryRepo: CategoryRepository = new CategoryRepositoryImpl(db);
	const loanRepo: LoanRepository = new LoanRepositoryImpl(db);
	const transactionRepo: TransactionRepository = new TransactionRepositoryImpl(
		db,
	);

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
		userPreferenceRepo,
		transactionExtractor,
		discordService,
	);
	return {
		db,
		userRepo,
		userPreferenceRepo,
		gmailOAuthRepo,
		categoryRepo,
		loanRepo,
		transactionRepo,
		loggerService,
		discordService,
		gmailService,
		transactionExtractor,
		statementExtractor,
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
