<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('siswa', function (Blueprint $table) {
            $table->id();
            $table->string('nisn');
            $table->string('nama');
            $table->unsignedBigInteger('kelas_id')->nullable();
            $table->string('nama_ortu');
            $table->string('hp_ortu');
            $table->integer('total_poin')->default(0);
            $table->enum('status', ['Aktif', 'SPO1', 'SPO2', 'SPO3', 'Drop Out'])->default('Aktif');
            $table->timestamps();

            $table->foreign('kelas_id')->references('id')->on('kelas')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
