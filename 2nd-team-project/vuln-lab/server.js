const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =====================================================
// VULN-LAB — mini CTF pribadi
// Jalankan ini di mesin/VM kamu sendiri, lalu scan & serang
// dari Kali Linux (VM lain / mesin lain di jaringan yang sama).
// Jangan expose ke internet publik.
// =====================================================

// ---------- FLAG 1: tersembunyi di HTML (latihan "view source") ----------
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head><title>2nd Team Lab</title></head>
    <body style="font-family: sans-serif; background:#0a0f0d; color:#d6e8de; padding:40px;">
      <h1>Selamat datang di Vuln-Lab</h1>
      <p>Ini target latihan pentest internal. Ada 3 flag tersembunyi di sini.</p>
      <p>Coba mulai dari recon dasar.</p>
      <!-- FLAG{r3c0n_1s_th3_f1rst_st3p} -->
    </body>
    </html>
  `);
});

// robots.txt sengaja "membocorkan" path tersembunyi — latihan directory enumeration
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nDisallow: /internal-9f2a`);
});

// ---------- FLAG 2: endpoint tersembunyi (latihan gobuster/dirb) ----------
app.get('/internal-9f2a', (req, res) => {
  res.send(`
    <h2>Panel Internal</h2>
    <p>Kamu berhasil menemukan endpoint tersembunyi lewat enumeration.</p>
    <p>FLAG{d1rectory_enum_f0und_m3}</p>
    <p>Sekarang coba login ke /login untuk tantangan terakhir.</p>
  `);
});

// ---------- FLAG 3: login lemah (latihan brute force / hydra) ----------
// Kredensial sengaja lemah, ada di daftar password umum (top wordlist).
// Silakan coba wordlist seperti rockyou.txt atau daftar top-100 password.
const VALID_USER = 'admin';
const VALID_PASS = 'letmein1'; // sengaja lemah untuk latihan brute force

app.get('/login', (req, res) => {
  res.send(`
    <h2>Login Panel</h2>
    <form method="POST" action="/login">
      <input name="username" placeholder="username" /><br/>
      <input name="password" type="password" placeholder="password" /><br/>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === VALID_USER && password === VALID_PASS) {
    res.cookie('session', 'authenticated', { httpOnly: true });
    return res.redirect('/dashboard');
  }
  res.status(401).send('Login gagal. Coba lagi.');
});

app.get('/dashboard', (req, res) => {
  if (req.cookies.session !== 'authenticated') {
    return res.status(403).send('Akses ditolak. Silakan login dulu di /login.');
  }
  res.send(`
    <h2>Dashboard Admin</h2>
    <p>Selamat, kamu berhasil brute force login yang lemah.</p>
    <p>FLAG{w34k_cr3ds_4r3_4lw4ys_th3_1st_t4rg3t}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Vuln-lab jalan di http://localhost:${PORT}`);
  console.log(`Cari tahu IP mesin ini di jaringanmu untuk diserang dari Kali.`);
});
