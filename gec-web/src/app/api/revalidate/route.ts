import { revalidatePath, revalidateTag } from 'next/cache';
import { processRevalidationHandshake } from '@/lib/revalidation';

// Receives the API outbox's signed cache-invalidation calls (deployment.md: REVALIDATION_URL).
export async function POST(req: Request) {
  const raw = await req.text();
  const result = await processRevalidationHandshake(
    {
      signature: req.headers.get('x-gec-signature'),
      timestamp: req.headers.get('x-gec-timestamp'),
      nonce: req.headers.get('x-gec-nonce'),
    },
    raw,
    process.env.REVALIDATION_HMAC_SECRET,
    {
      onRevalidateTag: (tag) => revalidateTag(tag, 'max'),
      onRevalidatePath: (path) => revalidatePath(path),
    },
  );
  return Response.json(result.data, { status: result.status });
}
