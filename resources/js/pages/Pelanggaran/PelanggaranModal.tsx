import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface PelanggaranModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        siswa_id: number;
        user_id: number;
        peraturan_id: number;
        status: 'ditunda' | 'diproses' | 'selesai';
        keterangan: string;
        waktu_terjadi: string;
    }) => void;
    initialData: {
        id?: number;
        siswa_id: number;
        user_id: number;
        peraturan_id: number;
        status: 'ditunda' | 'diproses' | 'selesai';
        keterangan: string;
        waktu_terjadi: string;
    } | null;
    title: string;
    siswaOptions: { id: number; nama: string; nisn: string }[];
    userOptions: { id: number; name: string }[];
    peraturanOptions: { id: number; jenis: string }[];
}

const statusOptions = ['ditunda', 'diproses', 'selesai'] as const;

export default function PelanggaranModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    title,
    siswaOptions,
    userOptions,
    peraturanOptions,
}: PelanggaranModalProps) {
    const { auth } = usePage().props as any;

    const [formData, setFormData] = useState({
        siswa_id: 0,
        user_id: auth.user.id,
        peraturan_id: 0,
        status: 'diproses' as 'ditunda' | 'diproses' | 'selesai',
        keterangan: '',
        waktu_terjadi: '',
    });

    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormData(
                initialData ?? {
                    siswa_id: 0,
                    user_id: auth.user.id,
                    peraturan_id: 0,
                    status: 'diproses',
                    keterangan: '',
                    waktu_terjadi: '',
                },
            );
            setStep(1);
            setErrors({});
            setSearchQuery('');
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name.includes('_id') ? Number(value) : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = () => {
        const newErrors: Record<string, string> = {};
        if (step === 1 && formData.siswa_id === 0) {
            newErrors.siswa_id = 'Pilih siswa';
        }
        if (step === 2) {
            if (formData.peraturan_id === 0) newErrors.peraturan_id = 'Pilih peraturan';
            if (!formData.keterangan.trim()) newErrors.keterangan = 'Keterangan tidak boleh kosong';
            if (!formData.waktu_terjadi) newErrors.waktu_terjadi = 'Pilih waktu';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const filteredSiswaOptions = siswaOptions.filter((s) => `${s.nama} ${s.nisn}`.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
                <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>

                <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Langkah {step} dari 3</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${(step / 3) * 100}%` }} />
                    </div>
                </div>

                <div className="space-y-5">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">🔍 Cari dan Pilih Siswa</label>
                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Ketik nama siswa atau NISN..."
                                        className="w-full rounded-xl border border-gray-300 bg-white py-3 pr-4 pl-10 text-gray-900 placeholder-gray-500 transition-all focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                    />
                                    <svg className="absolute top-3.5 left-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div className="max-h-64 space-y-2 overflow-y-auto">
                                    {filteredSiswaOptions.length > 0 ? (
                                        filteredSiswaOptions.map((siswa) => (
                                            <div
                                                key={siswa.id}
                                                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
                                                    formData.siswa_id === siswa.id
                                                        ? 'border-blue-500 bg-blue-50 shadow-md dark:bg-blue-900/20'
                                                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                                                }`}
                                                onClick={() => setFormData((prev) => ({ ...prev, siswa_id: siswa.id }))}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{siswa.nama}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">NISN: {siswa.nisn}</p>
                                                    </div>
                                                    {formData.siswa_id === siswa.id && (
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                                                            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                            <svg className="mx-auto mb-3 h-12 w-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <p>Tidak ada siswa yang sesuai dengan pencarian</p>
                                        </div>
                                    )}
                                </div>
                                {errors.siswa_id && (
                                    <p className="mt-2 flex items-center text-sm text-red-500">
                                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.siswa_id}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Pelanggaran</label>
                                <select
                                    name="peraturan_id"
                                    value={formData.peraturan_id}
                                    onChange={handleChange}
                                    className={`block w-full rounded border ${errors.peraturan_id ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                                >
                                    <option value={0}>Pilih jenis pelanggaran</option>
                                    {peraturanOptions.map((p) => (
                                        <option key={p.id} value={p.id}>{p.jenis}</option>
                                    ))}
                                </select>
                                {errors.peraturan_id && <p className="mt-1 text-xs text-red-500">{errors.peraturan_id}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Keterangan</label>
                                <textarea
                                    name="keterangan"
                                    value={formData.keterangan}
                                    placeholder="Jelaskan detail pelanggaran yang terjadi..."
                                    onChange={handleChange}
                                    rows={3}
                                    className={`block w-full rounded border ${errors.keterangan ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                                />
                                {errors.keterangan && <p className="mt-1 text-xs text-red-500">{errors.keterangan}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Waktu Terjadi</label>
                                <input
                                    type="datetime-local"
                                    name="waktu_terjadi"
                                    value={formData.waktu_terjadi}
                                    onChange={handleChange}
                                    className={`block w-full rounded border ${errors.waktu_terjadi ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                                />
                                {errors.waktu_terjadi && <p className="mt-1 text-xs text-red-500">{errors.waktu_terjadi}</p>}
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 text-sm text-gray-800 dark:text-white">
                            <div>
                                <p className="mb-1">Petugas:</p>
                                <p className="text-lg font-semibold">{auth.user.name}</p>
                            </div>
                            <div>
                                <label htmlFor="status" className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Status Pelanggaran</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="block w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    {statusOptions.map((s) => (
                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={step === 1 ? onClose : () => setStep(step - 1)}
                            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            {step === 1 ? 'Batal' : 'Kembali'}
                        </button>
                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={() => validateStep() && setStep(step + 1)}
                                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                            >
                                Lanjut
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => validateStep() && onSubmit(formData)}
                                className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                            >
                                Simpan
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
