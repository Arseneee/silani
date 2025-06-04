<?php

namespace Database\Seeders;

use App\Models\Pelanggaran;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PelanggaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pelanggaran::insert([
            ['siswa_id' => 1, 'user_id' => 1, 'peraturan_id' => 1, 'status' => "selesai", 'keterangan' => "Makan dikelas", 'waktu_terjadi' => Carbon::now()->subDays(2)],
            ['siswa_id' => 2, 'user_id' => 2, 'peraturan_id' => 2, 'status' => "selesai", 'keterangan' => "Datang terlambat", 'waktu_terjadi' => Carbon::now()->subDays(1)],
            ['siswa_id' => 3, 'user_id' => 3, 'peraturan_id' => 3, 'status' => "selesai", 'keterangan' => "Knalpot motor bising", 'waktu_terjadi' => Carbon::now()],
            ['siswa_id' => 4, 'user_id' => 4, 'peraturan_id' => 6, 'status' => "diproses", 'keterangan' => "Merusak meja", 'waktu_terjadi' => Carbon::now()],
            ['siswa_id' => 5, 'user_id' => 1, 'peraturan_id' => 8, 'status' => "ditunda", 'keterangan' => "Berkelahi", 'waktu_terjadi' => Carbon::now()->subDays(1)],
        ]);
    }
}
