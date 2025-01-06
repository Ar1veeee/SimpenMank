
# SimpenMank

## Deskripsi
Aplikasi **SimpenMank** adalah alat untuk membantu pengguna melacak pengeluaran dan pemasukan mereka secara efisien. Dengan antarmuka yang sederhana dan fitur yang intuitif, aplikasi ini dirancang untuk memudahkan pengelolaan keuangan harian.

---

## Fitur Utama
- **Pencatatan Transaksi**: Tambahkan pemasukan atau pengeluaran dengan kategori yang disesuaikan.
- **Riwayat Transaksi**: Lihat daftar lengkap transaksi sebelumnya.
- **Pengaturan Dompet**: Memilah transaksi berdasarkan jenis dompet.
- **Pengaturan Kategori**: Memilah transaksi berdasarkan kategori.

---

## Teknologi yang Digunakan
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Hosting**: Cloud Run
- **Autentikasi**: OAuth 2.0 / JWT / ACCOUNT

---

## Instalasi dan Pengaturan

### Prasyarat
1. Pastikan Anda memiliki **Node.js** (v14 atau lebih baru) dan **npm/yarn** terpasang di komputer.
2. Database yang sudah dikonfigurasi.

### Langkah Instalasi
1. Clone repositori ini:
    ```bash
    git clone https://github.com/username/SimpenMank.git
    cd money-tracker
    ```
2. Instal dependensi:
    ```bash
    npm install
    # atau jika menggunakan yarn
    yarn install
    ```
3. Konfigurasikan file `.env`:
    - Salin file `.env.example` menjadi `.env`
    - Isi nilai variabel lingkungan seperti URL database, kunci API, dsb.
4. Jalankan aplikasi:
    ```bash
    npm start
    # atau
    yarn start
    ```

---

## API Dokumentasi

| Endpoint                                | Method | Deskripsi                              |
|-----------------------------------------|--------|----------------------------------------|
| `/auth/google`                          | GET    | Autentikasi Google Account             |
| `/auth/google/callback`                 | GET    | Autentikasi Google Account             |
| `/auth/register`                        | POST   | Autentikasi Email Account              |
| `/aut/login`                            | POST   | Autentikasi Email Account              |
| `/profile/:user_id`                     | GET    | Menampilkan Informasi Pengguna         |
| `/profile/:user_id/password`            | PATCH  | Mengubah Password Pengguna             |
| `/transaction/:user_id`                 | GET    | Menampilkan Transaksi Pengguna         |
| `/transaction/:user_id/income`          | POST   | Menambahkan income transaksi baru      |
| `/transaction/:user_id/expense`         | POST   | Menambahkan expense transaksi baru     |
| `/transaction/:user_id/:transaction_id` | DELETE | Menghapus transaksi                    |
| `/wallet/:user_id`                      | GET    | Menampilkan Dompet Pengguna            |
| `/wallet/:user_id`                      | POST   | Menambahkan Dompet Pengguna            |
| `/category/:user_id/:type`              | GET    | Menambahkan Dompet Pengguna            |
| `/category/:user_id/income`             | POST   | Menambahkan Dompet Pengguna            |
| `/category/:user_id/expense`            | POST   | Menambahkan Dompet Pengguna            |

---

## Contributing
Kami sangat menyambut kontribusi dari komunitas! Jika Anda ingin menyumbangkan kode, silakan ikuti langkah berikut:
1. Fork repositori ini.
2. Buat branch fitur baru: `git checkout -b feature/nama-fitur`.
3. Commit perubahan Anda: `git commit -m 'Menambahkan fitur nama-fitur'`.
4. Push ke branch Anda: `git push origin feature/nama-fitur`.
5. Buat pull request.

---

## Pengembang
Alief Arifin Mahardiko ([Ar1veeee](https://github.com/Ar1veeee))

---

## Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

## Kontak
Jika ada pertanyaan, silakan hubungi kami di aliefarifin99@gmail.com atau kunjungi [Instagram](https://instagram.com/aliefarfn).
