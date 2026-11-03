import { ProductiveArtboardStage } from "./productiveArtboardStage";

const BG = "#12161f";

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-4 text-[11px] font-semibold text-white">
      <span>9:41</span>
      <span className="tracking-[0.12em] text-white/80">● ● ●</span>
    </div>
  );
}

function WeekStrip({ active = "27" }: { active?: string }) {
  const days = ["24", "25", "26", "27", "28", "29", "30"];
  return (
    <div className="mt-3 flex justify-between px-4">
      {days.map((day) => (
        <span
          key={day}
          className={
            day === active
              ? "flex size-7 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-[#12161f]"
              : "flex size-7 items-center justify-center text-[12px] text-white/55"
          }
        >
          {day}
        </span>
      ))}
    </div>
  );
}

function TabBar() {
  return (
    <div className="absolute inset-x-5 bottom-4 flex items-center justify-between rounded-full bg-white/10 px-4 py-2 text-[10px] text-white/70">
      <span>Today</span>
      <span>Read</span>
      <span>Focus</span>
      <span>Habits</span>
    </div>
  );
}

/** Today planner — first phone in the Bending Spoons file. */
export function ProductiveTodayWireframe({ standalone = false }: { standalone?: boolean }) {
  return (
    <ProductiveArtboardStage bg={BG} standalone={standalone}>
      <StatusBar />
      <p className="px-5 pt-4 text-[28px] font-semibold leading-none text-white">Today</p>
      <WeekStrip />
      <div className="mx-5 mt-5 h-[150px] rounded-[28px] bg-[radial-gradient(circle_at_50%_40%,#ffe08a,transparent_55%),linear-gradient(180deg,#8fd0ff,#3a6b4a)]" />
      <div className="mx-5 mt-4 flex gap-2 text-[11px] font-medium">
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-white/70">Morning</span>
        <span className="rounded-full bg-[#b6f27c] px-3 py-1.5 text-[#163018]">Afternoon</span>
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-white/70">Evening</span>
      </div>
      <div className="mx-5 mt-4 space-y-2">
        <div className="rounded-2xl bg-white/8 px-3 py-3 text-[13px] text-white">Study online</div>
        <div className="rounded-2xl bg-white/8 px-3 py-3 text-[13px] text-white">Sleep for 8 hours</div>
      </div>
      <TabBar />
    </ProductiveArtboardStage>
  );
}

/** Reading list — second phone. */
export function ProductiveReadingWireframe({ standalone = false }: { standalone?: boolean }) {
  return (
    <ProductiveArtboardStage bg="#f4f1ea" standalone={standalone}>
      <div className="text-[#1a1a1a]">
        <div className="flex items-center justify-between px-5 pt-4 text-[11px] font-semibold">
          <span>9:41</span>
          <span className="tracking-[0.12em] opacity-70">● ● ●</span>
        </div>
        <div className="mx-4 mt-4 h-8 rounded-full bg-black/5" />
        <p className="px-5 pt-4 text-[22px] font-semibold">Productive</p>
        <article className="mx-4 mt-3 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="h-[92px] bg-[linear-gradient(120deg,#d7c4a3,#8aa0b4)]" />
          <p className="px-3 py-2 text-[13px] font-semibold leading-tight">How to Be Productive — 15 Days</p>
        </article>
        <article className="mx-4 mt-3 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="h-[92px] bg-[linear-gradient(120deg,#c9b8a4,#6d7c72)]" />
          <p className="px-3 py-2 text-[13px] font-semibold leading-tight">Breaking the Doomscroll Reflex</p>
        </article>
      </div>
    </ProductiveArtboardStage>
  );
}

/** Day 27 session — third phone, opens the dev inspector. */
export function ProductiveDayWireframe({ standalone = false }: { standalone?: boolean }) {
  return (
    <ProductiveArtboardStage bg={BG} standalone={standalone}>
      <StatusBar />
      <p className="px-5 pt-3 text-[22px] font-semibold text-white">Today</p>
      <WeekStrip active="27" />
      <p className="px-5 pt-5 text-[10px] font-semibold tracking-[0.16em] text-white/50">PRIMARY ANCHOR</p>
      <div className="mx-5 mt-2 flex items-center justify-between rounded-[24px] bg-white/8 px-4 py-4">
        <div>
          <p className="text-[28px] font-semibold leading-none text-white">Day 27</p>
          <p className="mt-2 text-[13px] text-white/70">Rhythmic Penguin</p>
        </div>
        <div className="flex size-14 items-center justify-center rounded-full border-4 border-[#b6f27c] text-[13px] font-semibold text-white">
          50%
        </div>
      </div>
      <button
        type="button"
        className="mx-5 mt-4 flex h-11 w-[calc(100%-40px)] items-center justify-center rounded-full bg-[#f0c14a] text-[14px] font-semibold text-[#1c1404]"
      >
        Begin Session
      </button>
      <p className="px-5 pt-4 text-[13px] text-white/80">Active Challenges & habits</p>
      <TabBar />
    </ProductiveArtboardStage>
  );
}

/** Habits — fourth phone. */
export function ProductiveHabitsWireframe({ standalone = false }: { standalone?: boolean }) {
  return (
    <ProductiveArtboardStage bg={BG} standalone={standalone}>
      <StatusBar />
      <p className="px-5 pt-4 text-[22px] font-semibold leading-tight text-white">Active Challenges & Habits</p>
      <p className="px-5 pt-4 text-[10px] font-semibold tracking-[0.14em] text-white/45">3 ACTIVE CHALLENGES</p>
      <div className="mx-5 mt-2 space-y-2">
        <div className="rounded-2xl bg-white/8 px-3 py-3 text-[13px] text-white">7 Days of Focus</div>
        <div className="rounded-2xl bg-white/8 px-3 py-3 text-[13px] text-white">Evening Reset</div>
        <div className="rounded-2xl bg-white/8 px-3 py-3 text-[13px] text-white">Today&apos;s habits</div>
      </div>
      <TabBar />
    </ProductiveArtboardStage>
  );
}
