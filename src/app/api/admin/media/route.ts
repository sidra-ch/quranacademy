import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, assets });
  } catch (error) {
    console.error("Failed to load media assets", error);
    return NextResponse.json(
      { success: false, message: "Could not load media assets." },
      { status: 500 }
    );
  }
}
