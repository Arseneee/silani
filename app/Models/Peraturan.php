<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Peraturan extends Model
{
    use HasFactory;

    protected $table = 'peraturan';

    protected $fillable = [
        'jenis',
        'kategori',
        'poin',
    ];

    protected $casts = [
        'poin' => 'integer',
    ];

    public function pelanggaran()
    {
        return $this->hasMany(Pelanggaran::class);
    }
}
