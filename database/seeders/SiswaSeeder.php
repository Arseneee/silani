<?php

namespace Database\Seeders;

use App\Models\Siswa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiswaSeeder extends Seeder
{
    public function run(): void
    {
        Siswa::insert([
            ['nisn' => "101", 'nama' => "Naruto", 'kelas_id' => 1, 'nama_ortu' => "Anto", 'hp_ortu' => "089585438423", 'total_poin' => 0, 'status' => "Aktif"],
            ['nisn' => "102", 'nama' => "Sasuke", 'kelas_id' => 3, 'nama_ortu' => "Rizal", 'hp_ortu' => "089995734978", 'total_poin' => 0, 'status' => "Aktif"],
            ['nisn' => "103", 'nama' => "Kakashi", 'kelas_id' => 5, 'nama_ortu' => "Malik", 'hp_ortu' => "086234411437", 'total_poin' => 0, 'status' => "Aktif"],
            ['nisn' => "104", 'nama' => "Minato", 'kelas_id' => 7, 'nama_ortu' => "Junaidi", 'hp_ortu' => "086312347689", 'total_poin' => 0, 'status' => "Aktif"],
            ['nisn' => "105", 'nama' => "Neji", 'kelas_id' => 9, 'nama_ortu' => "Thomas", 'hp_ortu' => "092243239809", 'total_poin' => 0, 'status' => "Aktif"],
        ]);
    }
}
