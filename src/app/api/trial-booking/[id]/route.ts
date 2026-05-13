import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await req.json()) as { contacted?: boolean };

    if (typeof body.contacted !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Invalid contacted value." },
        { status: 400 }
      );
    }

    const booking = await prisma.trialBooking.update({
      where: { id },
      data: {
        contacted: body.contacted,
        contactedAt: body.contacted ? new Date() : null
      }
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Failed to update trial booking", error);
    return NextResponse.json(
      { success: false, message: "Could not update booking." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await prisma.trialBooking.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete trial booking", error);
    return NextResponse.json(
      { success: false, message: "Could not delete booking." },
      { status: 500 }
    );
  }
}
