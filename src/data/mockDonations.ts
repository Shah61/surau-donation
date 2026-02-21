// Shared mock data for admin and donor detail pages

export type EventData = {
  id: number;
  title: string;
  category: string;
  target: number;
  collected: number;
  status: string;
  startDate: string;
  endDate: string;
};

export type DonationData = {
  id: number;
  donor: string;
  phone: string;
  amount: number;
  eventId: number;
  event: string;
  date: string;
  method: string;
  anonymous: boolean;
};

export const EVENTS_DATA: EventData[] = [
  { id: 1, title: "Qurban Hari Raya Haji 2025", category: "Qurban", target: 50000, collected: 37500, status: "active", startDate: "2025-01-15", endDate: "2025-06-06" },
  { id: 2, title: "Waqaf Pembesaran Masjid", category: "Waqaf", target: 200000, collected: 124800, status: "active", startDate: "2024-06-01", endDate: "2025-12-31" },
  { id: 3, title: "Tabung Anak Yatim", category: "Kebajikan", target: 12000, collected: 12000, status: "completed", startDate: "2024-01-01", endDate: "2024-12-31" },
  { id: 4, title: "Penyelenggaraan Ramadan 2025", category: "Ramadan", target: 30000, collected: 8200, status: "active", startDate: "2025-02-01", endDate: "2025-04-01" },
  { id: 5, title: "Kelas Mengaji & Tahfiz", category: "Pendidikan", target: 8000, collected: 5600, status: "active", startDate: "2025-01-01", endDate: "2025-12-31" },
  { id: 6, title: "Sumbangan Am Masjid", category: "Am", target: 24000, collected: 18900, status: "active", startDate: "2025-01-01", endDate: "2025-12-31" },
];

export const DONATIONS_DATA: DonationData[] = [
  { id: 1, donor: "Ahmad bin Hassan", phone: "012-3456789", amount: 500, eventId: 2, event: "Waqaf Pembesaran Masjid", date: "2025-02-15", method: "Online", anonymous: false },
  { id: 2, donor: "Tanpa Nama", phone: "-", amount: 1000, eventId: 1, event: "Qurban Hari Raya Haji 2025", date: "2025-02-14", method: "Tunai", anonymous: true },
  { id: 3, donor: "Siti Aminah", phone: "013-7654321", amount: 200, eventId: 4, event: "Penyelenggaraan Ramadan 2025", date: "2025-02-14", method: "Online", anonymous: false },
  { id: 4, donor: "Mohd Razif", phone: "011-2233445", amount: 100, eventId: 5, event: "Kelas Mengaji & Tahfiz", date: "2025-02-13", method: "Transfer", anonymous: false },
  { id: 5, donor: "Tanpa Nama", phone: "-", amount: 2000, eventId: 2, event: "Waqaf Pembesaran Masjid", date: "2025-02-13", method: "Online", anonymous: true },
  { id: 6, donor: "Nurul Izzah", phone: "019-8877665", amount: 150, eventId: 6, event: "Sumbangan Am Masjid", date: "2025-02-12", method: "Transfer", anonymous: false },
  { id: 7, donor: "Abu Bakar", phone: "014-5566778", amount: 300, eventId: 1, event: "Qurban Hari Raya Haji 2025", date: "2025-02-11", method: "Tunai", anonymous: false },
  { id: 8, donor: "Fatimah binti Ali", phone: "016-9988776", amount: 1500, eventId: 2, event: "Waqaf Pembesaran Masjid", date: "2025-02-10", method: "Online", anonymous: false },
  { id: 9, donor: "Ismail Kamil", phone: "017-1122334", amount: 250, eventId: 3, event: "Tabung Anak Yatim", date: "2025-02-09", method: "Transfer", anonymous: false },
  { id: 10, donor: "Tanpa Nama", phone: "-", amount: 5000, eventId: 2, event: "Waqaf Pembesaran Masjid", date: "2025-02-08", method: "Online", anonymous: true },
  { id: 11, donor: "Zainal Abidin", phone: "018-3344556", amount: 100, eventId: 6, event: "Sumbangan Am Masjid", date: "2025-02-07", method: "Tunai", anonymous: false },
  { id: 12, donor: "Aminah Zahra", phone: "012-6655443", amount: 400, eventId: 4, event: "Penyelenggaraan Ramadan 2025", date: "2025-02-06", method: "Online", anonymous: false },
  { id: 13, donor: "Ahmad bin Hassan", phone: "012-3456789", amount: 200, eventId: 6, event: "Sumbangan Am Masjid", date: "2025-02-05", method: "Transfer", anonymous: false },
  { id: 14, donor: "Ahmad bin Hassan", phone: "012-3456789", amount: 1000, eventId: 1, event: "Qurban Hari Raya Haji 2025", date: "2025-01-28", method: "Online", anonymous: false },
  { id: 15, donor: "Siti Aminah", phone: "013-7654321", amount: 300, eventId: 2, event: "Waqaf Pembesaran Masjid", date: "2025-01-20", method: "Transfer", anonymous: false },
  { id: 16, donor: "Fatimah binti Ali", phone: "016-9988776", amount: 500, eventId: 1, event: "Qurban Hari Raya Haji 2025", date: "2025-01-15", method: "Online", anonymous: false },
];
