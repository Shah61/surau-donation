import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// MASJID DONATION - PUBLIC / DONOR PAGE
// ============================================================

type EventItem = {
  id: number;
  title: string;
  category: string;
  description: string;
  target: number;
  collected: number;
  startDate: string;
  endDate: string;
  status: string;
  image: string;
  donors: number;
};

type RecentDonor = {
  name: string;
  amount: number;
  event: string;
  date: string;
  anonymous: boolean;
};

const EVENTS: EventItem[] = [
  {
    id: 1,
    title: "Qurban Hari Raya Haji 2025",
    category: "Qurban",
    description: "Sumbangan untuk program korban sempena Hari Raya Aidiladha. Lembu dan kambing untuk diagihkan kepada asnaf.",
    target: 50000,
    collected: 37500,
    startDate: "2025-01-15",
    endDate: "2025-06-06",
    status: "active",
    image: "🐄",
    donors: 48,
  },
  {
    id: 2,
    title: "Waqaf Pembesaran Masjid",
    category: "Waqaf",
    description: "Dana pembinaan untuk membesarkan ruang solat utama masjid bagi menampung lebih ramai jemaah.",
    target: 200000,
    collected: 124800,
    startDate: "2024-06-01",
    endDate: "2025-12-31",
    status: "active",
    image: "🕌",
    donors: 215,
  },
  {
    id: 3,
    title: "Tabung Anak Yatim",
    category: "Kebajikan",
    description: "Sumbangan bulanan untuk menyara anak-anak yatim di bawah jagaan masjid.",
    target: 12000,
    collected: 12000,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "completed",
    image: "🤲",
    donors: 89,
  },
  {
    id: 4,
    title: "Penyelenggaraan Ramadan 2025",
    category: "Ramadan",
    description: "Dana untuk program berbuka puasa, moreh, dan aktiviti ibadah sepanjang bulan Ramadan.",
    target: 30000,
    collected: 8200,
    startDate: "2025-02-01",
    endDate: "2025-04-01",
    status: "active",
    image: "🌙",
    donors: 34,
  },
  {
    id: 5,
    title: "Kelas Mengaji & Tahfiz",
    category: "Pendidikan",
    description: "Sumbangan untuk kelas Al-Quran mingguan dan program hafazan untuk kanak-kanak dan dewasa.",
    target: 8000,
    collected: 5600,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "active",
    image: "📖",
    donors: 62,
  },
  {
    id: 6,
    title: "Sumbangan Am Masjid",
    category: "Am",
    description: "Tabung am masjid untuk penyelenggaraan harian termasuk bil elektrik, air, dan kebersihan.",
    target: 24000,
    collected: 18900,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "active",
    image: "💚",
    donors: 143,
  },
];

const RECENT_DONORS: RecentDonor[] = [
  { name: "Ahmad bin Hassan", amount: 500, event: "Waqaf Pembesaran Masjid", date: "2025-02-15", anonymous: false },
  { name: "Penderma", amount: 1000, event: "Qurban Hari Raya Haji 2025", date: "2025-02-14", anonymous: true },
  { name: "Siti Aminah", amount: 200, event: "Penyelenggaraan Ramadan 2025", date: "2025-02-14", anonymous: false },
  { name: "Mohd Razif", amount: 100, event: "Kelas Mengaji & Tahfiz", date: "2025-02-13", anonymous: false },
  { name: "Penderma", amount: 2000, event: "Waqaf Pembesaran Masjid", date: "2025-02-13", anonymous: true },
  { name: "Nurul Izzah", amount: 150, event: "Sumbangan Am Masjid", date: "2025-02-12", anonymous: false },
];

const CATEGORIES = ["Semua", "Qurban", "Waqaf", "Kebajikan", "Ramadan", "Pendidikan", "Am"];

function formatCurrency(amount: number) {
  return `RM ${amount.toLocaleString("ms-MY")}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ms-MY", { day: "numeric", month: "short", year: "numeric" });
}

// --- COMPONENTS ---

function ProgressBar({ collected, target }: { collected: number; target: number }) {
  const pct = Math.min((collected / target) * 100, 100);
  return (
    <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${pct}%`,
          background: pct >= 100 ? "linear-gradient(90deg, #16a34a, #22c55e)" : "linear-gradient(90deg, #0d7c5f, #10b981)",
        }}
      />
    </div>
  );
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "active" | "completed" | "category" }) {
  const styles: Record<string, string> = {
    default: "bg-emerald-100 text-emerald-800",
    active: "bg-emerald-100 text-emerald-800",
    completed: "bg-stone-200 text-stone-600",
    category: "bg-amber-50 text-amber-800 border border-amber-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant] || styles.default}`}>
      {children}
    </span>
  );
}

function EventCard({ event, onDonate }: { event: EventItem; onDonate: (e: EventItem) => void }) {
  const pct = Math.min(Math.round((event.collected / event.target) * 100), 100);
  const isCompleted = event.status === "completed";

  return (
    <div className={`group relative bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/5 hover:-translate-y-0.5 ${isCompleted ? "opacity-75" : ""}`}>
      <div className="h-1 w-full" style={{ background: isCompleted ? "#a8a29e" : "linear-gradient(90deg, #0d7c5f, #10b981, #0d7c5f)" }} />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="text-3xl">{event.image}</div>
          <div className="flex gap-2 flex-wrap justify-end">
            <Badge variant="category">{event.category}</Badge>
            <Badge variant={event.status as "active" | "completed"}>{isCompleted ? "Selesai" : "Aktif"}</Badge>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-stone-900 mb-2 leading-tight">{event.title}</h3>
        <p className="text-sm text-stone-500 mb-4 line-clamp-2">{event.description}</p>

        <div className="mb-3">
          <ProgressBar collected={event.collected} target={event.target} />
        </div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-semibold text-emerald-700">{formatCurrency(event.collected)}</span>
          <span className="text-stone-400">daripada {formatCurrency(event.target)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-stone-400 mb-5">
          <span>{event.donors} penderma</span>
          <span>{pct}% tercapai</span>
        </div>

        <div className="text-xs text-stone-400 mb-4">
          📅 {formatDate(event.startDate)} — {formatDate(event.endDate)}
        </div>

        {!isCompleted ? (
          <button
            onClick={() => onDonate(event)}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:shadow-md active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #0d7c5f, #10b981)" }}
          >
            Derma Sekarang
          </button>
        ) : (
          <div className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-center text-stone-400 bg-stone-100">
            Kutipan Selesai ✓
          </div>
        )}
      </div>
    </div>
  );
}

function DonationModal({
  event,
  onClose,
  onProceedToPay,
}: {
  event: EventItem;
  onClose: () => void;
  onProceedToPay: (params: { amount: number; name: string; phone: string }) => void;
}) {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const presets = [10, 50, 100, 500];
  const amountNum = Number(amount);
  const canSubmit = amountNum > 0 && name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onProceedToPay({ amount: amountNum, name: name.trim(), phone: phone.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-1" style={{ background: "linear-gradient(90deg, #0d7c5f, #10b981, #0d7c5f)" }} />
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Borang Derma</h3>
              <p className="text-xs text-stone-400 mt-0.5">{event.title}</p>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none p-1">✕</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Jumlah (RM)</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => setAmount(String(p))}
                    className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                      amount === String(p) ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-stone-200 text-stone-600 hover:border-emerald-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Atau masukkan jumlah lain..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Nama Penuh *</label>
              <input
                type="text"
                placeholder="Nama anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">No. Telefon</label>
              <input
                type="tel"
                placeholder="012-3456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #0d7c5f, #10b981)" }}
            >
              Teruskan ke FPX {amount ? formatCurrency(amountNum) : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentDonorRow({ donor, index }: { donor: RecentDonor; index: number }) {
  return (
    <div
      className="flex items-center gap-3 py-3 border-b border-stone-100 last:border-0"
      style={{ animation: `fadeSlideIn 0.4s ease-out ${index * 0.05}s both` }}
    >
      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-semibold text-emerald-700 shrink-0">
        {donor.anonymous ? "?" : donor.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-stone-800 truncate">{donor.anonymous ? "Penderma Tanpa Nama" : donor.name}</div>
        <div className="text-xs text-stone-400 truncate">{donor.event}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-semibold text-emerald-700">{formatCurrency(donor.amount)}</div>
        <div className="text-xs text-stone-400">{formatDate(donor.date)}</div>
      </div>
    </div>
  );
}

// --- MAIN PAGE ---

export default function UserDonationPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [donatingEvent, setDonatingEvent] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleProceedToPay = (params: { amount: number; name: string; phone: string }) => {
    if (!donatingEvent) return;
    navigate("/user/pay", {
      state: {
        amount: params.amount,
        eventTitle: donatingEvent.title,
        eventId: donatingEvent.id,
        name: params.name,
        phone: params.phone,
      },
    });
    setDonatingEvent(null);
  };

  const filtered = EVENTS.filter((e) => {
    const matchCategory = selectedCategory === "Semua" || e.category === selectedCategory;
    const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalCollected = EVENTS.reduce((s, e) => s + e.collected, 0);
  const totalDonors = EVENTS.reduce((s, e) => s + e.donors, 0);
  const activeEvents = EVENTS.filter((e) => e.status === "active").length;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* HERO */}
      <header className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #064e3b, #065f46, #047857)" }}>
        <div
          className="hero-pattern absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23ffffff08' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-6" style={{ animation: "fadeIn 0.6s ease-out" }}>
            <span className="text-3xl">🕌</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3" style={{ animation: "fadeSlideIn 0.6s ease-out 0.1s both" }}>
            Masjid Al-Ehsan
          </h1>
          <p className="text-emerald-200 text-sm sm:text-base max-w-md mx-auto mb-8" style={{ animation: "fadeSlideIn 0.6s ease-out 0.2s both" }}>
            Platform Derma & Sumbangan Digital — Mudah, Telus, dan Berkat
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto" style={{ animation: "fadeSlideIn 0.6s ease-out 0.3s both" }}>
            {[
              { label: "Jumlah Terkumpul", value: formatCurrency(totalCollected) },
              { label: "Penderma", value: totalDonors },
              { label: "Program Aktif", value: activeEvents },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-2">
                <div className="text-white font-bold text-lg sm:text-xl">{stat.value}</div>
                <div className="text-emerald-300 text-[10px] sm:text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 1440 60" className="w-full block" preserveAspectRatio="none" style={{ marginBottom: "-1px" }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#fafaf8" />
        </svg>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-2">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Cari program derma..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-emerald-300 hover:text-emerald-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-stone-900">Program Derma</h2>
              <span className="text-xs text-stone-400">{filtered.length} program</span>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-sm">Tiada program dijumpai.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((event, i) => (
                  <div key={event.id} style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 0.08}s both` }}>
                    <EventCard event={event} onDonate={setDonatingEvent} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="font-semibold text-stone-900 text-sm">Derma Terkini</h3>
                </div>
                <div className="space-y-0">
                  {RECENT_DONORS.map((donor, i) => (
                    <RecentDonorRow key={i} donor={donor} index={i} />
                  ))}
                </div>
              </div>

              <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                <h4 className="font-semibold text-emerald-900 text-sm mb-2">💡 Cara Menderma</h4>
                <ol className="text-xs text-emerald-700 space-y-1.5">
                  <li>1. Pilih program yang anda ingin derma</li>
                  <li>2. Tekan &quot;Derma Sekarang&quot;</li>
                  <li>3. Masukkan jumlah dan nama (wajib)</li>
                  <li>4. Teruskan ke FPX dan pilih bank untuk bayar</li>
                </ol>
                <p className="text-[10px] text-emerald-600 mt-3 italic">* Demo: bayaran melalui FPX simulasi.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-stone-400">© 2025 Masjid Al-Ehsan — Sistem Pengurusan Derma Digital</p>
          <p className="text-[10px] text-stone-300 mt-1">POC Demo v1.0 • Dibina dengan ❤️</p>
        </div>
      </footer>

      {donatingEvent && (
        <DonationModal
          event={donatingEvent}
          onClose={() => setDonatingEvent(null)}
          onProceedToPay={handleProceedToPay}
        />
      )}
    </div>
  );
}
