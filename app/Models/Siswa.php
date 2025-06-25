<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    use HasFactory;

    protected $table = 'siswa';

    protected $fillable = [
        'nisn',
        'nama',
        'kelas_id',
        'nama_ortu',
        'hp_ortu',
        'total_poin',
        'status',
    ];

    protected $casts = [
        'total_poin' => 'integer',
    ];

    public function updatePoinDanStatus()
    {
        $totalPoin = $this->pelanggaran()
            ->join('peraturan', 'pelanggaran.peraturan_id', '=', 'peraturan.id')
            ->sum('peraturan.poin');

        $statusLama = $this->status;
        $statusBaru = 'Aktif';

        if ($totalPoin >= 100) {
            $statusBaru = 'Drop Out';
        } elseif ($totalPoin >= 75) {
            $statusBaru = 'SPO3';
        } elseif ($totalPoin >= 50) {
            $statusBaru = 'SPO2';
        } elseif ($totalPoin >= 25) {
            $statusBaru = 'SPO1';
        }

        $this->update([
            'total_poin' => $totalPoin,
            'status' => $statusBaru,
        ]);

        return [$statusLama, $statusBaru];
    }



    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function pelanggaran()
    {
        return $this->hasMany(Pelanggaran::class);
    }
}
