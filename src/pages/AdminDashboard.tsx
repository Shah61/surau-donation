import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { EVENTS_DATA, DONATIONS_DATA, type DonationData } from "../data/mockDonations";

// ============================================================
// MASJID DONATION - ADMIN DASHBOARD
// ============================================================

const CATEGORIES = ["Semua", "Qurban", "Waqaf", "Kebajikan", "Ramadan", "Pendidikan", "Am"];

function formatCurrency(amt: number) {
  return `RM ${amt.toLocaleString("ms-MY")}`;
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("ms-MY", { day: "numeric", month: "short", year: "numeric" });
}

// --- ICONS (simple SVG) ---
const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  list: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  download: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  chevronDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  menu: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  trophy: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
};

// --- SUB COMPONENTS ---

function StatCard({
  icon,
  label,
  value,
  sub,
  color = "emerald",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: "emerald" | "amber" | "blue" | "rose";
}) {
  const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "text-emerald-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", icon: "text-amber-600" },
    blue: { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-600" },
    rose: { bg: "bg-rose-50", text: "text-rose-700", icon: "text-rose-600" },
  };
  const c = colorMap[color] || colorMap.emerald;
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center ${c.icon}`}>{icon}</div>
        <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
      {sub && <div className="text-xs text-stone-400 mt-1">{sub}</div>}
    </div>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${pct}%`,
          background: pct >= 100 ? "#16a34a" : pct >= 50 ? "#0d7c5f" : "#f59e0b",
        }}
      />
    </div>
  );
}

// --- CREATE EVENT MODAL ---
function CreateEventModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ title: "", category: "Am", target: "", startDate: "", endDate: "", description: "" });
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">Program Berjaya Dicipta!</h3>
          <p className="text-sm text-stone-500 mb-6">Program &quot;{form.title}&quot; telah ditambah ke dalam sistem.</p>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #0d7c5f, #10b981)" }}>
            Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #0d7c5f, #10b981)" }} />
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-stone-900">Cipta Program Baru</h3>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1">✕</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Nama Program *</label>
              <input type="text" placeholder="cth: Qurban 2025" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Kategori</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 bg-white">
                {CATEGORIES.filter((c) => c !== "Semua").map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Sasaran (RM) *</label>
              <input type="number" placeholder="cth: 50000" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Tarikh Mula</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Tarikh Tamat</label>
                <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Penerangan</label>
              <textarea rows={3} placeholder="Terangkan program ini..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none" />
            </div>
            <button
              onClick={() => form.title && form.target && setSaved(true)}
              disabled={!form.title || !form.target}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #0d7c5f, #10b981)" }}
            >
              Cipta Program
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- RECORD DONATION MODAL ---
function RecordDonationModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ donor: "", phone: "", amount: "", eventId: "", method: "Tunai" });
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">Derma Direkodkan!</h3>
          <p className="text-sm text-stone-500 mb-6">Sumbangan sebanyak {formatCurrency(Number(form.amount))} telah berjaya direkodkan.</p>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #0d7c5f, #10b981)" }}>
            Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #0d7c5f, #10b981)" }} />
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-stone-900">Rekod Derma Baru</h3>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1">✕</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Program *</label>
              <select value={form.eventId} onChange={(e) => setForm({ ...form, eventId: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 bg-white">
                <option value="">-- Pilih Program --</option>
                {EVENTS_DATA.filter((e) => e.status === "active").map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Nama Penderma *</label>
              <input type="text" placeholder="Nama penuh" value={form.donor} onChange={(e) => setForm({ ...form, donor: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">No. Telefon</label>
              <input type="tel" placeholder="012-3456789" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Jumlah (RM) *</label>
                <input type="number" placeholder="100" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Kaedah</label>
                <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 bg-white">
                  <option>Tunai</option>
                  <option>Transfer</option>
                  <option>Online</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => form.eventId && form.amount && form.donor && setSaved(true)}
              disabled={!form.eventId || !form.amount || !form.donor}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #0d7c5f, #10b981)" }}
            >
              Simpan Rekod
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type NavItem = { id: string; label: string; icon: React.ReactNode };

// Mobile row component for donations
function DonationMobileRow({ donation }: { donation: DonationData }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b border-stone-100 last:border-0">
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-stone-400 hover:text-stone-600 transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-transform ${expanded ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-stone-800 truncate">
            {donation.anonymous ? <span className="italic text-stone-400">Tanpa Nama</span> : donation.donor}
          </div>
          <div className="text-sm font-semibold text-emerald-700 mt-0.5">{formatCurrency(donation.amount)}</div>
        </div>
        <div className="text-xs text-stone-400">{formatDate(donation.date)}</div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pl-12 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">No. Tel:</span>
            <span className="text-stone-700">{donation.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Program:</span>
            <span className="text-stone-700 text-right">{donation.event}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Kaedah:</span>
            <span
              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                donation.method === "Tunai" ? "bg-amber-50 text-amber-700" : donation.method === "Transfer" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {donation.method}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// --- MAIN ADMIN PAGE ---
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterEvent, setFilterEvent] = useState("Semua");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [searchDonor, setSearchDonor] = useState("");
  const [sortField, setSortField] = useState<"date" | "amount" | "donor">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showRecordDonation, setShowRecordDonation] = useState(false);

  const totalCollected = EVENTS_DATA.reduce((s, e) => s + e.collected, 0);
  const totalTarget = EVENTS_DATA.reduce((s, e) => s + e.target, 0);
  const totalDonations = DONATIONS_DATA.length;
  const avgDonation = Math.round(DONATIONS_DATA.reduce((s, d) => s + d.amount, 0) / DONATIONS_DATA.length);

  const topDonors = useMemo(() => {
    const map: Record<string, { name: string; total: number; count: number }> = {};
    DONATIONS_DATA.forEach((d) => {
      if (d.anonymous) return;
      if (!map[d.donor]) map[d.donor] = { name: d.donor, total: 0, count: 0 };
      map[d.donor].total += d.amount;
      map[d.donor].count += 1;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, []);

  const frequentDonors = useMemo(() => {
    return [...topDonors].sort((a, b) => b.count - a.count);
  }, [topDonors]);

  const filteredDonations = useMemo(() => {
    let list = [...DONATIONS_DATA];
    if (filterEvent !== "Semua") list = list.filter((d) => d.event === filterEvent);
    if (filterCategory !== "Semua") {
      const eventIdsInCat = EVENTS_DATA.filter((e) => e.category === filterCategory).map((e) => e.id);
      list = list.filter((d) => eventIdsInCat.includes(d.eventId));
    }
    if (searchDonor) list = list.filter((d) => d.donor.toLowerCase().includes(searchDonor.toLowerCase()));
    if (filterDateFrom) {
      const from = new Date(filterDateFrom).setHours(0, 0, 0, 0);
      list = list.filter((d) => new Date(d.date).setHours(0, 0, 0, 0) >= from);
    }
    if (filterDateTo) {
      const to = new Date(filterDateTo).setHours(23, 59, 59, 999);
      list = list.filter((d) => new Date(d.date).setHours(0, 0, 0, 0) <= to);
    }

    list.sort((a, b) => {
      let valA: string | number | Date, valB: string | number | Date;
      if (sortField === "date") {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      } else if (sortField === "amount") {
        valA = a.amount;
        valB = b.amount;
      } else if (sortField === "donor") {
        valA = a.donor.toLowerCase();
        valB = b.donor.toLowerCase();
      } else {
        valA = a[sortField];
        valB = b[sortField];
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [filterEvent, filterCategory, filterDateFrom, filterDateTo, searchDonor, sortField, sortDir]);

  const toggleSort = (field: "date" | "amount" | "donor") => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
    { id: "donations", label: "Rekod Derma", icon: Icons.list },
    { id: "events", label: "Program", icon: Icons.calendar },
    { id: "donors", label: "Penderma", icon: Icons.users },
  ];

  const donorDetailUrl = (name: string) => `/admin/donor?name=${encodeURIComponent(name)}`;

  return (
    <div className="min-h-screen bg-[#f5f5f4] flex">
      {/* SIDEBAR - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-stone-200 min-h-screen sticky top-0">
        <div className="p-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg, #064e3b, #047857)" }}>
              🕌
            </div>
            <div>
              <div className="font-bold text-stone-900 text-sm">Masjid</div>
              <div className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">Panel Admin</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id ? "bg-emerald-50 text-emerald-700" : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
              }`}
            >
              <span className={activeTab === item.id ? "text-emerald-600" : "text-stone-400"}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <Link
            to="/admin/donor"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-all"
          >
            <span className="text-stone-400">{Icons.list}</span>
            Rekod mengikut Penderma
          </Link>
        </nav>

        <div className="p-4 border-t border-stone-100">
          <div className="bg-emerald-50 rounded-xl p-3">
            <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider mb-1">POC Demo</p>
            <p className="text-xs text-emerald-700">Sistem ini adalah versi demo untuk tujuan pembentangan.</p>
          </div>
        </div>
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg, #064e3b, #047857)" }}>
                  🕌
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm">Masjid</div>
                  <div className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">Panel Admin</div>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-stone-400 hover:text-stone-600">
                {Icons.close}
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "bg-emerald-50 text-emerald-700" : "text-stone-500 hover:bg-stone-50"}`}
                >
                  <span className={activeTab === item.id ? "text-emerald-600" : "text-stone-400"}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <Link
                to="/admin/donor"
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:bg-stone-50 transition-all"
              >
                <span className="text-stone-400">{Icons.list}</span>
                Rekod mengikut Penderma
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-stone-500 hover:text-stone-700">
                {Icons.menu}
              </button>
              <h1 className="font-display text-lg font-bold text-stone-900">{navItems.find((n) => n.id === activeTab)?.label || "Dashboard"}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowRecordDonation(true)} className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #0d7c5f, #10b981)" }}>
                {Icons.plus} Rekod Derma
              </button>
              <button onClick={() => setShowCreateEvent(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50">
                {Icons.plus} Program Baru
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard icon="💰" label="Jumlah Terkumpul" value={formatCurrency(totalCollected)} sub={`Sasaran: ${formatCurrency(totalTarget)}`} color="emerald" />
                <StatCard icon="📝" label="Jumlah Transaksi" value={totalDonations} sub="Keseluruhan" color="blue" />
                <StatCard icon="👤" label="Penderma Unik" value={topDonors.length} sub="Tidak termasuk tanpa nama" color="amber" />
                <StatCard icon="📊" label="Purata Derma" value={formatCurrency(avgDonation)} sub="Per transaksi" color="rose" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-xl border border-stone-200 p-5">
                  <h3 className="font-semibold text-stone-900 text-sm mb-4">Kemajuan Program</h3>
                  <div className="space-y-4">
                    {EVENTS_DATA.map((ev) => {
                      const pct = Math.min(Math.round((ev.collected / ev.target) * 100), 100);
                      return (
                        <div key={ev.id}>
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="font-medium text-stone-700 truncate mr-2">{ev.title}</span>
                            <span className="text-xs text-stone-400 whitespace-nowrap">{pct}%</span>
                          </div>
                          <ProgressBar pct={pct} />
                          <div className="flex items-center justify-between text-xs text-stone-400 mt-1">
                            <span>{formatCurrency(ev.collected)}</span>
                            <span>{formatCurrency(ev.target)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-stone-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-amber-500">{Icons.trophy}</span>
                      <h3 className="font-semibold text-stone-900 text-sm">Penderma Tertinggi</h3>
                    </div>
                    <div className="space-y-3">
                      {topDonors.slice(0, 5).map((d, i) => (
                        <Link key={d.name} to={donorDetailUrl(d.name)} className="flex items-center gap-3 rounded-lg hover:bg-stone-50 p-1 -m-1 transition-colors">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-stone-100 text-stone-500" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-stone-50 text-stone-400"}`}>
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-stone-800 truncate">{d.name}</div>
                            <div className="text-xs text-stone-400">{d.count} kali derma</div>
                          </div>
                          <div className="text-sm font-semibold text-emerald-700">{formatCurrency(d.total)}</div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-stone-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-blue-500">🔄</span>
                      <h3 className="font-semibold text-stone-900 text-sm">Penderma Paling Kerap</h3>
                    </div>
                    <div className="space-y-3">
                      {frequentDonors.slice(0, 5).map((d, i) => (
                        <Link key={d.name} to={donorDetailUrl(d.name)} className="flex items-center gap-3 rounded-lg hover:bg-stone-50 p-1 -m-1 transition-colors">
                          <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-stone-800 truncate">{d.name}</div>
                            <div className="text-xs text-stone-400">{formatCurrency(d.total)} jumlah</div>
                          </div>
                          <div className="text-sm font-semibold text-blue-700">{d.count}x</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-stone-900 text-sm">Derma Terkini</h3>
                  <button onClick={() => setActiveTab("donations")} className="text-xs text-emerald-600 font-semibold hover:underline">
                    Lihat Semua →
                  </button>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-stone-400 uppercase tracking-wider border-b border-stone-100">
                        <th className="pb-2 pr-4">Penderma</th>
                        <th className="pb-2 pr-4">Program</th>
                        <th className="pb-2 pr-4 text-right">Jumlah</th>
                        <th className="pb-2 text-right">Tarikh</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DONATIONS_DATA.slice(0, 5).map((d) => (
                        <tr key={d.id} className="border-b border-stone-50 last:border-0">
                          <td className="py-2.5 pr-4 font-medium text-stone-800">{d.anonymous ? <span className="italic text-stone-400">Tanpa Nama</span> : d.donor}</td>
                          <td className="py-2.5 pr-4 text-stone-500 max-w-[200px] truncate">{d.event}</td>
                          <td className="py-2.5 pr-4 text-right font-semibold text-emerald-700">{formatCurrency(d.amount)}</td>
                          <td className="py-2.5 text-right text-stone-400 whitespace-nowrap">{formatDate(d.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "donations" && (
            <div className="space-y-4" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
              <div className="bg-white rounded-xl border border-stone-200 p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">{Icons.search}</span>
                    <input type="text" placeholder="Cari nama penderma..." value={searchDonor} onChange={(e) => setSearchDonor(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                  </div>
                  <select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <option value="Semua">Semua Program</option>
                    {EVENTS_DATA.map((e) => (
                      <option key={e.id} value={e.title}>
                        {e.title}
                      </option>
                    ))}
                  </select>
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c === "Semua" ? "Semua Kategori" : c}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2 items-center">
                    <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" title="Dari tarikh" />
                    <span className="text-stone-400 text-sm">–</span>
                    <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="px-3 py-2 rounded-lg border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" title="Hingga tarikh" />
                  </div>
                  <button onClick={() => setShowRecordDonation(true)} className="sm:hidden flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #0d7c5f, #10b981)" }}>
                    {Icons.plus} Rekod Derma
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">{filteredDonations.length} rekod dijumpai</span>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-700 transition-colors">
                  {Icons.download} Eksport CSV
                </button>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto scrollbar-hide">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-stone-400 uppercase tracking-wider bg-stone-50 border-b border-stone-200">
                        <th className="p-3 cursor-pointer hover:text-stone-600" onClick={() => toggleSort("donor")}>
                          <div className="flex items-center gap-1">
                            Penderma {sortField === "donor" && (sortDir === "asc" ? "↑" : "↓")}
                          </div>
                        </th>
                        <th className="p-3">No. Tel</th>
                        <th className="p-3">Program</th>
                        <th className="p-3">Kaedah</th>
                        <th className="p-3 cursor-pointer hover:text-stone-600 text-right" onClick={() => toggleSort("amount")}>
                          <div className="flex items-center justify-end gap-1">
                            Jumlah {sortField === "amount" && (sortDir === "asc" ? "↑" : "↓")}
                          </div>
                        </th>
                        <th className="p-3 cursor-pointer hover:text-stone-600 text-right" onClick={() => toggleSort("date")}>
                          <div className="flex items-center justify-end gap-1">
                            Tarikh {sortField === "date" && (sortDir === "asc" ? "↑" : "↓")}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonations.map((d) => (
                        <tr key={d.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                          <td className="p-3 font-medium text-stone-800">{d.anonymous ? <span className="italic text-stone-400">Tanpa Nama</span> : d.donor}</td>
                          <td className="p-3 text-stone-500">{d.phone}</td>
                          <td className="p-3 text-stone-500 max-w-[200px] truncate">{d.event}</td>
                          <td className="p-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                d.method === "Tunai" ? "bg-amber-50 text-amber-700" : d.method === "Transfer" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {d.method}
                            </span>
                          </td>
                          <td className="p-3 text-right font-semibold text-emerald-700">{formatCurrency(d.amount)}</td>
                          <td className="p-3 text-right text-stone-400 whitespace-nowrap">{formatDate(d.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden">
                  {filteredDonations.map((d) => (
                    <DonationMobileRow key={d.id} donation={d} />
                  ))}
                </div>

                {filteredDonations.length === 0 && (
                  <div className="text-center py-12 text-stone-400">
                    <div className="text-3xl mb-2">🔍</div>
                    <p className="text-sm">Tiada rekod dijumpai.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-4" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {EVENTS_DATA.map((ev) => {
                  const pct = Math.min(Math.round((ev.collected / ev.target) * 100), 100);
                  const donationsForEvent = DONATIONS_DATA.filter((d) => d.eventId === ev.id);
                  return (
                    <div key={ev.id} className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ev.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>{ev.status === "active" ? "Aktif" : "Selesai"}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">{ev.category}</span>
                      </div>
                      <h3 className="font-semibold text-stone-900 text-sm mb-2">{ev.title}</h3>
                      <ProgressBar pct={pct} />
                      <div className="flex items-center justify-between text-xs mt-2 mb-3">
                        <span className="font-semibold text-emerald-700">{formatCurrency(ev.collected)}</span>
                        <span className="text-stone-400">{formatCurrency(ev.target)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-100">
                        <span>{donationsForEvent.length} transaksi</span>
                        <span>
                          {formatDate(ev.startDate)} - {formatDate(ev.endDate)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <button onClick={() => setShowCreateEvent(true)} className="border-2 border-dashed border-stone-200 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-stone-400 hover:border-emerald-300 hover:text-emerald-600 transition-all min-h-[200px]">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">{Icons.plus}</div>
                  <span className="text-sm font-medium">Cipta Program Baru</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "donors" && (
            <div className="space-y-4" style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-xl border border-stone-200 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-amber-500">{Icons.trophy}</span>
                    <h3 className="font-semibold text-stone-900">Penderma Tertinggi (Jumlah)</h3>
                  </div>
                  <div className="space-y-3">
                    {topDonors.map((d, i) => (
                      <Link key={d.name} to={donorDetailUrl(d.name)} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-stone-50 transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-stone-200 text-stone-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-stone-50 text-stone-400"}`}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-stone-800">{d.name}</div>
                          <div className="text-xs text-stone-400">{d.count} kali derma</div>
                        </div>
                        <div className="text-sm font-bold text-emerald-700">{formatCurrency(d.total)}</div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-blue-500">🔄</span>
                    <h3 className="font-semibold text-stone-900">Penderma Paling Kerap</h3>
                  </div>
                  <div className="space-y-3">
                    {frequentDonors.map((d, i) => (
                      <Link key={d.name} to={donorDetailUrl(d.name)} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-stone-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-stone-800">{d.name}</div>
                          <div className="text-xs text-stone-400">Jumlah: {formatCurrency(d.total)}</div>
                        </div>
                        <div className="text-sm font-bold text-blue-700">{d.count}x derma</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h3 className="font-semibold text-stone-900 text-sm mb-4">Semua Penderma</h3>
                
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto scrollbar-hide">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-stone-400 uppercase tracking-wider border-b border-stone-200">
                        <th className="pb-2 pr-4">#</th>
                        <th className="pb-2 pr-4">Nama</th>
                        <th className="pb-2 pr-4 text-right">Jumlah Keseluruhan</th>
                        <th className="pb-2 text-right">Kekerapan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topDonors.map((d, i) => (
                          <tr key={d.name} className="border-b border-stone-50 hover:bg-stone-50/50">
                            <td className="py-2.5 pr-4 text-stone-400">{i + 1}</td>
                            <td className="py-2.5 pr-4 font-medium text-stone-800">
                              <Link to={donorDetailUrl(d.name)} className="text-emerald-600 hover:underline">
                                {d.name}
                              </Link>
                            </td>
                            <td className="py-2.5 pr-4 text-right font-semibold text-emerald-700">{formatCurrency(d.total)}</td>
                            <td className="py-2.5 text-right text-stone-500">{d.count} kali</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {topDonors.map((d, i) => (
                    <Link
                      key={d.name}
                      to={donorDetailUrl(d.name)}
                      className="flex items-center gap-3 p-3 rounded-lg border border-stone-100 hover:bg-stone-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700 shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-stone-800">{d.name}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{d.count} kali derma</div>
                      </div>
                      <div className="text-sm font-bold text-emerald-700">{formatCurrency(d.total)}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showCreateEvent && <CreateEventModal onClose={() => setShowCreateEvent(false)} />}
      {showRecordDonation && <RecordDonationModal onClose={() => setShowRecordDonation(false)} />}
    </div>
  );
}
