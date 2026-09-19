# Vuln-Lab — mini CTF pribadi (3 flag)

Target latihan pentest yang sengaja dibuat rentan. Jalankan di komputer/VM
kamu sendiri, lalu serang dari Kali Linux di VM/mesin lain yang satu
jaringan. **Jangan expose ini ke internet publik** — ini murni untuk latihan
lokal.

## Menjalankan target

```bash
npm install
npm start
```

Server jalan di port 4000. Cek IP mesin yang menjalankan ini
(`ip a` di Linux, atau `ifconfig`), lalu dari Kali Linux kamu bisa akses
`http://IP-TARGET:4000`.

Kalau target dan Kali sama-sama VM, pastikan network mode-nya
**Host-only** atau **Bridged** (bukan NAT-isolated) supaya bisa saling
lihat.

## Tujuan (3 flag, makin susah)

Format flag: `FLAG{...}`

1. **Flag 1 — Recon dasar**
   Kadang informasi paling penting ada di tempat paling jelas.
   Coba lihat "isi mentah" dari halaman utama, bukan tampilannya.

2. **Flag 2 — Enumeration**
   Website sering punya file konfigurasi yang "membocorkan" struktur
   tersembunyinya tanpa sadar. Coba cek file standar yang biasanya ada
   di root sebuah website, atau pakai tools enumeration direktori
   (`gobuster`, `dirb`, `ffuf`) ke `http://IP-TARGET:4000`.

3. **Flag 3 — Login lemah**
   Ada halaman `/login`. Username-nya masuk akal untuk ditebak.
   Password-nya termasuk salah satu password paling umum di dunia —
   coba brute force pakai `hydra` dengan wordlist kecil dulu (misal
   top-100 atau top-1000 common passwords), baru naik ke `rockyou.txt`
   kalau belum ketemu.

   Contoh pola perintah hydra untuk HTTP POST form (sesuaikan parameter
   dengan yang kamu temukan lewat Burp Suite/inspect element di
   `/login`):
   ```bash
   hydra -l admin -P /usr/share/wordlists/xxxx.txt IP-TARGET -s 4000 http-post-form \
     "/login:username=^USER^&password=^PASS^:Login gagal"
   ```

## Tools Kali yang relevan

- `nmap -sV IP-TARGET` — cek port & service yang jalan
- `gobuster dir -u http://IP-TARGET:4000 -w wordlist.txt` — cari path tersembunyi
- `hydra` — brute force login form
- Burp Suite — intercept & analisis request `/login` sebelum brute force

## Catatan

Kalau di source code kamu penasaran dan buka `server.js` langsung, ya
memang jawabannya kelihatan semua — namanya juga lab buatan sendiri.
Coba dulu tanpa buka source, baru cek kalau benar-benar stuck, biar
latihannya berasa.
