import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;

  // Security: only allow exactly "XX.pdf" (two digits + .pdf)
  if (!/^\d{2}\.pdf$/.test(file)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const filePath = join(process.cwd(), "public", "quran-pdf", file);
    const buf = await readFile(filePath);

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Content-Length": buf.byteLength.toString(),
        "Cache-Control": "public, max-age=86400, immutable",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
