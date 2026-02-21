import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

type LocationState = {
  amount: number;
  eventTitle: string;
  eventId: number;
  name: string;
  phone: string;
};

const DUMMY_BANKS = [
  { id: "maybank", name: "Maybank", code: "MB2U" },
  { id: "cimb", name: "CIMB Bank", code: "CIMB" },
  { id: "bsn", name: "Bank Simpanan Nasional", code: "BSN" },
  { id: "rhb", name: "RHB Bank", code: "RHB" },
  { id: "ambank", name: "AmBank", code: "AMBB" },
  { id: "bankislam", name: "Bank Islam", code: "BIMB" },
];

function formatCurrency(amount: number) {
  return `RM ${amount.toLocaleString("ms-MY")}`;
}

export default function FpxPayPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [selectedBank, setSelectedBank] = useState("");
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const amount = state?.amount ?? 0;
  const eventTitle = state?.eventTitle ?? "";
  const name = state?.name ?? "";

  const handlePay = () => {
    if (!selectedBank || amount <= 0) return;
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setSuccess(true);
    }, 2000);
  };

  if (!state) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">Sesi tidak sah</h2>
          <p className="text-sm text-stone-500 mb-6">Sila mulakan semula dari laman derma.</p>
          <Link
            to="/user"
            className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #0d7c5f, #10b981)" }}
          >
            Ke Laman Derma
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 max-w-sm w-full text-center shadow-lg">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Pembayaran Berjaya!</h2>
          <p className="text-stone-500 text-sm mb-4">
            Sumbangan anda sebanyak <strong>{formatCurrency(amount)}</strong> untuk <strong>{eventTitle}</strong> telah diterima melalui FPX.
          </p>
          <p className="text-stone-500 text-sm mb-6">Jazakallahu Khairan. Semoga Allah membalas kebaikan anda.</p>
          <Link
            to="/user"
            className="inline-block w-full py-3 rounded-xl text-sm font-semibold text-white text-center transition-all hover:shadow-md"
            style={{ background: "linear-gradient(135deg, #0d7c5f, #10b981)" }}
          >
            Kembali ke Laman Derma
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🕌</span>
            <div>
              <h1 className="font-display font-bold text-stone-900">Bayar dengan FPX</h1>
              <p className="text-xs text-stone-500">Masjid Al-Ehsan — Derma Digital</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm mb-6">
          <div className="p-1" style={{ background: "linear-gradient(90deg, #0d7c5f, #10b981)" }} />
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-stone-500">Jumlah bayaran</span>
              <span className="text-2xl font-bold text-emerald-700">{formatCurrency(amount)}</span>
            </div>
            <div className="text-sm text-stone-500 mb-4">Program: {eventTitle}</div>
            {name && <div className="text-xs text-stone-400">Atas nama: {name}</div>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <h2 className="font-semibold text-stone-900 text-sm mb-4">Pilih bank anda</h2>
          <div className="space-y-2">
            {DUMMY_BANKS.map((bank) => (
              <label
                key={bank.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedBank === bank.id
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <input
                  type="radio"
                  name="bank"
                  value={bank.id}
                  checked={selectedBank === bank.id}
                  onChange={() => setSelectedBank(bank.id)}
                  className="sr-only"
                />
                <span className="text-lg font-semibold text-stone-700">{bank.name}</span>
                <span className="text-xs text-stone-400">({bank.code})</span>
              </label>
            ))}
          </div>
        </div>

        <p className="text-xs text-stone-400 text-center mb-4">
          * Halaman demo. Tiada transaksi sebenar akan diproses.
        </p>

        <button
          onClick={handlePay}
          disabled={!selectedBank || paying}
          className="w-full py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #0d7c5f, #10b981)" }}
        >
          {paying ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Memproses...
            </>
          ) : (
            "Sahkan & Bayar"
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate("/user")}
          className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
        >
          Batal
        </button>
      </main>
    </div>
  );
}
