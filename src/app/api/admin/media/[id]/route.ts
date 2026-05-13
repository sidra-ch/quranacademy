import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const asset = await prisma.mediaAsset.findUnique({
      where: { id }
    });

    if (!asset) {
      return NextResponse.json({ success: false, message: "Media asset not found." }, { status: 404 });
    }

    await deleteFromCloudinary(asset.publicId);
    await prisma.mediaAsset.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete media asset", error);
    return NextResponse.json(
      { success: false, message: "Could not delete media asset." },
      { status: 500 }
    );
  }
}
