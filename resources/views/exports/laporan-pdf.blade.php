<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Laporan Pelanggaran</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #eee;
        }

        h2,
        p {
            text-align: center;
            margin: 0;
        }
    </style>
</head>

<body>

    <h2>LAPORAN PELANGGARAN SISWA</h2>
    <p>SMK Negeri 1 Percut Sei Tuan</p>
    <p>
        @php
            $namaBulan = [
                1 => 'Januari',
                2 => 'Februari',
                3 => 'Maret',
                4 => 'April',
                5 => 'Mei',
                6 => 'Juni',
                7 => 'Juli',
                8 => 'Agustus',
                9 => 'September',
                10 => 'Oktober',
                11 => 'November',
                12 => 'Desember',
            ];
        @endphp
        Tahun: {{ $tahun }}
        @if ($bulan)
            | Bulan: {{ $namaBulan[(int) $bulan] }}
        @endif
        @if ($status)
            | Status: {{ ucfirst($status) }}
        @endif
    </p>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Kelas</th>
                <th>Pelanggaran</th>
                <th>Status</th>
                <th>Waktu</th>
                <th>Petugas</th>
                <th>Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($pelanggaran as $i => $item)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $item->siswa->nama ?? '-' }}</td>
                    <td>{{ $item->siswa->kelas->nama ?? '-' }}</td>
                    <td>{{ $item->peraturan->jenis ?? '-' }}</td>
                    <td>{{ ucfirst($item->status) }}</td>
                    <td>{{ \Carbon\Carbon::parse($item->waktu_terjadi)->format('d-m-Y H:i') }}</td>
                    <td>{{ $item->user->name ?? '-' }}</td>
                    <td>{{ $item->keterangan }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" align="center">Tidak ada data.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

</body>

</html>
