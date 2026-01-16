# Gamepad Tester

Website untuk testing dan debugging gamepad/controller menggunakan React dan HTML5 Gamepad API.

## Fitur

- ✅ Deteksi gamepad yang terhubung secara real-time
- ✅ Tampilan status semua button (pressed/touched/released)
- ✅ Visualisasi joystick/analog stick dengan deadzone detection
- ✅ Kontrol vibration (jika didukung oleh gamepad)
- ✅ Informasi detail gamepad (ID, mapping, jumlah button/axes)
- ✅ UI modern dan responsive
- ✅ Support multiple gamepad

## Teknologi

- **React 18** - UI framework
- **Vite** - Build tool
- **HTML5 Gamepad API** - API untuk akses gamepad

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka browser di `http://localhost:5173`

4. Hubungkan gamepad Anda dan tekan tombol apa saja untuk memulai

## Build untuk Production

```bash
npm run build
```

File hasil build akan berada di folder `dist/`

## Cara Menggunakan

1. Hubungkan gamepad/controller ke komputer Anda (via USB atau Bluetooth)
2. Buka website gamepad tester
3. Tekan tombol apa saja pada gamepad untuk mengaktifkan
4. Website akan menampilkan:
   - Informasi gamepad (ID, mapping, dll)
   - Status semua button secara real-time
   - Visualisasi pergerakan joystick
   - Kontrol vibration (jika didukung)

## Catatan

- Gamepad API memerlukan interaksi user terlebih dahulu sebelum dapat digunakan
- Pastikan browser Anda mendukung HTML5 Gamepad API (Chrome, Firefox, Edge)
- Beberapa fitur seperti vibration mungkin tidak didukung oleh semua gamepad

## Lisensi

MIT

