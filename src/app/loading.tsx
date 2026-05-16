export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_50%_18%,rgba(212,175,55,0.16),transparent_34%),linear-gradient(180deg,#021311,#052e2b_58%,#020807)] text-white">
      <div className="w-full max-w-xs px-6 text-center">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-[#D4AF37]/60 bg-white/5 shadow-[0_0_44px_rgba(212,175,55,0.22)] backdrop-blur">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[#D4AF37]" />
        </div>
        <div className="mx-auto mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full origin-center rounded-full bg-[linear-gradient(90deg,#0f766e,#D4AF37,#14b8a6)] [animation:route-reveal-pulse_1.15s_ease-in-out_infinite]" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Loading Academy Experience</p>
      </div>
    </div>
  );
}
