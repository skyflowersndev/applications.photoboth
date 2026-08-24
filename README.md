# 🌸 SkyFlowers Booth

**SkyFlowers Booth** adalah aplikasi photo booth berbasis web dengan tampilan *cute*, bernuansa **pastel Y2K ala Pinterest**. Aplikasi ini berjalan langsung di browser, mengakses kamera device (webcam laptop, kamera eksternal, atau kamera HP yang dijadikan webcam), lalu menghasilkan strip foto ala photo booth klasik yang bisa dihias dan diunduh.

Semua proses — mulai dari kamera, pengambilan foto, filter, dekorasi, sampai penyimpanan — berjalan sepenuhnya di sisi browser (client-side). Tidak ada foto yang diunggah ke server manapun.

---

## ✨ Fitur

- **Live camera preview** — mendukung banyak kamera sekaligus, bisa dipilih lewat dropdown (webcam internal, kamera eksternal, atau kamera HP via aplikasi virtual cam).
- **Sesi jepret otomatis 4x** — dengan hitung mundur 3-2-1 di tiap sesi, lengkap efek flash.
- **Filter foto ala Y2K/Pinterest aesthetic** — 8 pilihan gaya: polos, y2k flash, film vintage, soft dreamy, vhs retro, pink wash, b&w film, chrome cool. Filter langsung terbakar ke hasil foto, bukan cuma efek sementara.
- **Bentuk frame bisa dipilih** — potrait, landscape, atau bentuk hati (love) — berlaku untuk preview kamera maupun hasil strip.
- **Motif/warna strip (strap) bergaya Pinterest** — 17 pilihan seperti chrome holo, gingham pastel, cherry picnic, lilac bloom, strawberry milk, butter daisy, denim blue, newspaper, sunset retro, hingga hitam solid.
- **Stiker interaktif** — 16 pilihan stiker lucu (🎀 ✿ ⭐️ 💗 ☁︎ ✨ 🍓 🧸 🦋 🌷 💌 🍒 🐰 🌈 😽 🍥) yang bisa ditempel bebas di posisi manapun pada tiap foto, dan dihapus dengan sekali tap.
- **Pilihan caption** — beberapa caption siap pakai untuk strip foto.
- **Simpan strip foto** — hasil akhir (4 foto + stiker + caption + motif strip + bentuk frame) diunduh otomatis sebagai satu file `.jpg`, persis seperti yang terlihat di preview.

---

## 🖥️ Cara Menjalankan

1. Unduh file `photo-booth-cute.html`.
2. Karena akses kamera browser (`getUserMedia`) memerlukan konteks aman, disarankan untuk meng-host file ini, bukan membukanya langsung sebagai file lokal. Beberapa opsi gratis:
   - [GitHub Pages](https://pages.github.com)
   - [Netlify](https://www.netlify.com) / [Vercel](https://vercel.com)
   - Menjalankan local server, misalnya `npx serve` atau `python -m http.server`
3. Buka halaman di browser (Chrome/Edge/Safari versi terbaru direkomendasikan).
4. Izinkan akses kamera saat diminta.
5. Atur bentuk frame, filter, caption, dan motif strip sesuai selera.
6. Tekan **"nyalain kamera"**, lalu **"jepret 4x"**.
7. Tempel stiker sesuka hati, lalu tekan **"simpan foto"** untuk mengunduh strip.

---

## 🧰 Teknologi yang Digunakan

- **HTML, CSS, JavaScript murni** (vanilla) — tanpa framework maupun library eksternal.
- **`navigator.mediaDevices.getUserMedia()`** — untuk akses kamera dan daftar device.
- **Canvas API** — untuk mengambil snapshot dari video, menerapkan filter, menggambar stiker, motif strip, dan menyusun strip foto final ke satu gambar unduhan.
- **CSS `mask-image`** — untuk bentuk frame hati (love).
- Font: [Caveat](https://fonts.google.com/specimen/Caveat) & [Quicksand](https://fonts.google.com/specimen/Quicksand) dari Google Fonts.

---

## 📁 Struktur File

```
├── photo-booth-cute.html         # Aplikasi utama (single-file, siap jalan)
├── skyflowers-booth-logo.svg     # Logo versi warna-warni cerah
├── skyflowers-booth-logo-red.svg # Logo versi maroon, minimalis tanpa teks
└── README.md                     # Dokumen ini
```

---

## 🎨 Identitas Visual

Logo **SkyFlowers Booth** menggabungkan unsur **bunga** (melambangkan keceriaan & estetika Y2K/Pinterest) dan **kamera** (inti fungsi aplikasi). Tersedia dua varian:
- Versi warna-warni cerah dengan wordmark, untuk header aplikasi.
- Versi latar maroon tanpa teks, untuk ikon/thumbnail.

---

## ⚠️ Catatan

- Browser akan meminta izin kamera setiap sesi baru dibuka.
- Tidak ada data (foto, stiker, pengaturan) yang tersimpan permanen atau dikirim ke server — semua sementara di memori browser selama halaman terbuka.
- Untuk pengalaman terbaik, gunakan browser modern (Chrome, Edge, atau Safari versi terbaru) di desktop maupun mobile.

---

Dibuat dengan 🩷 untuk momen-momen manis yang layak diabadikan.
