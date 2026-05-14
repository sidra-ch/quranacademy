"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";

type TrialBookingItem = {
  id: string;
  parentName: string;
  parentEmail: string | null;
  childAge: string;
  country: string;
  whatsapp: string;
  preferredTime: string | null;
  message: string | null;
  contacted: boolean;
  contactedAt: string | null;
  createdAt: string;
};

type AdminDashboardProps = {
  initialBookings: TrialBookingItem[];
  initialMedia: MediaAssetItem[];
};

type LeadStatusFilter = "all" | "contacted" | "uncontacted";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function toCsvValue(value: string | number | boolean | null | undefined) {
  const normalized = value ?? "";
  return `"${String(normalized).replaceAll('"', '""')}"`;
}

type UploadedAsset = {
  id: string;
  publicId: string;
  secureUrl: string;
  width: number | null;
  height: number | null;
  format: string | null;
  bytes: number | null;
  folder: string | null;
  originalFilename: string | null;
};

type MediaAssetItem = UploadedAsset & {
  createdAt: string;
  updatedAt: string;
};

export function AdminDashboard({ initialBookings, initialMedia }: AdminDashboardProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatusFilter>("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [bookings, setBookings] = useState(initialBookings);
  const [mediaAssets, setMediaAssets] = useState(initialMedia);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [folderName, setFolderName] = useState("hafiz-kamran-quran-academy");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedAsset, setUploadedAsset] = useState<UploadedAsset | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const countryOptions = useMemo(() => {
    return Array.from(new Set(bookings.map((item) => item.country.trim() || "Unknown"))).sort((a, b) => a.localeCompare(b));
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((item) => {
      const matchesSearch =
        !query ||
        item.parentName.toLowerCase().includes(query) ||
        item.country.toLowerCase().includes(query) ||
        item.whatsapp.toLowerCase().includes(query) ||
        (item.parentEmail ?? "").toLowerCase().includes(query) ||
        (item.preferredTime ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "contacted" && item.contacted) ||
        (statusFilter === "uncontacted" && !item.contacted);

      const matchesCountry = countryFilter === "all" || item.country.trim() === countryFilter;

      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [bookings, countryFilter, search, statusFilter]);

  const totalLeads = bookings.length;
  const contactedCount = bookings.filter((item) => item.contacted).length;
  const uncontactedCount = totalLeads - contactedCount;
  const conversionRate = totalLeads === 0 ? 0 : Math.round((contactedCount / totalLeads) * 100);

  const recentLeadsCount = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return bookings.filter((item) => new Date(item.createdAt).getTime() >= cutoff).length;
  }, [bookings]);

  const handleDeleteMedia = async (assetId: string) => {
    setDeletingMediaId(assetId);

    try {
      const response = await fetch(`/api/admin/media/${assetId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        return;
      }

      setMediaAssets((previous) => previous.filter((asset) => asset.id !== assetId));
    } finally {
      setDeletingMediaId((current) => (current === assetId ? null : current));
    }
  };

  const handleMediaUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadError("");

    if (!selectedFile) {
      setUploadError("Please choose an image to upload.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", folderName.trim() || "hafiz-kamran-quran-academy");

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
        asset?: UploadedAsset & { id: string };
      };

      if (!response.ok || !result.success || !result.asset) {
        setUploadError(result.message ?? "Upload failed.");
        return;
      }

      const asset = result.asset;

      setUploadedAsset(asset);
      setMediaAssets((previous) => [
        {
          id: asset.id,
          publicId: asset.publicId,
          secureUrl: asset.secureUrl,
          width: asset.width,
          height: asset.height,
          format: asset.format,
          bytes: asset.bytes,
          folder: asset.folder,
          originalFilename: asset.originalFilename,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        ...previous.filter((item) => item.publicId !== asset.publicId)
      ]);
      setSelectedFile(null);
    } catch {
      setUploadError("Could not upload the image right now.");
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!uploadedAsset?.secureUrl) {
      return;
    }

    await navigator.clipboard.writeText(uploadedAsset.secureUrl);
  };

  const countryStats = useMemo(() => {
    const map = new Map<string, number>();

    for (const booking of bookings) {
      const country = booking.country.trim() || "Unknown";
      map.set(country, (map.get(country) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [bookings]);

  const handleExportCsv = () => {
    const rows = [
      [
        "Parent Name",
        "Parent Email",
        "Child Age",
        "Country",
        "WhatsApp",
        "Preferred Time",
        "Status",
        "Contacted At",
        "Created At"
      ],
      ...filteredBookings.map((booking) => [
        booking.parentName,
        booking.parentEmail ?? "",
        booking.childAge,
        booking.country,
        booking.whatsapp,
        booking.preferredTime ?? "",
        booking.contacted ? "Contacted" : "Uncontacted",
        booking.contactedAt ? formatDateTime(booking.contactedAt) : "",
        formatDateTime(booking.createdAt)
      ])
    ];

    const csv = rows.map((row) => row.map(toCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `trial-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openWhatsApp = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, "");

    if (!digitsOnly) {
      return;
    }

    window.open(`https://wa.me/${digitsOnly}`, "_blank", "noopener,noreferrer");
  };

  const handleContactedToggle = async (id: string, contacted: boolean) => {
    const response = await fetch(`/api/trial-booking/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ contacted })
    });

    if (!response.ok) {
      return;
    }

    const result = (await response.json()) as {
      success: boolean;
      booking?: TrialBookingItem;
    };

    if (!result.success || !result.booking) {
      return;
    }

    setBookings((previous) => previous.map((item) => (item.id === result.booking?.id ? result.booking : item)));
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/trial-booking/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      return;
    }

    setBookings((previous) => previous.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0a2f2a_0%,#051a17_48%,#020b0a_100%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#D4AF37]">Operations Console</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-white/70">
              Manage free trial leads, follow-ups, and quick outreach from one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Export CSV
            </button>
            <Link
              href="/"
              className="whitespace-nowrap rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              🏠 Homepage
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="whitespace-nowrap rounded-xl border border-rose-300/40 bg-rose-500/15 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-500/25"
            >
              Logout
            </button>
          </div>
        </div>

        <section className="mb-6 rounded-2xl border border-cyan-300/20 bg-white/5 p-5 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Cloudinary Media</p>
              <h2 className="mt-2 text-xl font-semibold">Upload academy images</h2>
              <p className="mt-2 text-sm text-white/65">
                Upload teacher photos, class banners, or blog images. Images are optimized and stored in Cloudinary.
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-xs text-white/60">
              Optimized to WebP automatically
            </div>
          </div>

          <form onSubmit={handleMediaUpload} className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr_auto]">
            <label className="flex cursor-pointer flex-col justify-center rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-white/70 transition hover:bg-white/10">
              <span className="mb-2 text-xs uppercase tracking-[0.15em] text-white/45">Choose Image</span>
              <span className="font-medium text-white">{selectedFile ? selectedFile.name : "Click to select an image"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              />
            </label>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-[0.15em] text-white/45">Cloudinary Folder</label>
              <input
                value={folderName}
                onChange={(event) => setFolderName(event.target.value)}
                placeholder="hafiz-kamran-quran-academy"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none"
              />
              <p className="text-xs text-white/45">Use a folder name like `academy/teachers` or `blog/featured`.</p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="rounded-xl border border-cyan-300/30 bg-cyan-500/15 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/25 disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </form>

          {uploadError ? <p className="mt-4 rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-200">{uploadError}</p> : null}

          {previewUrl ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-[220px_1fr]">
              <div
                className="h-56 overflow-hidden rounded-2xl border border-white/15 bg-black/30 bg-cover bg-center"
                style={{ backgroundImage: `url(${previewUrl})` }}
              />
              <div className="rounded-2xl border border-white/15 bg-black/20 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">Preview Ready</h3>
                <p className="mt-2 text-sm text-white/70">
                  This preview is local only. After upload, Cloudinary will return the permanent URL.
                </p>
              </div>
            </div>
          ) : null}

          {uploadedAsset ? (
            <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Upload Complete</p>
                  <p className="mt-2 text-sm text-white/80">{uploadedAsset.originalFilename ?? uploadedAsset.publicId}</p>
                  <p className="mt-1 text-xs text-white/60">
                    {uploadedAsset.width && uploadedAsset.height ? `${uploadedAsset.width} × ${uploadedAsset.height}` : "Optimized image"}
                    {uploadedAsset.format ? ` • ${uploadedAsset.format}` : ""}
                    {uploadedAsset.bytes ? ` • ${(uploadedAsset.bytes / 1024).toFixed(1)} KB` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs text-white transition hover:bg-white/15"
                >
                  Copy URL
                </button>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-white/15 bg-black/30">
                <div className="relative h-64 w-full">
                  <Image src={uploadedAsset.secureUrl} alt="Uploaded asset" fill className="object-cover" />
                </div>
              </div>
              <div className="mt-3 break-all rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-xs text-white/75">
                {uploadedAsset.secureUrl}
              </div>
            </div>
          ) : null}
        </section>

        <section className="mb-8 rounded-2xl border border-white/15 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Media Library</p>
              <h2 className="mt-2 text-lg font-semibold">Uploaded assets</h2>
            </div>
            <p className="text-sm text-white/60">
              {mediaAssets.length} asset{mediaAssets.length === 1 ? "" : "s"} stored
            </p>
          </div>

          {mediaAssets.length === 0 ? (
            <p className="mt-5 text-sm text-white/60">No uploaded media yet.</p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {mediaAssets.map((asset) => (
                <div key={asset.id} className="overflow-hidden rounded-2xl border border-white/15 bg-black/20">
                  <div className="relative h-48 w-full">
                    <Image src={asset.secureUrl} alt={asset.originalFilename ?? asset.publicId} fill className="object-cover" />
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{asset.originalFilename ?? asset.publicId}</p>
                      <p className="mt-1 break-all text-xs text-white/55">{asset.secureUrl}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-white/60">
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">{asset.folder ?? "default"}</span>
                      {asset.width && asset.height ? (
                        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">
                          {asset.width} × {asset.height}
                        </span>
                      ) : null}
                      {asset.format ? <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">{asset.format}</span> : null}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(asset.secureUrl)}
                        className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs text-white transition hover:bg-white/15"
                      >
                        Copy URL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(asset.id)}
                        disabled={deletingMediaId === asset.id}
                        className="rounded-lg border border-rose-300/40 bg-rose-500/15 px-3 py-2 text-xs text-rose-200 transition hover:bg-rose-500/25 disabled:opacity-60"
                      >
                        {deletingMediaId === asset.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#D4AF37]/30 bg-white/10 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.15em] text-white/65">Total Leads</p>
            <p className="mt-2 text-3xl font-bold text-[#D4AF37]">{totalLeads}</p>
            <p className="mt-2 text-xs text-white/55">All trial requests currently stored.</p>
          </div>
          <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.15em] text-white/65">Contacted</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{contactedCount}</p>
            <p className="mt-2 text-xs text-white/55">Successfully followed up.</p>
          </div>
          <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.15em] text-white/65">Uncontacted</p>
            <p className="mt-2 text-3xl font-bold text-rose-300">{uncontactedCount}</p>
            <p className="mt-2 text-xs text-white/55">Needs attention from staff.</p>
          </div>
          <div className="rounded-2xl border border-cyan-300/30 bg-cyan-500/10 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.15em] text-white/65">Contact Rate</p>
            <p className="mt-2 text-3xl font-bold text-cyan-200">{conversionRate}%</p>
            <p className="mt-2 text-xs text-white/55">Recent outreach performance.</p>
          </div>
        </section>

        <section className="mb-8 grid gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur xl:grid-cols-[1.7fr_1fr_1fr_1fr]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, country, WhatsApp, or preferred time"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/55 outline-none"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as LeadStatusFilter)}
            className="w-full rounded-xl border border-white/20 bg-[#051a17] px-4 py-2.5 text-sm text-white outline-none [&>option]:bg-[#051a17] [&>option]:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="contacted">Contacted</option>
            <option value="uncontacted">Uncontacted</option>
          </select>
          <select
            value={countryFilter}
            onChange={(event) => setCountryFilter(event.target.value)}
            className="w-full rounded-xl border border-white/20 bg-[#051a17] px-4 py-2.5 text-sm text-white outline-none [&>option]:bg-[#051a17] [&>option]:text-white"
          >
            <option value="all">All Countries</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <div className="rounded-xl border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-white/70">
            <span className="block text-xs uppercase tracking-[0.2em] text-white/45">Last 7 days</span>
            <span className="mt-1 block text-base font-semibold text-white">{recentLeadsCount} leads</span>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-white/15 bg-white/5 p-5">
          <h2 className="text-lg font-semibold">Top Countries</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {countryStats.length === 0 ? <p className="text-sm text-white/65">No data yet.</p> : null}
            {countryStats.map(([country, count]) => (
              <div key={country} className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-sm">
                {country}: <span className="text-[#D4AF37]">{count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/15 bg-white/5">
          {/* Mobile card layout - visible below md */}
          <div className="md:hidden divide-y divide-white/10">
            {filteredBookings.length === 0 ? (
              <p className="p-4 text-sm text-white/65">No bookings found.</p>
            ) : filteredBookings.map((booking) => (
              <div key={booking.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{booking.parentName}</p>
                    <p className="truncate text-sm text-white/70">{booking.parentEmail ?? "No email"}</p>
                    <p className="mt-0.5 text-xs text-white/55">Age: {booking.childAge}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${booking.contacted ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"}`}>
                    {booking.contacted ? "Contacted" : "Pending"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Country</p>
                    <p className="text-white/85">{booking.country}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">WhatsApp</p>
                    <p className="text-white/85">{booking.whatsapp}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Preferred Time</p>
                    <p className="text-white/85">{booking.preferredTime ?? "Any time"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Submitted</p>
                    <p className="text-xs text-white/85">{formatDateTime(booking.createdAt)}</p>
                  </div>
                </div>
                {booking.message ? (
                  <p className="rounded-xl bg-white/5 px-3 py-2 text-xs text-white/55">{booking.message}</p>
                ) : null}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => openWhatsApp(booking.whatsapp)}
                    className="rounded-lg border border-cyan-300/40 bg-cyan-500/15 px-3 py-1.5 text-xs text-cyan-100"
                  >
                    WhatsApp
                  </button>
                  {booking.parentEmail ? (
                    <a href={`mailto:${booking.parentEmail}`} className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-center text-xs text-white">
                      Email
                    </a>
                  ) : null}
                  <button
                    onClick={() => handleContactedToggle(booking.id, !booking.contacted)}
                    className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white transition hover:bg-white/15"
                  >
                    {booking.contacted ? "Mark Uncontacted" : "Mark Contacted"}
                  </button>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="rounded-lg border border-rose-300/40 bg-rose-500/15 px-3 py-1.5 text-xs text-rose-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table - hidden on mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/10 text-white/80">
                <tr>
                  <th className="px-4 py-3">Parent</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Preferred</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Contacted At</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-white/10 align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{booking.parentName}</p>
                      <p className="text-white/70">{booking.parentEmail ?? "No email"}</p>
                      <p className="mt-1 text-xs text-white/60">Child Age: {booking.childAge}</p>
                      {booking.message ? <p className="mt-1 max-w-sm text-xs text-white/60">{booking.message}</p> : null}
                    </td>
                    <td className="px-4 py-3">{booking.country}</td>
                    <td className="px-4 py-3 text-white/75">{booking.preferredTime ?? "Any time"}</td>
                    <td className="px-4 py-3">{booking.whatsapp}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs ${booking.contacted ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"}`}>
                        {booking.contacted ? "Contacted" : "Uncontacted"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/75">{booking.contactedAt ? formatDateTime(booking.contactedAt) : "-"}</td>
                    <td className="px-4 py-3 text-white/75">{formatDateTime(booking.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => openWhatsApp(booking.whatsapp)}
                          className="rounded-lg border border-cyan-300/40 bg-cyan-500/15 px-3 py-1 text-xs text-cyan-100"
                        >
                          WhatsApp
                        </button>
                        {booking.parentEmail ? (
                          <a
                            href={`mailto:${booking.parentEmail}`}
                            className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-center text-xs"
                          >
                            Email
                          </a>
                        ) : null}
                        <button
                          onClick={() => handleContactedToggle(booking.id, !booking.contacted)}
                          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-xs transition hover:bg-white/15"
                        >
                          {booking.contacted ? "Mark Uncontacted" : "Mark Contacted"}
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="rounded-lg border border-rose-300/40 bg-rose-500/15 px-3 py-1 text-xs text-rose-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBookings.length === 0 ? <p className="p-4 text-sm text-white/65">No bookings found.</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
