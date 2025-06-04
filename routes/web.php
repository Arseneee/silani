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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('siswa', SiswaController::class);
    Route::resource('users', UserController::class);
    Route::resource('peraturan', PeraturanController::class);
    Route::resource('kelas', KelasController::class);
    Route::resource('pelanggaran', PelanggaranController::class);
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/system-logs', [SystemLogController::class, 'index'])->name('system-logs.index');
    Route::resource('devices', DeviceController::class);
    Route::post('devices/status', [DeviceController::class, 'checkDeviceStatus']);
});

Route::middleware(['web', 'auth'])->group(function () {
    Route::post('/devices/activate', [DeviceController::class, 'activate']);
});

Route::get('/api/search', [PelanggaranController::class, 'search']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
