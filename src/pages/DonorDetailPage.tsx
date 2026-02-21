import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DONATIONS_DATA, type DonationData } from "../data/mockDonations";

function formatCurrency(amt: number) {
  return `RM ${amt.toLocaleString("ms-MY")}`;
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("ms-MY", { day: "numeric", month: "short", year: "numeric" });
}

// Mobile row component
function DonorDonationMobileRow({ donation }: { donation: DonationData }) {
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
          <div className="text-xs text-stone-500">{formatDate(donation.date)}</div>
          <div className="text-sm font-semibold text-emerald-700 mt-0.5">{formatCurrency(donation.amount)}</div>
        </div>
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
            donation.method === "Tunai"
              ? "bg-amber-50 text-amber-700"
              : donation.method === "Transfer"
                ? "bg-blue-50 text-blue-700"
                : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {donation.method}
        </span>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pl-12">
          <div className="text-sm">
            <span className="text-stone-500">Program: </span>
            <span className="text-stone-800">{donation.event}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DonorDetailPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const nameFromUrl = searchParams.get("name") ?? "";

  const donorNames = useMemo(() => {
    const set = new Set<string>();
    DONATIONS_DATA.forEach((d) => {
      if (!d.anonymous) set.add(d.donor);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const [selectedName, setSelectedName] = useState((nameFromUrl || donorNames[0]) ?? "");

  useEffect(() => {
    if (nameFromUrl) setSelectedName(nameFromUrl);
  }, [nameFromUrl]);

  const donations = useMemo(() => {
    if (!selectedName) return [];
    return DONATIONS_DATA.filter((d) => !d.anonymous && d.donor === selectedName).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [selectedName]);

  const totalAmount = useMemo(() => donations.reduce((s, d) => s + d.amount, 0), [donations]);

  const handleSelectDonor = (name: string) => {
    setSelectedName(name);
    setSearchParams(name ? { name } : {});
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4]">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-emerald-600 font-medium mb-4"
          >
            ← Kembali ke Panel Admin
          </Link>
          <h1 className="font-display text-xl font-bold text-stone-900">Rekod Derma mengikut Penderma</h1>
          <p className="text-sm text-stone-500 mt-0.5">Pilih nama penderma untuk melihat sejarah derma</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
          <label className="block text-sm font-medium text-stone-700 mb-2">Pilih Penderma</label>
          <select
            value={selectedName}
            onChange={(e) => handleSelectDonor(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 bg-white"
          >
            <option value="">-- Pilih nama --</option>
            {donorNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {selectedName && (
          <>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Penderma</span>
                  <p className="text-lg font-semibold text-emerald-900">{selectedName}</p>
                </div>
                <div>
                  <span className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Jumlah Keseluruhan</span>
                  <p className="text-lg font-bold text-emerald-700">{formatCurrency(totalAmount)}</p>
                </div>
                <div>
                  <span className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Bilangan Derma</span>
                  <p className="text-lg font-semibold text-emerald-800">{donations.length} transaksi</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <h2 className="font-semibold text-stone-900 text-sm px-5 py-4 border-b border-stone-100">
                Senarai Derma — {donations.length} rekod
              </h2>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto scrollbar-hide">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-stone-400 uppercase tracking-wider bg-stone-50 border-b border-stone-200">
                      <th className="p-3">Tarikh</th>
                      <th className="p-3">Program</th>
                      <th className="p-3">Kaedah</th>
                      <th className="p-3 text-right">Jumlah (RM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d) => (
                      <tr key={d.id} className="border-b border-stone-50 hover:bg-stone-50/50">
                        <td className="p-3 text-stone-600 whitespace-nowrap">{formatDate(d.date)}</td>
                        <td className="p-3 text-stone-800 max-w-[220px] truncate">{d.event}</td>
                        <td className="p-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              d.method === "Tunai"
                                ? "bg-amber-50 text-amber-700"
                                : d.method === "Transfer"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {d.method}
                          </span>
                        </td>
                        <td className="p-3 text-right font-semibold text-emerald-700">{formatCurrency(d.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden">
                {donations.map((d) => (
                  <DonorDonationMobileRow key={d.id} donation={d} />
                ))}
              </div>

              {donations.length === 0 && (
                <div className="text-center py-12 text-stone-400">
                  <p className="text-sm">Tiada rekod derma untuk penderma ini.</p>
                </div>
              )}
            </div>
          </>
        )}

        {!selectedName && donorNames.length > 0 && (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">
            <p className="text-sm">Sila pilih nama penderma di atas.</p>
          </div>
        )}
      </main>
    </div>
  );
}
