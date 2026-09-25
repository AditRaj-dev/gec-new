import { NestFactory } from '@nestjs/core';
// Imported as a module (not read via fs) so `nest build` copies it into dist/
// next to the compiled file — the seed data ships inside dist, no runtime fs
// path back into src required.
import siteContentSeed from './site-content.json';

export type SeedFile = { singletons: Record<string, object>; lists: Record<string, object[]> };
type ContentLike = {
  listPublicContent(entityType: string): Promise<unknown[]>;
  createDraft(dto: { entityType: string; title: string; slug?: string; data: Record<string, any> }, actorId: string): Promise<{ id: string }>;
  publish(id: string, idempotencyKey: string | undefined, actorId: string): Promise<unknown>;
};

const ACTOR = 'system-seed';

/** Publishes the site's fallback content once. Entity types that already have published content are left alone. */
export async function seedSiteContent(content: ContentLike, seed: SeedFile, log: (m: string) => void = () => {}) {
  const created: string[] = [];
  const skipped: string[] = [];
  const docs: [string, object[]][] = [
    ...Object.entries(seed.singletons).map(([t, d]) => [t, [d]] as [string, object[]]),
    ...Object.entries(seed.lists),
  ];
  for (const [type, items] of docs) {
    if ((await content.listPublicContent(type)).length) {
      skipped.push(type);
      log(`skip ${type} (already published)`);
      continue;
    }
    for (const [i, data] of items.entries()) {
      const n = i + 1;
      const title = items.length === 1 && type in seed.singletons ? type : `${type} ${n}`;
      const slug = items.length === 1 && type in seed.singletons ? undefined : `${type}-${n}`;
      const draft = await content.createDraft({ entityType: type, title, ...(slug && { slug }), data: data as Record<string, any> }, ACTOR);
      await content.publish(draft.id, `seed:${type}:${n}`, ACTOR);
    }
    created.push(type);
    log(`seeded ${type} (${items.length})`);
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
