import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import crypto from 'node:crypto';
import { processRevalidationHandshake } from '@/lib/revalidation';
import type { RevalidationResponse, ApiProblemError } from '@/lib/types';

// Force dynamic execution in Node.js server runtime only
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/revalidate
 * Handles cache invalidation handshakes from the NestJS Outbox processor.
 * Reference: architecture.md Section 7.3 & deployment.md Section 6.5.
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<RevalidationResponse | ApiProblemError>> {
  const signature = req.headers.get('x-gec-signature');
  const timestamp = req.headers.get('x-gec-timestamp');
  const nonce = req.headers.get('x-gec-nonce');

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json(
      {
        status: 400,
        code: 'BODY_READ_ERROR',
        title: 'Unable to read body',
        detail: 'Failed to read request body stream.',
        requestId: crypto.randomUUID(),
      },
      { status: 400 }
    );
  }

  const hmacSecret = process.env.REVALIDATION_HMAC_SECRET;

  const result = await processRevalidationHandshake(
    { signature, timestamp, nonce },
    rawBody,
    hmacSecret,
    {
      onRevalidateTag: (tag: string) => {
        try {
          // Next.js 16 supports profile object { expire: 0 } for immediate purge
          (revalidateTag as unknown as (t: string, p?: unknown) => void)(tag, {
            expire: 0,
          });
        } catch {
          (revalidateTag as unknown as (t: string) => void)(tag);
        }
      },
      onRevalidatePath: (path: string) => {
        try {
          revalidatePath(path);
        } catch (err) {
          console.warn(`[Revalidate] Failed to revalidate path "${path}":`, err);
        }
      },
    }
  );

  return NextResponse.json(result.data, { status: result.status });
}
