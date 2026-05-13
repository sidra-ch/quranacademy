import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "@/components/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const bookings = await prisma.trialBooking.findMany({
    orderBy: { createdAt: "desc" }
  });
  const mediaAssets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <AdminDashboard
      initialBookings={bookings.map((booking) => ({
        ...booking,
        createdAt: booking.createdAt.toISOString(),
        contactedAt: booking.contactedAt?.toISOString() ?? null
      }))}
      initialMedia={mediaAssets.map((asset) => ({
        ...asset,
        createdAt: asset.createdAt.toISOString(),
        updatedAt: asset.updatedAt.toISOString()
      }))}
    />
  );
}
