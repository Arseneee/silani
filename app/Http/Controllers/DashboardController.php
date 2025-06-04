<?php

namespace App\Http\Controllers;

use App\Models\Pelanggaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $total = Pelanggaran::count();
        $selesai = Pelanggaran::where('status', 'Selesai')->count();
        $diproses = Pelanggaran::where('status', 'Diproses')->count();
        $ditunda = Pelanggaran::where('status', 'Ditunda')->count();
        

        $pelanggaranPerBulan = Pelanggaran::selectRaw("DATE_FORMAT(waktu_terjadi, '%b %Y') as bulan, COUNT(*) as jumlah")
            ->whereYear('waktu_terjadi', now()->year)
            ->groupBy('bulan')
            ->orderByRaw("MIN(waktu_terjadi)")
            ->get();

        return Inertia::render('dashboard', [
            'total' => $total,
            'selesai' => $selesai,
            'diproses' => $diproses,
            'ditunda' => $ditunda,
            'pelanggaranPerBulan' => $pelanggaranPerBulan,
        ]);
    }
}
