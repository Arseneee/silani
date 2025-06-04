import React, { useEffect, useState } from 'react';

interface SiswaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        nisn: string;
        nama: string;
        kelas_id: number;
        nama_ortu: string;
        hp_ortu: string;
        status: 'Aktif' | 'SPO1' | 'SPO2' | 'SPO3' | 'Drop Out';
    }) => void;
    initialData: {
        hp_ortu: string;
        id?: number;
        nisn: string;
        nama: string;
        kelas_id: number;
        nama_ortu: string;
        total_poin: number;
        status: 'Aktif' | 'SPO1' | 'SPO2' | 'SPO3' | 'Drop Out';
    } | null;
    title: string;
    kelasOptions: { id: number; nama: string }[];
}

const statusOptions = ['Aktif', 'SPO1', 'SPO2', 'SPO3', 'Drop Out'] as const;

export default function SiswaModal({ isOpen, onClose, onSubmit, initialData, title, kelasOptions }: SiswaModalProps) {
    const [nisn, setNisn] = useState('');
    const [nama, setNama] = useState('');
    const [kelasId, setKelasId] = useState<number>(0);
    const [namaOrtu, setNamaOrtu] = useState('');
    const [HPOrtu, setHPOrtu] = useState('');
    const [status, setStatus] = useState<'Aktif' | 'SPO1' | 'SPO2' | 'SPO3' | 'Drop Out'>('Aktif');

    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    useEffect(() => {
        if (initialData) {
            setNisn(initialData.nisn);
            setNama(initialData.nama);
            setKelasId(initialData.kelas_id);
            setNamaOrtu(initialData.nama_ortu);
            setStatus(initialData.status);
            setHPOrtu(initialData.hp_ortu);
        } else {
            setNisn('');
            setNama('');
            setKelasId(kelasOptions.length > 0 ? kelasOptions[0].id : 0);
            setNamaOrtu('');
            setHPOrtu('');
            setStatus('Aktif');
        }
        setErrors({});
    }, [initialData, isOpen, kelasOptions]);

    const validate = () => {
        const newErrors: Partial<Record<string, string>> = {};
        if (!nisn.trim()) newErrors.nisn = 'NISN tidak boleh kosong';
        if (!nama.trim()) newErrors.nama = 'Nama tidak boleh kosong';
        if (!namaOrtu.trim()) newErrors.nama_ortu = 'Nama orang tua tidak boleh kosong';
        if (!HPOrtu.trim()) newErrors.hp_ortu = 'No HP tidak boleh kosong';
        else if (!/^08\d{8,13}$/.test(HPOrtu)) newErrors.hp_ortu = 'Format No HP tidak valid';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        onSubmit({
            nisn,
            nama,
            kelas_id: kelasId,
            nama_ortu: namaOrtu,
            status,
            hp_ortu: HPOrtu,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black" onClick={onClose}>
            <div className="w-full max-w-md rounded bg-white p-6 dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* NISN */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">NISN</label>
                        <input
                            type="text"
                            value={nisn}
                            onChange={(e) => setNisn(e.target.value)}
                            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {errors.nisn && <p className="text-sm text-red-500">{errors.nisn}</p>}
                    </div>

                    {/* Nama */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label>
                        <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {errors.nama && <p className="text-sm text-red-500">{errors.nama}</p>}
                    </div>

                    {/* Kelas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kelas</label>
                        <select
                            value={kelasId}
                            onChange={(e) => setKelasId(Number(e.target.value))}
                            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            {kelasOptions.length > 0 ? (
                                kelasOptions.map((kelas) => (
                                    <option key={kelas.id} value={kelas.id}>
                                        {kelas.nama}
                                    </option>
                                ))
                            ) : (
                                <option value={0}>Tidak ada kelas tersedia</option>
                            )}
                        </select>
                    </div>

                    {/* Nama Orang Tua */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Orang Tua</label>
                        <input
                            type="text"
                            value={namaOrtu}
                            onChange={(e) => setNamaOrtu(e.target.value)}
                            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {errors.nama_ortu && <p className="text-sm text-red-500">{errors.nama_ortu}</p>}
                    </div>

                    {/* HP Orang Tua */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">No HP Orang Tua</label>
                        <input
                            type="text"
                            value={HPOrtu}
                            onChange={(e) => setHPOrtu(e.target.value)}
                            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {errors.hp_ortu && <p className="text-sm text-red-500">{errors.hp_ortu}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as typeof status)}
                            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            {statusOptions.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            Batal
                        </button>
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
