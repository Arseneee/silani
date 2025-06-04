<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\LogActivity;

class KelasController extends Controller
{
    public function index()
    {
        $kelas = Kelas::with('waliKelas')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama' => $item->nama,
                'user_id' => $item->user_id,
                'jumlah_siswa' => $item->jumlah_siswa,
                'waliKelas' => $item->waliKelas ? [
                    'name' => $item->waliKelas->name
                ] : null
            ];
        });

        $waliKelasOptions = User::where('role', 'Wali Kelas')->get(['id', 'name']);

        return Inertia::render('Kelas/Index', [
            'kelas' => $kelas,
            'waliKelasOptions' => $waliKelasOptions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
            'jumlah_siswa' => 'nullable|integer|min:0',
        ]);

        $kelas = Kelas::create($validated);

        LogActivity::add('create', "Menambahkan kelas {$kelas->nama}");

        return redirect()->back()->with('success', 'Kelas berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id);
        $oldData = $kelas->toArray(); 

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
            'jumlah_siswa' => 'nullable|integer|min:0',
        ]);

        $kelas->update($validated);
        $newData = $kelas->toArray();

        if ($oldData['nama'] !== $newData['nama']) {
            LogActivity::add('update', "Mengubah nama kelas dari {$oldData['nama']} menjadi {$newData['nama']}");
        }

        if ($oldData['jumlah_siswa'] !== $newData['jumlah_siswa']) {
            LogActivity::add('update', "Mengubah jumlah siswa pada kelas {$kelas->nama} dari {$oldData['jumlah_siswa']} menjadi {$newData['jumlah_siswa']}");
        }

        if ($oldData['user_id'] !== $newData['user_id']) {
            $oldWali = $oldData['user_id'] ? User::find($oldData['user_id'])->name : 'Belum ditentukan';
            $newWali = $newData['user_id'] ? User::find($newData['user_id'])->name : 'Belum ditentukan';
            LogActivity::add('update', "Mengubah wali kelas pada {$kelas->nama} dari {$oldWali} menjadi {$newWali}");
        }

        return redirect()->back()->with('success', 'Kelas berhasil diperbarui');
    }

    public function destroy($id)
    {
        $kelas = Kelas::findOrFail($id);
        $namaKelas = $kelas->nama;
        $kelas->delete();

        LogActivity::add('delete', "Menghapus kelas {$namaKelas}");

        return redirect()->back()->with('success', 'Kelas berhasil dihapus');
    }
}
