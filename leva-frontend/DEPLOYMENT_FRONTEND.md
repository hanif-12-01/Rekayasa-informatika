# Dokumentasi Deployment Frontend Leva

Dokumentasi ini berisi panduan untuk menjalankan dan men-deploy frontend React Vite dari proyek Leva.

## Cara Menjalankan Lokal

1. Instalasi dependensi:
   ```bash
   npm install
   ```
2. Jalankan server development:
   ```bash
   npm run dev
   ```

## Cara Build untuk Production

Untuk melakukan build (menghasilkan folder `dist` siap deploy):
```bash
npm run build
```

## Cara Preview Build

Untuk melihat hasil build secara lokal:
```bash
npm run preview
```

## Environment Variable

Saat mendeploy frontend ke Vercel atau layanan hosting lain, Anda **wajib** menambahkan *Environment Variable* berikut:

- `VITE_API_BASE_URL`

**Contoh value untuk local:**
`http://localhost:8000/api`

**Contoh value untuk production:**
`https://backend-production-domain/api`

## Catatan Penting

- **CORS Error:** Jika terjadi *CORS error* saat frontend memanggil backend production, error tersebut **harus diperbaiki di konfigurasi backend/deployment backend** (misal konfigurasi origin di Laravel CORS), bukan dari sisi frontend.
- **Jangan Mengubah Endpoint:** Frontend tidak boleh mengubah struktur endpoint backend (URL endpoint dan payload format tetap sama sesuai `api.js`).
