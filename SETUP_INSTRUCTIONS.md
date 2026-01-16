# Instruksi Setup - Menyelesaikan PowerShell Execution Policy Error

## Solusi Cepat: Gunakan Command Prompt (CMD)

Jika Anda mendapat error PowerShell Execution Policy, gunakan **Command Prompt** atau **Git Bash** sebagai gantinya:

### Menggunakan Command Prompt:
1. Tekan `Win + R`
2. Ketik `cmd` dan tekan Enter
3. Navigate ke folder project:
   ```bash
   cd C:\Users\dwiki\Downloads\gamepad
   ```
4. Jalankan npm install:
   ```bash
   npm install
   ```

### Menggunakan Git Bash:
1. Buka Git Bash
2. Navigate ke folder project:
   ```bash
   cd /c/Users/dwiki/Downloads/gamepad
   ```
3. Jalankan npm install:
   ```bash
   npm install
   ```

---

## Solusi Alternatif: Ubah PowerShell Execution Policy

### Opsi A: Bypass untuk Session Saat Ini (Tidak Memerlukan Admin)

Jalankan command ini di PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npm install
```

### Opsi B: Ubah Execution Policy Permanen (Memerlukan Admin)

1. Buka PowerShell sebagai Administrator (Run as Administrator)
2. Jalankan command:
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Ketik `Y` untuk konfirmasi
4. Tutup PowerShell dan buka lagi
5. Jalankan `npm install` seperti biasa

### Opsi C: Gunakan npx (Tidak Memerlukan npm install)

Anda bisa langsung menjalankan dengan npx:

```powershell
npx vite
```

Namun ini akan install dependencies setiap kali (lebih lambat).

---

## Rekomendasi

**Paling mudah:** Gunakan Command Prompt (CMD) - tidak ada masalah execution policy.

**Setelah npm install selesai:**

1. Jalankan development server:
   ```bash
   npm run dev
   ```

2. Buka browser di `http://localhost:5173`

3. Hubungkan gamepad dan tekan tombol apa saja untuk mulai testing!

