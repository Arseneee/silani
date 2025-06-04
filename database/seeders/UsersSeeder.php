<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        User::insert([
            ['name' => 'Hafizh Haritsyah', 'email' => 'admin@silani.com', 'password' => Hash::make('admin123'), 'role' => 'Admin'],
            ['name' => 'Farhanuddin', 'email' => 'walikelas@silani.com', 'password' => Hash::make('walikelas123'), 'role' => 'Wali Kelas'],
            ['name' => 'RA. Ghina Zahidah', 'email' => 'gurubk@silani.com', 'password' => Hash::make('gurubk123'), 'role' => 'Guru BK'],
        ]);
    }
}
