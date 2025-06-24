<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\PelanggaranController;
use App\Http\Controllers\PeraturanController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\SystemLogController;
use App\Http\Controllers\UserController;
use App\Models\Peraturan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'role:Admin'])->group(function () {
    Route::resource('users', UserController::class);
    Route::resource('kelas', KelasController::class);
    Route::get('laporan', [PelanggaranController::class, 'laporan'])->name('laporan.pelanggaran');
    Route::get('/laporan/cetak', [PelanggaranController::class, 'cetak'])->name('laporan.pelanggaran.cetak');
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/system-logs', [SystemLogController::class, 'index'])->name('system-logs.index');
    Route::resource('devices', DeviceController::class);
});

Route::middleware(['auth', 'verified', 'WaliKelas'])->group(function () {
    Route::get('wkdashboard', [DashboardController::class, 'walikelas'])->name('wkdashboard');
});

Route::middleware(['auth', 'verified', 'GuruBK'])->group(function () {
    Route::get('bkdashboard', [DashboardController::class, 'gurubk'])->name('bkdashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('siswa', SiswaController::class);
    Route::resource('pelanggaran', PelanggaranController::class);
    Route::resource('peraturan', PeraturanController::class);
});



Route::get('/api/search', [PelanggaranController::class, 'search']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
