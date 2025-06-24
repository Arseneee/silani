<?php

namespace App\Http\Controllers;

use App\Models\Pelanggaran;
use App\Models\Peraturan;
use App\Models\Siswa;
use App\Models\User;
use App\Helpers\LogActivity;
use App\Services\FonnteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class PelanggaranController extends Controller
{
    public function index()
    {
        $pelanggaran = Pelanggaran::with(['siswa', 'user', 'peraturan'])
            ->latest()
            ->get();

        $siswaOptions = Siswa::select('id', 'nama', 'nisn')->get();
        $userOptions = User::select('id', 'name')->get();
        $peraturanOptions = Peraturan::select('id', 'jenis')->get();

        return Inertia::render('Pelanggaran/Index', [
            'pelanggaran' => $pelanggaran,
            'siswaOptions' => $siswaOptions,
            'userOptions' => $userOptions,
            'peraturanOptions' => $peraturanOptions,
        ]);
        Log::info('Devices status:', $devices);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'user_id' => 'required|exists:users,id',
            'peraturan_id' => 'required|exists:peraturan,id',
            'status' => 'required|string',
            'keterangan' => 'nullable|string',
            'waktu_terjadi' => 'required|date',
        ]);

        $pelanggaran = Pelanggaran::create($validated);

        $this->updateTotalPoin($validated['siswa_id']);

        $pelanggaran->load(['siswa.kelas', 'peraturan']);

        $siswa = $pelanggaran->siswa;
        $peraturan = $pelanggaran->peraturan;

        LogActivity::add('create', "Pelanggaran ditambahkan untuk siswa {$siswa->nama} karena {$peraturan->jenis} ({$peraturan->kategori}) dengan status {$pelanggaran->status}");

        $ortuNoHp = FonnteService::normalizePhone($siswa->hp_ortu);
        $isValidHp = $ortuNoHp && preg_match('/^62[0-9]{9,}$/', $ortuNoHp);

        if ($isValidHp && $peraturan) {
            $pesan =
                "Kepada Yth.
Orangtua/Wali siswa
Nama  : {$siswa->nama}
NISN  : {$siswa->nisn}
Kelas : {$siswa->kelas->nama}
            
Anak anda melakukan pelanggaran di sekolah:
- Pelanggaran: {$peraturan->jenis}
- Status: {$pelanggaran->status}
- Waktu: {$pelanggaran->waktu_terjadi}
            
{$siswa->nama} memiliki total *{$siswa->total_poin}* poin,
dengan status: *{$siswa->status}*.

> SILANI | Pesan Otomatis                   SMK Negeri 1 Percut Sei Tuan";

            $response = FonnteService::sendMessage($ortuNoHp, $pesan);

            if (!isset($response['status']) || $response['status'] !== true) {
                Log::warning('Gagal kirim pesan WA via Fonnte', [
                    'nomor' => $ortuNoHp,
                    'response' => $response
                ]);

                LogActivity::add('fonnte', "Gagal kirim WA ke ortu siswa {$siswa->nama} ({$ortuNoHp})");
            } else {
                LogActivity::add('fonnte', "Berhasil kirim WA ke ortu siswa {$siswa->nama} ({$ortuNoHp})");
            }
        } else {
            Log::info('Nomor HP ortu tidak valid atau data pelanggaran tidak lengkap', [
                'siswa' => $siswa->nama,
                'hp_ortu' => $siswa->hp_ortu,
            ]);

            LogActivity::add('fonnte', "WA tidak dikirim karena nomor ortu tidak valid atau data pelanggaran tidak lengkap untuk siswa {$siswa->nama} ({$siswa->hp_ortu})");
        }

        return redirect()->back()->with('success', 'Pelanggaran berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $pelanggaran = Pelanggaran::findOrFail($id);
        $old = $pelanggaran->toArray();

        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswa,id',
            'user_id' => 'required|exists:users,id',
            'peraturan_id' => 'required|exists:peraturan,id',
            'status' => 'required|string',
            'keterangan' => 'nullable|string',
            'waktu_terjadi' => 'required|date',
        ]);

        $pelanggaran->update($validated);

        $logText = "Pelanggaran untuk siswa ID {$old['siswa_id']} diperbarui: ";
        if ($old['siswa_id'] != $validated['siswa_id']) {
            $logText .= "Siswa diubah dari ID {$old['siswa_id']} ke {$validated['siswa_id']}; ";
        }
        if ($old['peraturan_id'] != $validated['peraturan_id']) {
            $logText .= "Peraturan diubah dari ID {$old['peraturan_id']} ke {$validated['peraturan_id']}; ";
        }
        if ($old['status'] != $validated['status']) {
            $logText .= "Status diubah dari {$old['status']} ke {$validated['status']}; ";
        }

        LogActivity::add('update', rtrim($logText, '; '));

        if ($old['siswa_id'] != $validated['siswa_id']) {
            $this->updateTotalPoin($old['siswa_id']);
        }
        $this->updateTotalPoin($validated['siswa_id']);

        return redirect()->back()->with('success', 'Pelanggaran berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $pelanggaran = Pelanggaran::findOrFail($id);
        $siswa = $pelanggaran->siswa;
        $peraturan = $pelanggaran->peraturan;

        LogActivity::add('delete', "Menghapus pelanggaran untuk siswa {$siswa->nama} atas pelanggaran {$peraturan->jenis}");

        $siswaId = $pelanggaran->siswa_id;
        $pelanggaran->delete();

        $this->updateTotalPoin($siswaId);

        return redirect()->back()->with('success', 'Pelanggaran berhasil dihapus.');
    }

    private function updateTotalPoin($siswaId)
    {
        $siswa = Siswa::find($siswaId);
        if ($siswa) {
            $siswa->updatePoinDanStatus();
        }
    }

    public function search(Request $request)
    {
        $term = $request->query('term');

        $results = Pelanggaran::with(['siswa', 'peraturan'])
            ->whereHas('siswa', function ($q) use ($term) {
                $q->where('nama', 'like', "%$term%")
                    ->orWhere('nisn', 'like', "%$term%");
            })
            ->orderBy('waktu_terjadi', 'desc')
            ->get();

        return response()->json($results);
    }

    public function laporan(Request $request)
    {
        $tahun = $request->tahun;
        $bulan = $request->bulan;
        $status = $request->status;

        $query = Pelanggaran::with(['siswa.kelas', 'user', 'peraturan'])
            ->when($tahun, fn($q) => $q->whereYear('waktu_terjadi', $tahun))
            ->when($bulan, fn($q) => $q->whereMonth('waktu_terjadi', $bulan))
            ->when($status, fn($q) => $q->where('status', $status))
            ->latest();

        $results = $query->get();

        return Inertia::render('Laporan/Pelanggaran', [
            'pelanggaran' => $results,
            'filters' => [
                'tahun' => $tahun,
                'bulan' => $bulan,
                'status' => $status,
            ],
        ]);
    }

    public function cetak(Request $request)
    {

        $request->validate([
            'tahun' => 'required|integer',
            'bulan' => 'nullable|integer',
            'status' => 'nullable|string',
        ]);
        
        $tahun = $request->tahun;
        $bulan = $request->bulan;
        $status = $request->status;

        $query = Pelanggaran::with(['siswa.kelas', 'user', 'peraturan'])
            ->when($tahun, fn($q) => $q->whereYear('waktu_terjadi', $tahun))
            ->when($bulan, fn($q) => $q->whereMonth('waktu_terjadi', $bulan))
            ->when($status, fn($q) => $q->where('status', $status))
            ->orderBy('waktu_terjadi', 'desc');

        $data = $query->get();

        $pdf = PDF::loadView('exports.laporan-pdf', [
            'pelanggaran' => $data,
            'tahun' => $tahun,
            'bulan' => $bulan,
            'status' => $status,
        ])->setPaper('A4', 'landscape');

        return $pdf->stream("laporan_pelanggaran_{$tahun}.pdf");
    }
}
