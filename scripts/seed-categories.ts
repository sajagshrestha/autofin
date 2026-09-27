import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { categories } from '../src/server/db/schema';

config({ path: '.env' });

/**
 * Predefined categories for transaction classification
 * These are system-wide defaults available to all users
 */
const PREDEFINED_CATEGORIES = [
 { name: 'Rent', icon: '🏠', bucket: 'needs' as const },
 { name: 'Loan', icon: '🤝', bucket: 'needs' as const },
 { name: 'Internet', icon: '🛜', bucket: 'needs' as const },
 { name: 'Mobile topup', icon: '📶', bucket: 'needs' as const },
 { name: 'Insurance', icon: '📑', bucket: 'needs' as const },
 { name: 'Gifts', icon: '🎁', bucket: 'wants' as const },

  { name: 'Food and Dining', icon: '🍽️', bucket: 'wants' as const },
  { name: 'Transportation', icon: '🚗', bucket: 'needs' as const },
  { name: 'Shopping', icon: '🛍️', bucket: 'wants' as const },
  { name: 'Bills and Utilities', icon: '📱', bucket: 'needs' as const },
  { name: 'Entertainment', icon: '🎬', bucket: 'wants' as const },
  { name: 'Healthcare', icon: '🏥', bucket: 'needs' as const },
  { name: 'Travel', icon: '✈️', bucket: 'wants' as const },
  { name: 'Groceries', icon: '🛒', bucket: 'needs' as const },
  { name: 'Transfers', icon: '💸', bucket: 'unassigned' as const },
  { name: 'Salary/Income', icon: '💰', bucket: 'unassigned' as const },
  { name: 'Uncategorized', icon: '❓', bucket: 'unassigned' as const }, // Default fallback category
];

async function seedCategories() {
  const client = postgres(process.env.DATABASE_URL || '');
  const db = drizzle(client);

  try {
    console.log('Checking for existing predefined categories...');

    // Check if categories already exist
    const existingCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.isDefault, true));

    if (existingCategories.length > 0) {
      console.log(`Found ${existingCategories.length} existing predefined categories:`);
      existingCategories.forEach((cat) => {
        console.log(`  - ${cat.icon} ${cat.name}`);
      });

      // Check for missing categories and add them
      const existingNames = new Set(existingCategories.map((c) => c.name));
      const missingCategories = PREDEFINED_CATEGORIES.filter((cat) => !existingNames.has(cat.name));

      if (missingCategories.length > 0) {
        console.log(`\nAdding ${missingCategories.length} missing categories...`);
        const newCategories = missingCategories.map((cat) => ({
          id: crypto.randomUUID(),
          userId: null, // null for predefined categories
          name: cat.name,
          icon: cat.icon,
          bucket: cat.bucket,
          isDefault: true,
          isAiCreated: false, // Predefined categories are not AI-created
        }));

        await db.insert(categories).values(newCategories);
        console.log('✓ Missing categories added successfully');

        newCategories.forEach((cat) => {
          console.log(`  + ${cat.icon} ${cat.name}`);
        });
      } else {
        console.log('\n✓ All predefined categories already exist');
      }
    } else {
      console.log('No predefined categories found. Creating all categories...\n');

      const categoriesToInsert = PREDEFINED_CATEGORIES.map((cat) => ({
        id: crypto.randomUUID(),
        userId: null, // null for predefined categories
        name: cat.name,
        icon: cat.icon,
          bucket: cat.bucket,
        isDefault: true,
        isAiCreated: false, // Predefined categories are not AI-created
      }));

      await db.insert(categories).values(categoriesToInsert);

      console.log(`✓ Created ${categoriesToInsert.length} predefined categories:`);
      categoriesToInsert.forEach((cat) => {
        console.log(`  + ${cat.icon} ${cat.name}`);
      });
    }

    for (const preset of PREDEFINED_CATEGORIES) {
      for (const existing of existingCategories.filter((c) => c.name === preset.name && c.userId === null && c.bucket === 'unassigned')) {
        await db.update(categories).set({ bucket: preset.bucket }).where(eq(categories.id, existing.id));
      }
    }
    console.log('\n✓ Category seeding completed successfully');
  } catch (error) {
    console.error('✗ Failed to seed categories:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedCategories();
