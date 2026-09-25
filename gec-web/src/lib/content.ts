import { fetchPublishedProjection } from './api';
import { pickList, pickSingleton } from './contentPick';

// Reads CMS-published content. The cache tag is the entity type, which is what the API's
// publish() emits, so /api/revalidate refreshes these reads.
const read = (entityType: string) =>
  fetchPublishedProjection<unknown>(`/v1/public/content/${entityType}`, entityType, null);

export async function getSingleton<T extends object>(entityType: string, fallback: T): Promise<T> {
  return pickSingleton(await read(entityType), fallback);
}

export async function getList<T>(entityType: string, fallback: T[]): Promise<T[]> {
  return pickList(await read(entityType), fallback);
}
