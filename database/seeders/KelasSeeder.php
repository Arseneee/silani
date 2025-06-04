<?php

namespace Database\Seeders;

use App\Models\Kelas;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KelasSeeder extends Seeder
{
    public function run(): void
    {
        Kelas::insert([
            ['nama' => 'X - DPIB', 'user_id' => 2, 'jumlah_siswa' => 25],
            ['nama' => 'X - TGS', 'user_id' => 2, 'jumlah_siswa' => 25],
            ['nama' => 'X - BKP', 'user_id' => 2, 'jumlah_siswa' => 25],
            ['nama' => 'XI - TITL', 'user_id' => 2, 'jumlah_siswa' => 24],
            ['nama' => 'XI - TPL', 'user_id' => 2, 'jumlah_siswa' => 24],
            ['nama' => 'XI - TKRO', 'user_id' => 2, 'jumlah_siswa' => 24],
            ['nama' => 'XII- RPL', 'user_id' => 2, 'jumlah_siswa' => 27],
            ['nama' => 'XII- TKJ', 'user_id' => 2, 'jumlah_siswa' => 27],
            ['nama' => 'XII- TPM', 'user_id' => 2, 'jumlah_siswa' => 27],
        ]);
    }
}
