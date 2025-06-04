<?php

namespace App\Http\Controllers;

use App\Models\Peraturan;
use App\Helpers\LogActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PeraturanController extends Controller
{
    public function index()
    {
        $peraturan = Peraturan::all();

        return Inertia::render('Peraturan/Index', [
            'peraturan' => $peraturan
        ]);
    }

    public function create()
    {
        return Inertia::render('Peraturan/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis' => 'required|string|max:255',
            'kategori' => 'required|string|in:Ringan,Sedang,Berat',
            'poin' => 'required|integer|min:0',
        ]);

        $peraturan = Peraturan::create($validated);

        LogActivity::add('create', "Menambahkan peraturan: {$peraturan->jenis} (Kategori: {$peraturan->kategori}, Poin: {$peraturan->poin})");

        return redirect()->route('peraturan.index')
            ->with('message', 'Peraturan berhasil ditambahkan.');
    }

    public function edit(Peraturan $peraturan)
    {
        return Inertia::render('Peraturan/Edit', [
            'peraturan' => $peraturan
        ]);
    }

    public function update(Request $request, Peraturan $peraturan)
    {
        $old = $peraturan->toArray();

        $validated = $request->validate([
            'jenis' => 'required|string|max:255',
            'kategori' => 'required|string|in:Ringan,Sedang,Berat',
            'poin' => 'required|integer|min:0',
        ]);

        $peraturan->update($validated);
        $new = $peraturan->toArray();

        if ($old['jenis'] !== $new['jenis']) {
            LogActivity::add('update', "Mengubah jenis peraturan dari '{$old['jenis']}' menjadi '{$new['jenis']}'");
        }

        if ($old['kategori'] !== $new['kategori']) {
            LogActivity::add('update', "Mengubah kategori peraturan '{$new['jenis']}' dari '{$old['kategori']}' menjadi '{$new['kategori']}'");
        }

        if ($old['poin'] !== $new['poin']) {
            LogActivity::add('update', "Mengubah poin peraturan '{$new['jenis']}' dari {$old['poin']} menjadi {$new['poin']}");
        }

        return redirect()->route('peraturan.index')
            ->with('message', 'Peraturan berhasil diperbarui.');
    }

    public function destroy(Peraturan $peraturan)
    {
        LogActivity::add('delete', "Menghapus peraturan: {$peraturan->jenis} (Kategori: {$peraturan->kategori}, Poin: {$peraturan->poin})");

        $peraturan->delete();

        return redirect()->route('peraturan.index')
            ->with('message', 'Peraturan berhasil dihapus.');
    }
}