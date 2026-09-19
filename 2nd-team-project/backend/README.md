# Backend — nullpoint contact API (versi aman)

Backend Node.js + Express untuk form kontak, sudah dilengkapi:
- Token admin untuk lindungi pesan masuk
- CORS terbatas ke domain tertentu
- Helmet (header keamanan otomatis)
- Rate limiting (anti-spam)
- Sanitasi input

## Setup pertama kali

```bash
npm install
cp .env.example .env
```

Lalu buka `.env`, ganti `ADMIN_TOKEN` dengan token acak. Cara bikin token acak:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy hasilnya ke `.env`:
```
ADMIN_TOKEN=hasil-random-tadi
ALLOWED_ORIGIN=http://localhost:5500
```

Jalankan server:
```bash
npm start
```

## Endpoint

### `POST /api/contact`
Kirim pesan dari form kontak. Dibatasi 5 request/menit per IP.

```json
{ "name": "Budi", "email": "budi@contoh.com", "message": "Halo!" }
```

### `GET /api/messages` (dilindungi token)
Lihat semua pesan masuk. Wajib kirim header:
```
Authorization: Bearer <ADMIN_TOKEN dari .env>
```

Contoh cek pakai curl:
```bash
curl -H "Authorization: Bearer isi-token-kamu" http://localhost:3001/api/messages
```

Kalau token salah/tidak ada → dapat `401 Unauthorized`.

### `GET /api/health`
Cek server hidup.

## Menghubungkan ke frontend

Di HTML kamu, arahkan fetch form kontak ke:
```js
const API_URL = 'http://localhost:3001/api/contact';
```
Saat deploy, ganti jadi alamat server asli (dan pastikan sudah HTTPS).

## Checklist sebelum deploy ke publik

- [ ] `.env` sudah diisi token asli, bukan contoh
- [ ] `.env` ada di `.gitignore`, tidak ikut ter-upload ke GitHub
- [ ] `ALLOWED_ORIGIN` diganti ke domain asli website
- [ ] Server sudah di belakang Nginx + HTTPS (Certbot)
- [ ] SSH server: root login dimatikan, pakai SSH key, firewall (`ufw`) aktif

## Kalau mau eksperimen self-pentest setelah deploy

Karena ini server milikmu sendiri, aman dan legal dicoba pakai:
- `nmap` — cek port yang terbuka
- `nikto` — cek kesalahan konfigurasi web server umum
- `testssl.sh` — cek kualitas HTTPS
- OWASP ZAP — scan kerentanan web app otomatis

Coba juga: akses `/api/messages` tanpa token (harus ditolak), lalu kirim 10 request cepat ke `/api/contact` (harus kena rate limit di request ke-6).
