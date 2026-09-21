import { NextResponse } from "next/server";
import type { PublicSubmissionInput, SubmissionType } from "@/lib/content-types";

const API_BASE_URL = (process.env.GEC_API_BASE_URL || "http://localhost:4000").replace(/\/$/, "");
const submissionTypes = new Set<SubmissionType>([
  "initiative_application",
  "recruitment",
  "pitch",
  "contact",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function invalid(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let body: Partial<PublicSubmissionInput>;
  try {
    body = (await request.json()) as Partial<PublicSubmissionInput>;
  } catch {
    return invalid("Please send a valid JSON submission.");
  }

  if (typeof body.submissionType !== "string" || !submissionTypes.has(body.submissionType as SubmissionType)) {
    return invalid("Choose a valid submission type.");
  }
  if (typeof body.applicantName !== "string" || body.applicantName.trim().length < 2 || body.applicantName.length > 120) {
    return invalid("Enter your name.");
  }
  if (typeof body.applicantEmail !== "string" || !isValidEmail(body.applicantEmail) || body.applicantEmail.length > 240) {
    return invalid("Enter a valid email address.");
  }
  if (body.applicantPhone !== undefined && (typeof body.applicantPhone !== "string" || body.applicantPhone.length > 40)) {
    return invalid("Enter a valid phone number.");
  }
  if (!isRecord(body.payload)) return invalid("Add the details needed for this submission.");
  if (body.targetEntityId !== undefined && (typeof body.targetEntityId !== "string" || body.targetEntityId.length > 160)) {
    return invalid("The selected item is not valid.");
  }
  if (body.attachmentKeys !== undefined && (!Array.isArray(body.attachmentKeys) || body.attachmentKeys.some((key) => typeof key !== "string"))) {
    return invalid("One or more attachments are not valid.");
  }

  const payload: PublicSubmissionInput = {
    submissionType: body.submissionType as SubmissionType,
    targetEntityId: body.targetEntityId,
    applicantName: body.applicantName.trim(),
    applicantEmail: body.applicantEmail.trim(),
    applicantPhone: body.applicantPhone?.trim(),
    payload: body.payload,
    attachmentKeys: body.attachmentKeys,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/v1/public/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success) {
      return NextResponse.json(
        { success: false, error: "We could not send that just now. Please try again." },
        { status: response.status >= 400 && response.status < 500 ? response.status : 502 },
      );
    }
    return NextResponse.json({ success: true, submissionId: result.submissionId, message: result.message });
  } catch {
    return NextResponse.json(
      { success: false, error: "Submissions are temporarily unavailable. Please try again shortly." },
      { status: 502 },
    );
  }
}
