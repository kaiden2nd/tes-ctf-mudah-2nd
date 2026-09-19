# 2nd Team — Project Overview

Struktur folder:

```
2nd-team-project/
├── frontend/
│   └── index.html          → website portofolio 2nd team (buka langsung di browser)
├── backend/
│   ├── server.js           → API form kontak (sudah ada proteksi: token, CORS, helmet, rate limit)
│   ├── package.json
│   ├── .env.example        → copy jadi .env, isi ADMIN_TOKEN & ALLOWED_ORIGIN
│   ├── .gitignore
│   └── README.md           → panduan lengkap setup & endpoint backend
└── vuln-lab/
    ├── server.js           → target CTF pribadi (3 flag) untuk latihan pentest
    ├── package.json
    └── README.md           → panduan & petunjuk flag
```

## Cara membuka di VS Code

1. Buka VS Code
2. `File > Open Folder` → pilih folder `2nd-team-project`
3. Semua file akan muncul di sidebar kiri, terbagi sesuai fungsinya

## Menjalankan tiap bagian

**Frontend** — tidak perlu server, langsung buka `frontend/index.html` di
browser (klik kanan di VS Code → "Open with Live Server" kalau ada
extension itu, atau drag file ke browser).

**Backend** (untuk form kontak website):
```bash
cd backend
npm install
cp .env.example .env    # lalu isi ADMIN_TOKEN
npm start
```
Jalan di `http://localhost:3001`

**Vuln-lab** (target latihan CTF, jangan dijalankan bareng backend di
port yang sama):
```bash
cd vuln-lab
npm install
npm start
```
Jalan di `http://localhost:4000`

## Catatan

- `backend` dan `vuln-lab` adalah dua project Node.js **terpisah** —
  masing-masing punya `package.json` dan `node_modules` sendiri, jalankan
  `npm install` di masing-masing folder.
- Jangan gabungkan kode `vuln-lab` ke dalam `backend` — vuln-lab sengaja
  dibuat rentan, backend sengaja dibuat aman. Keduanya harus tetap
  terpisah supaya website 2nd team yang asli tidak ikut rentan.
