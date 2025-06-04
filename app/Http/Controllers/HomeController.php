<?php

namespace App\Http\Controllers;

use App\Models\Pelanggaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $pelanggaran = Pelanggaran::with(['siswa:id,nisn,nama', 'user:id,name', 'peraturan:id,jenis'])
            ->when($search, function ($query, $search) {
                $query->whereHas('siswa', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nisn', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->get();

        return Inertia::render('Home', [
            'pelanggaran' => $pelanggaran,
            'search' => $search,
        ]);
    }
}
