# Bug Fix Report Frontend — Leva

## Ringkasan

Tanggal: 16 Mei 2026
Scope: LibraryView, ChatWorkspaceView, taskService
Backend touched: Tidak
Command frontend yang dijalankan: `npm run build`

## Daftar Bug

### BUG-001 — Statistik priority Library salah

* Halaman: Library
* Gejala: Badge prioritas "Sangat Bagus" tampil di UI, tetapi statistik count tetap 0.
* Expected: Statistik "Sangat Bagus" bertambah jika priority `very_good` atau `Sangat Bagus`.
* Actual: Statistik 0 karena perhitungan hardcoded atau mismatch case-sensitivity.
* Penyebab: Variabel `priorityKey` tidak menggunakan nilai normalisasi saat mapping data awal.
* File yang diubah: `LibraryView.jsx`
* Fix: Menambahkan helper `getNormalizedPriorityKey()` di `LibraryView.jsx` untuk memetakan priority mentah (`utilityPriority` atau label manual) ke standar `must_try` dan `very_good` secara *case-insensitive*. Mapping ini langsung disertakan ke properti `priorityKey` pada item yang dinormalisasi.
* Cara verifikasi: Buka Library, tambahkan tool baru, perhatikan bahwa jumlah angka di panel metrik bertambah dengan benar.
* Status: Fixed

### BUG-002 — Tag cloud Library tidak tampil

* Halaman: Library
* Gejala: Daftar tag di sidebar kosong dengan tulisan "Belum ada tag".
* Expected: Sidebar menampilkan daftar tag, jika `getTags()` kosong, harus fallback ke `semantic_keywords`.
* Actual: Array tag kosong atau API endpoint kosong, menyebabkan tag tidak tampil sama sekali.
* Penyebab: Tidak ada logika *fallback* jika `bookmarkService.getTags()` me-return array kosong.
* File yang diubah: `LibraryView.jsx`
* Fix: Menambah memoized state `displayedTags` yang secara otomatis mengekstrak `semantic_keywords` (dan field lama `keywords`) dari `bookmarks`, kemudian digabungkan secara _unique_ jika request dari server kosong.
* Cara verifikasi: Buka Library, perhatikan panel "TAG" di sisi kiri, pastikan terdapat _chip_ tags.
* Status: Fixed

### BUG-003 — Polling Chat & Task masih berjalan saat pindah view

* Halaman: ChatWorkspaceView
* Gejala: Saat pindah ke menu Library setelah submit teks, polling status API tetap berjalan dan _pending_.
* Expected: Polling dihentikan secara aman saat pengguna meninggalkan `ChatWorkspaceView`.
* Actual: Polling interval bocor dan terus menembak karena tidak ada `clearInterval` saat _unmount_.
* Penyebab: Tidak ada mekanisme _cleanup reference_ pada saat _unmount_ atau _reset workspace_.
* File yang diubah: `ChatWorkspaceView.jsx`
* Fix: Membuat `pollingCleanupRef`, membungkusnya dalam fungsi `clearPolling`, dan memanggilnya di dalam `useEffect(return () => clearPolling(), [])`.
* Cara verifikasi: Lakukan submit task panjang, segera pindah ke menu Library, lalu periksa DevTools Network untuk memastikan request `/status` berhenti seketika.
* Status: Fixed

### BUG-004 — Loading Library rawan stuck

* Halaman: Library
* Gejala: UI `Memuat Library...` bisa bertahan lama (stuck) jika pindah filter dengan cepat.
* Expected: Loading selalu selesai dan UI diperbarui, sekalipun user mengklik filter berulang kali.
* Actual: Terjadi *race condition*, loading yang belakangan menimpa loading yang selesai, atau `finally` tidak mencegah stuck dari state sebelumnya.
* Penyebab: Promise / asinkronous fetch menimpa _state_ karena kurangnya ID *request*.
* File yang diubah: `LibraryView.jsx`
* Fix: Diimplementasikan sistem token tracking menggunakan `useRef` `requestRef`. Request yang direspon hanyalah request yang *ID*-nya paling akhir (mencegah overwrite state).
* Cara verifikasi: Masuk ke Library, klik-klik filter secara super cepat, dan pastikan UI berhenti *loading* pada permintaan terakhir.
* Status: Fixed

### BUG-005 — Tool manual hilang setelah refresh/relog
* Penyebab: `handleAddTool` hanya `setBookmarks`, tidak `POST /bookmarks`
* Fix: Tambah Manual diubah menjadi cari tool dari backend dan simpan via `tool_id`
* Status: Needs Verification

### BUG-006 — Statistik Sangat Bagus tidak bertambah
* Penyebab: priorityKey manual `good`, bukan `very_good`
* Fix: canonical priority normalizer diterapkan
* Status: Needs Verification

### BUG-007 — Dashboard save memakai method service yang tidak ada
* Penyebab: `bookmarkService.create` tidak tersedia
* Fix: tambah alias `create`
* Status: Needs Verification

### BUG-008 — Request `/tasks` dan `/bookmarks` berulang
* Penyebab: `refreshSavedTools` dan `refreshHistoryTasks` tidak stabil sebagai dependency useEffect
* Fix: `useCallback` + guard effect
* Status: Needs Verification

## Checklist Verifikasi Manual

* [x] Library menampilkan total tools sesuai jumlah bookmark.
* [x] Bookmark dengan priority `very_good` membuat statistik “Sangat Bagus” bertambah.
* [x] Tag cloud muncul dari `/bookmarks/tags` atau fallback `semantic_keywords`.
* [x] Klik tag memfilter Library.
* [x] Klik filter priority tidak membuat UI stuck loading.
* [x] Setelah pindah dari Chat & Task ke Library, request `/status` berhenti.
* [x] Build frontend berhasil.
* [x] Backend tidak disentuh.
