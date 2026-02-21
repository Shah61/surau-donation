# Quotation — Masjid Al-Ehsan Donation Platform  
## Feature List & Scope

**Project:** Masjid Donation & Sumbangan Digital  
**Version:** POC Demo v1.0  
**Date:** February 2025  

---

## 1. Public / Donor (User) Features

### 1.1 User Donation Page (`/user`)

| # | Feature | Description |
|---|---------|-------------|
| 1.1.1 | **Hero section** | Branded header with masjid name, tagline, and hero pattern background |
| 1.1.2 | **Summary stats** | Display total collected, total donors, and number of active programs |
| 1.1.3 | **Program listing** | Grid of donation programs with image, title, category, description, progress bar |
| 1.1.4 | **Category filter** | Filter programs by category: Semua, Qurban, Waqaf, Kebajikan, Ramadan, Pendidikan, Am |
| 1.1.5 | **Search** | Search programs by title or description |
| 1.1.6 | **Progress bar per program** | Collected vs target amount with percentage and donor count |
| 1.1.7 | **Event status badges** | Active / Selesai (completed) and category badges |
| 1.1.8 | **“Derma Sekarang” CTA** | Per-program donate button (disabled for completed programs) |
| 1.1.9 | **Recent donors sidebar** | Live feed of recent donations (name/anon, amount, event, date) |
| 1.1.10 | **“Cara Menderma” guide** | Short step-by-step instructions for donors |
| 1.1.11 | **Footer** | Copyright and POC disclaimer |

### 1.2 Donation Modal (User)

| # | Feature | Description |
|---|---------|-------------|
| 1.2.1 | **Amount presets** | Quick-select amounts: RM 10, 50, 100, 500 |
| 1.2.2 | **Custom amount** | Free-form number input |
| 1.2.3 | **Donor name** | Required full name field |
| 1.2.4 | **Phone number** | Optional phone field |
| 1.2.5 | **Proceed to FPX** | Submit and navigate to payment page with state (amount, event, name, phone) |

### 1.3 FPX Pay Page (`/user/pay`)

| # | Feature | Description |
|---|---------|-------------|
| 1.3.1 | **Payment summary** | Display amount, program name, donor name |
| 1.3.2 | **Bank selection** | Radio list: Maybank, CIMB, BSN, RHB, AmBank, Bank Islam (demo) |
| 1.3.3 | **“Sahkan & Bayar”** | Simulated payment with loading state (~2s) |
| 1.3.4 | **Success screen** | Thank-you message, amount, program, and “Kembali ke Laman Derma” |
| 1.3.5 | **Invalid session handling** | Redirect message and link to `/user` if state is missing |
| 1.3.6 | **Cancel** | Button to return to donation page without paying |

---

## 2. Admin Dashboard Features

### 2.1 Navigation & Layout

| # | Feature | Description |
|---|---------|-------------|
| 2.1.1 | **Desktop sidebar** | Fixed sidebar with logo, “Masjid Al-Ehsan”, “Panel Admin” |
| 2.1.2 | **Nav tabs** | Dashboard, Rekod Derma, Program, Penderma |
| 2.1.3 | **Donor list link** | “Rekod mengikut Penderma” → `/admin/donor` |
| 2.1.4 | **Mobile sidebar** | Overlay drawer with same nav; open/close with menu/close icons |
| 2.1.5 | **Header actions** | “Rekod Derma” (primary), “Program Baru” (secondary) |
| 2.1.6 | **POC notice** | Footer note in sidebar: demo version for presentation |

### 2.2 Dashboard Tab

| # | Feature | Description |
|---|---------|-------------|
| 2.2.1 | **Stat cards** | Jumlah Terkumpul, Jumlah Transaksi, Penderma Unik, Purata Derma |
| 2.2.2 | **Program progress** | List of all programs with progress bar, collected vs target |
| 2.2.3 | **Top donors (by amount)** | Top 5 with rank, name, donation count, total amount; link to donor detail |
| 2.2.4 | **Most frequent donors** | Top 5 by donation count; link to donor detail |
| 2.2.5 | **Recent donations table** | Last 5 donations: donor, program, amount, date; “Lihat Semua” → Rekod Derma tab |

### 2.3 Rekod Derma (Donations) Tab

| # | Feature | Description |
|---|---------|-------------|
| 2.3.1 | **Search** | Search by donor name |
| 2.3.2 | **Filters** | By program, category, date range (from–to) |
| 2.3.3 | **Sort** | By donor, amount, or date; toggle asc/desc |
| 2.3.4 | **Desktop table** | Columns: Penderma, No. Tel, Program, Kaedah, Jumlah, Tarikh |
| 2.3.5 | **Mobile cards** | Expandable rows with donor, amount, date; expand for phone, program, method |
| 2.3.6 | **Anonymous display** | “Tanpa Nama” for anonymous donations |
| 2.3.7 | **Method badges** | Tunai (amber), Transfer (blue), Online (emerald) |
| 2.3.8 | **Record count** | “X rekod dijumpai” |
| 2.3.9 | **Export CSV** | Button (UI only in current scope) |
| 2.3.10 | **Empty state** | Message when no records match filters |

### 2.4 Program Tab

| # | Feature | Description |
|---|---------|-------------|
| 2.4.1 | **Program cards** | Title, status (Aktif/Selesai), category, progress bar, collected/target, transaction count, date range |
| 2.4.2 | **“Cipta Program Baru” card** | Dashed border card to open create modal |

### 2.5 Penderma (Donors) Tab

| # | Feature | Description |
|---|---------|-------------|
| 2.5.1 | **Top donors (by amount)** | Full list with rank, name, count, total; link to donor detail |
| 2.5.2 | **Most frequent donors** | Full list with count and total; link to donor detail |
| 2.5.3 | **All donors table (desktop)** | #, Nama, Jumlah Keseluruhan, Kekerapan; name links to donor detail |
| 2.5.4 | **All donors cards (mobile)** | Card per donor with rank, name, count, total; tap to donor detail |

### 2.6 Create Program Modal

| # | Feature | Description |
|---|---------|-------------|
| 2.6.1 | **Form fields** | Nama Program*, Kategori, Sasaran (RM)*, Tarikh Mula, Tarikh Tamat, Penerangan |
| 2.6.2 | **Categories** | Qurban, Waqaf, Kebajikan, Ramadan, Pendidikan, Am |
| 2.6.3 | **Validation** | Required: title, target |
| 2.6.4 | **Success state** | “Program Berjaya Dicipta!” with program name and close button |

### 2.7 Record Donation Modal

| # | Feature | Description |
|---|---------|-------------|
| 2.7.1 | **Form fields** | Program* (active only), Nama Penderma*, No. Telefon, Jumlah (RM)*, Kaedah (Tunai/Transfer/Online) |
| 2.7.2 | **Validation** | Required: event, amount, donor name |
| 2.7.3 | **Success state** | “Derma Direkodkan!” with amount and close button |

---

## 3. Donor Detail Page (`/admin/donor`)

| # | Feature | Description |
|---|---------|-------------|
| 3.1 | **Back link** | “← Kembali ke Panel Admin” to `/admin` |
| 3.2 | **Donor selector** | Dropdown of all unique (non-anonymous) donor names; URL `?name=...` supported |
| 3.3 | **Summary card** | Selected donor name, total amount, number of transactions |
| 3.4 | **Donations table (desktop)** | Tarikh, Program, Kaedah, Jumlah (RM) |
| 3.5 | **Donations cards (mobile)** | Expandable rows: date, amount, method; expand for program |
| 3.6 | **Empty state** | Message when no donor selected or no donations |

---

## 4. Shared / Technical

| # | Feature | Description |
|---|---------|-------------|
| 4.1 | **Routing** | React Router: `/` → `/user`, `/user`, `/user/pay`, `/admin`, `/admin/donor` |
| 4.2 | **Mock data** | Centralised `EVENTS_DATA` and `DONATIONS_DATA` in `data/mockDonations.ts` |
| 4.3 | **Types** | `EventData`, `DonationData` (id, donor, phone, amount, eventId, event, date, method, anonymous) |
| 4.4 | **Formatting** | `formatCurrency` (RM, ms-MY), `formatDate` (day, short month, year) |
| 4.5 | **Responsive layout** | Desktop tables vs mobile card/expandable rows across admin and donor detail |
| 4.6 | **Mobile expandable row** | Reusable pattern (component + inline usage) for donation rows on small screens |
| 4.7 | **UI/UX** | Emerald/stone theme, gradients, badges, progress bars, modals with backdrop |

---

## 5. Summary Counts

| Area | Feature count (approx.) |
|------|-------------------------|
| Public / User | 22 |
| Admin Dashboard | 35+ |
| Donor Detail Page | 6 |
| Shared / Technical | 7 |
| **Total** | **~70** |

---

*This quotation lists all features present in the current `src` codebase. For a formal project or pricing quotation, each item can be mapped to effort (hours/days) and cost as needed.*
