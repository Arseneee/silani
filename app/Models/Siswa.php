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
        // Hitung total poin pelanggaran
        $totalPoin = $this->pelanggaran()->join('peraturan', 'pelanggaran.peraturan_id', '=', 'peraturan.id')
            ->sum('peraturan.poin');

        // Tentukan status berdasarkan total poin
        if ($totalPoin >= 100) {
            $status = 'Drop Out';
        } elseif ($totalPoin >= 75) {
            $status = 'SPO3';
        } elseif ($totalPoin >= 50) {
            $status = 'SPO2';
        } elseif ($totalPoin >= 25) {
            $status = 'SPO1';
        } else {
            $status = 'Aktif';
        }

        $this->update([
            'total_poin' => $totalPoin,
            'status' => $status,
        ]);
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
