import { seedSiteContent, SeedFile } from './seed-site-content';

const seed: SeedFile = {
  singletons: { hero: { campaigns: {} } },
  lists: { speakers: [{ name: 'A', order: 1 }, { name: 'B', order: 2 }] },
};

function fakeContent(published: Record<string, unknown[]> = {}) {
  let n = 0;
  return {
    listPublicContent: jest.fn(async (type: string) => published[type] ?? []),
    createDraft: jest.fn(async (dto: any) => ({ id: `d${++n}`, ...dto })),
    publish: jest.fn(async () => ({ success: true })),
  };
}

describe('seedSiteContent', () => {
  it('creates and publishes one doc per singleton and one per list item', async () => {
    const c = fakeContent();
    const r = await seedSiteContent(c as any, seed);
    expect(r.created).toEqual(['hero', 'speakers']);
    expect(c.createDraft).toHaveBeenCalledTimes(3);
    expect(c.createDraft).toHaveBeenCalledWith(
      { entityType: 'speakers', title: 'speakers 2', slug: 'speakers-2', data: { name: 'B', order: 2 } },
      'system-seed',
    );
    expect(c.publish).toHaveBeenCalledWith('d1', 'seed:hero:1', 'system-seed');
  });

  it('skips entity types that already have published content', async () => {
    const c = fakeContent({ hero: [{ id: 'x' }] });
    const r = await seedSiteContent(c as any, seed);
    expect(r.skipped).toEqual(['hero']);
    expect(r.created).toEqual(['speakers']);
  });
});
