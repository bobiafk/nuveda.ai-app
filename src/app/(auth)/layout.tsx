import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[1fr_1.1fr]">
      {/* ── Brand panel ── */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white bg-[oklch(0.10_0.008_250)]">
        {/* Single subtle glow */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 20% 30%, oklch(0.22 0.08 280 / 0.6) 0%, transparent 65%)," +
              "radial-gradient(ellipse at 80% 80%, oklch(0.16 0.06 220 / 0.4) 0%, transparent 55%)",
          }}
        />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5 w-fit group">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap size={15} className="text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white/90">NuvedaAI</span>
        </Link>

        {/* Main statement */}
        <div className="relative z-10 space-y-6">
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/30 font-medium">
            AI Creative Platform
          </p>
          <h1 className="text-[2.6rem] font-display font-semibold leading-[1.08] tracking-[-0.02em] text-white/90">
            Build content<br />at the speed<br />of thought.
          </h1>
          <div className="w-8 h-px bg-white/15" />
          <p className="text-sm text-white/35 leading-relaxed max-w-[22ch]">
            Images. Voice. Music. Video. All in one place.
          </p>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-[11px] text-white/20 tracking-wide">
          © {new Date().getFullYear()} NuvedaAI
        </p>
      </aside>

      {/* ── Form panel ── */}
      <main className="flex items-center justify-center p-8 sm:p-12 min-h-screen">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
