import { NextResponse } from "next/server";
import sharp from "sharp";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

const DEFAULT_FOLDER = "hafiz-kamran-quran-academy";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const folderValue = formData.get("folder");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: "Image file is required." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "Only image files are allowed." }, { status: 400 });
    }

    const folder = typeof folderValue === "string" && folderValue.trim() ? folderValue.trim() : DEFAULT_FOLDER;
    const inputBuffer = Buffer.from(await file.arrayBuffer());

    const optimizedBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({
        width: 2000,
        withoutEnlargement: true,
        fit: "inside"
      })
      .webp({ quality: 82 })
      .toBuffer();

    const uploaded = await uploadBufferToCloudinary(optimizedBuffer, {
      folder,
      publicId: file.name.replace(/\.[^.]+$/, "")
    });

    const asset = await prisma.mediaAsset.upsert({
      where: { publicId: uploaded.public_id },
      update: {
        secureUrl: uploaded.secure_url,
        folder: uploaded.folder ?? folder,
        width: uploaded.width ?? null,
        height: uploaded.height ?? null,
        format: uploaded.format ?? null,
        bytes: uploaded.bytes ?? null,
        originalFilename: uploaded.original_filename ?? file.name
      },
      create: {
        publicId: uploaded.public_id,
        secureUrl: uploaded.secure_url,
        folder: uploaded.folder ?? folder,
        width: uploaded.width ?? null,
        height: uploaded.height ?? null,
        format: uploaded.format ?? null,
        bytes: uploaded.bytes ?? null,
        originalFilename: uploaded.original_filename ?? file.name
      }
    });

    return NextResponse.json({
      success: true,
      asset: {
        id: asset.id,
        publicId: asset.publicId,
        secureUrl: asset.secureUrl,
        width: asset.width,
        height: asset.height,
        format: asset.format,
        bytes: asset.bytes,
        folder: asset.folder,
        originalFilename: asset.originalFilename
      }
    });
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    return NextResponse.json(
      { success: false, message: "Could not upload the image. Please try again." },
      { status: 500 }
    );
  }
}
