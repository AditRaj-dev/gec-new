import { seedSiteContent, SeedFile } from './seed-site-content';

const seed: SeedFile = {
  singletons: { 'home-hero': { campaigns: {} } },
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
    expect(r.created).toEqual(['home-hero', 'speakers']);
    expect(c.createDraft).toHaveBeenCalledTimes(3);
    expect(c.createDraft).toHaveBeenCalledWith(
      { entityType: 'speakers', title: 'speakers 2', slug: 'speakers-2', data: { name: 'B', order: 2 } },
      'system-seed',
    );
    expect(c.publish).toHaveBeenCalledWith('d1', 'seed:home-hero:1', 'system-seed');
  });

  it('skips entity types that are fully seeded', async () => {
    const c = fakeContent({
      'home-hero': [{ id: 'x' }],
      speakers: [{ slug: 'speakers-1' }, { slug: 'speakers-2' }],
    });
    const r = await seedSiteContent(c as any, seed);
    expect(r.skipped).toEqual(['home-hero', 'speakers']);
    expect(r.created).toEqual([]);
    expect(c.createDraft).not.toHaveBeenCalled();
  });

  it('resumes a partially seeded list', async () => {
    // speakers-1 already published (e.g. a crash mid-seed) — only speakers-2 should be created.
    const c = fakeContent({ speakers: [{ slug: 'speakers-1' }] });
    const r = await seedSiteContent(c as any, seed);
    expect(r.created).toEqual(['home-hero', 'speakers']);
    expect(r.skipped).toEqual([]);
    // one createDraft for home-hero + one for the missing speakers-2 only
    expect(c.createDraft).toHaveBeenCalledTimes(2);
    expect(c.createDraft).toHaveBeenCalledWith(
      { entityType: 'speakers', title: 'speakers 2', slug: 'speakers-2', data: { name: 'B', order: 2 } },
      'system-seed',
    );
    expect(c.createDraft).not.toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'speakers-1' }),
      'system-seed',
    );
  });
});
