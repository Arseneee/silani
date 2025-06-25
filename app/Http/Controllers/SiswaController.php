<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Helpers\LogActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'Wali Kelas') {
            $kelas = Kelas::where('user_id', $user->id)->first();

            $siswa = $kelas
                ? Siswa::where('kelas_id', $kelas->id)->with('kelas')->get()
                : collect();
        } else {
            $siswa = Siswa::with('kelas')->get();
        }

        return inertia('Siswa/Index', [
            'siswa' => $siswa,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nisn' => 'required|string|max:20|unique:siswa,nisn',
            'nama' => 'required|string|max:100',
            'kelas_id' => 'required|exists:kelas,id',
            'nama_ortu' => 'required|string|max:100',
            'hp_ortu' => 'required|numeric',
            'status' => 'required|in:Aktif,SPO1,SPO2,SPO3,Drop Out',
        ]);

        $data['total_poin'] = 0;
        $siswa = Siswa::create($data);

        LogActivity::add('create', "Menambahkan siswa baru: {$siswa->nama} (NISN: {$siswa->nisn})");

        return redirect()->route('siswa.index')->with('success', 'Siswa berhasil ditambahkan');
    }

    public function update(Request $request, Siswa $siswa)
    {
        $old = $siswa->toArray();

        $data = $request->validate([
            'nisn' => 'required|string|max:20|unique:siswa,nisn,' . $siswa->id,
            'nama' => 'required|string|max:100',
            'kelas_id' => 'required|exists:kelas,id',
            'nama_ortu' => 'required|string|max:100',
            'hp_ortu' => 'required|numeric',
            'status' => 'required|in:Aktif,SPO1,SPO2,SPO3,Drop Out',
        ]);

        $siswa->update($data);
        $new = $siswa->toArray();

        if ($old['nisn'] !== $new['nisn']) {
            LogActivity::add('update', "Mengubah NISN siswa {$new['nama']} dari {$old['nisn']} menjadi {$new['nisn']}");
        }
        if ($old['nama'] !== $new['nama']) {
            LogActivity::add('update', "Mengubah nama siswa dari {$old['nama']} menjadi {$new['nama']}");
        }
        if ($old['kelas_id'] !== $new['kelas_id']) {
            $kelasLama = Kelas::find($old['kelas_id'])->nama ?? 'Tidak Diketahui';
            $kelasBaru = Kelas::find($new['kelas_id'])->nama ?? 'Tidak Diketahui';
            LogActivity::add('update', "Memindahkan siswa {$new['nama']} dari kelas {$kelasLama} ke {$kelasBaru}");
        }
        if ($old['nama_ortu'] !== $new['nama_ortu']) {
            LogActivity::add('update', "Mengubah nama ortu siswa {$new['nama']} dari {$old['nama_ortu']} menjadi {$new['nama_ortu']}");
        }
        if ($old['hp_ortu'] !== $new['hp_ortu']) {
            LogActivity::add('update', "Mengubah no HP ortu siswa {$new['nama']} dari {$old['hp_ortu']} menjadi {$new['hp_ortu']}");
        }
        if ($old['status'] !== $new['status']) {
            LogActivity::add('update', "Mengubah status siswa {$new['nama']} dari {$old['status']} menjadi {$new['status']}");
        }

        return redirect()->route('siswa.index')->with('success', 'Siswa berhasil diperbarui');
    }

    public function destroy(Siswa $siswa)
    {
        LogActivity::add('delete', "Menghapus siswa: {$siswa->nama} (NISN: {$siswa->nisn})");

        $siswa->delete();

        return redirect()->route('siswa.index')->with('success', 'Siswa berhasil dihapus');
    }
}
