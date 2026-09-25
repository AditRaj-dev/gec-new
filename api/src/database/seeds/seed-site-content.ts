import { NestFactory } from '@nestjs/core';
// Imported as a module (not read via fs) so `nest build` copies it into dist/
// next to the compiled file — the seed data ships inside dist, no runtime fs
// path back into src required.
import siteContentSeed from './site-content.json';

export type SeedFile = { singletons: Record<string, object>; lists: Record<string, object[]> };
type ContentLike = {
  listPublicContent(entityType: string): Promise<Array<{ slug?: string | null }>>;
  createDraft(dto: { entityType: string; title: string; slug?: string; data: Record<string, any> }, actorId: string): Promise<{ id: string }>;
  publish(id: string, idempotencyKey: string | undefined, actorId: string): Promise<unknown>;
};

const ACTOR = 'system-seed';

/**
 * Publishes the site's fallback content, resumably: a crash mid-list must never leave the
 * rest of that list permanently unseeded. For each type we look at what is already published
 * and create+publish only the seed items whose deterministic slug (`<type>-<n>`) is missing.
 * Singletons have no slug to check per-item — they are one doc, so "already published" (any
 * item exists) is enough to skip.
 */
export async function seedSiteContent(content: ContentLike, seed: SeedFile, log: (m: string) => void = () => {}) {
  const created: string[] = [];
  const skipped: string[] = [];

  for (const [type, data] of Object.entries(seed.singletons)) {
    const published = await content.listPublicContent(type);
    if (published.length) {
      skipped.push(type);
      log(`skip ${type} (already published)`);
      continue;
    }
    const draft = await content.createDraft({ entityType: type, title: type, data: data as Record<string, any> }, ACTOR);
    await content.publish(draft.id, `seed:${type}:1`, ACTOR);
    created.push(type);
    log(`seeded ${type} (1)`);
  }

  for (const [type, items] of Object.entries(seed.lists)) {
    const published = await content.listPublicContent(type);
    const publishedSlugs = new Set(published.map((p) => p?.slug).filter((s): s is string => !!s));
    let createdCount = 0;
    for (const [i, data] of items.entries()) {
      const n = i + 1;
      const slug = `${type}-${n}`;
      if (publishedSlugs.has(slug)) continue;
      const title = `${type} ${n}`;
      const draft = await content.createDraft({ entityType: type, title, slug, data: data as Record<string, any> }, ACTOR);
      await content.publish(draft.id, `seed:${type}:${n}`, ACTOR);
      createdCount++;
    }
    if (createdCount) {
      created.push(type);
      log(`seeded ${type} (${createdCount} of ${items.length})`);
    } else {
      skipped.push(type);
      log(`skip ${type} (already published)`);
    }
  }

  return { created, skipped };
}

// CLI: node dist/src/database/seeds/seed-site-content.js
if (require.main === module) {
  (async () => {
    const { AppModule } = await import('../../app.module');
    const { ContentService } = await import('../../modules/content/content.service');
    const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });
    const seed = siteContentSeed as unknown as SeedFile;
    const r = await seedSiteContent(app.get(ContentService), seed, console.log);
    console.log(`done: ${r.created.length} created, ${r.skipped.length} skipped`);
    await app.close();
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
