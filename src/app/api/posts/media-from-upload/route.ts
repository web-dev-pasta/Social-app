import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import z from "zod";

const bodySchema = z.object({
  url: z.string().url(),
  mimeType: z.string().min(1),
});

function isTrustedUploadHost(hostname: string) {
  return (
    hostname === "utfs.io" ||
    hostname.endsWith(".utfs.io") ||
    hostname.endsWith("uploadthing.com") ||
    hostname.endsWith(".uploadthing.com")
  );
}

/**
 * Fallback when UploadThing finishes the file upload but `onUploadComplete` does not
 * return `serverData` (e.g. serverless DB timeout). Idempotent by `url`.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ error: "Invalid body" }, { status: 400 });
    }

    const { url, mimeType } = parsed.data;
    let host: string;
    try {
      host = new URL(url).hostname.toLowerCase();
    } catch {
      return Response.json({ error: "Invalid URL" }, { status: 400 });
    }
    if (!isTrustedUploadHost(host)) {
      return Response.json({ error: "URL not allowed" }, { status: 400 });
    }

    const type = mimeType.startsWith("video") ? "VIDEO" : "IMAGE";

    const existing = await prisma.media.findFirst({
      where: { url },
      select: { id: true },
    });
    if (existing) {
      return Response.json({ mediaId: existing.id });
    }

    const media = await prisma.media.create({
      data: { url, type },
      select: { id: true },
    });

    return Response.json({ mediaId: media.id });
  } catch (error) {
    console.error("[media-from-upload]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
