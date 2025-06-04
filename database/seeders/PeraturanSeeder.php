<?php

namespace Database\Seeders;

use App\Models\Peraturan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PeraturanSeeder extends Seeder
{
    public function run(): void
    {
        Peraturan::insert([
            ['jenis' => 'Makan Dan Minum Di Dalam Ruang Kelas', 'kategori' => 'Ringan', 'poin' => 5],
            ['jenis' => 'Terlambat Masuk Sekolah Maupun Masuk Kelas', 'kategori' => 'Ringan', 'poin' => 5],
            ['jenis' => 'Memodifikasi Knalpot Kendaraan', 'kategori' => 'Ringan', 'poin' => 10],
            ['jenis' => 'Tidak Mengikuti Upacara Bendera', 'kategori' => 'Ringan', 'poin' => 10],
            ['jenis' => 'Membawa Senjata Tajam Kesekolah (Bukan Untuk Praktek)', 'kategori' => 'Sedang', 'poin' => 25],
            ['jenis' => 'Mengotori Dan Merusak Fasilitas Sekolah', 'kategori' => 'Sedang', 'poin' => 25],
            ['jenis' => 'Keluar Pekarangan Sekolah Dengan Melompati Pagar', 'kategori' => 'Sedang', 'poin' => 50],
            ['jenis' => 'Berkelahi Atau Tawuran Antara Peserta Didik Satu Sekolah Atau Dengan Sekolah Lain', 'kategori' => 'Sedang', 'poin' => 50],
            ['jenis' => 'Berjudi, Membawa Dan Meminum Minuman Keras', 'kategori' => 'Berat', 'poin' => 75],
            ['jenis' => 'Melakukan Tindakan Pemalsuan Administrasi ', 'kategori' => 'Berat', 'poin' => 75],
            ['jenis' => 'Menggunakan Dan Atau Mengedarkan Narkoba', 'kategori' => 'Berat', 'poin' => 100],
            ['jenis' => 'Melakukan Pergaulan Bebas Dengan Segala Resikonya', 'kategori' => 'Berat', 'poin' => 100],
        ]);
    }
}
