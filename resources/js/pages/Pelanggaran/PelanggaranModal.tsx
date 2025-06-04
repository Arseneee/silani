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
    siswaOptions: { id: number; nama: string }[];
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
    const [formData, setFormData] = useState({
        siswa_id: 0,
        user_id: 0,
        peraturan_id: 0,
        status: 'diproses' as 'ditunda' | 'diproses' | 'selesai',
        keterangan: '',
        waktu_terjadi: '',
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    siswa_id: initialData.siswa_id,
                    user_id: initialData.user_id,
                    peraturan_id: initialData.peraturan_id,
                    status: initialData.status,
                    keterangan: initialData.keterangan,
                    waktu_terjadi: initialData.waktu_terjadi,
                });
            } else {
                setFormData({
                    siswa_id: 0,
                    user_id: 0,
                    peraturan_id: 0,
                    status: 'diproses',
                    keterangan: '',
                    waktu_terjadi: '',
                });
            }
            setErrors({});
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('_id') ? Number(value) : value,
        }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (formData.siswa_id === 0) {
            newErrors.siswa_id = 'Pilih siswa';
        }
        
        if (formData.user_id === 0) {
            newErrors.user_id = 'Pilih petugas';
        }
        
        if (formData.peraturan_id === 0) {
            newErrors.peraturan_id = 'Pilih peraturan';
        }
        
        if (!formData.keterangan.trim()) {
            newErrors.keterangan = 'Keterangan tidak boleh kosong';
        }
        
        if (!formData.waktu_terjadi) {
            newErrors.waktu_terjadi = 'Pilih waktu terjadi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="w-full max-w-md rounded bg-white p-6 dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Siswa */}
                    <div>
                        <label htmlFor="siswa_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Siswa</label>
                        <select
                            id="siswa_id"
                            name="siswa_id"
                            value={formData.siswa_id}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded border ${errors.siswa_id ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                        >
                            <option value={0}>Pilih Siswa</option>
                            {siswaOptions.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.nama}
                                </option>
                            ))}
                        </select>
                        {errors.siswa_id && <p className="mt-1 text-xs text-red-500">{errors.siswa_id}</p>}
                    </div>

                    {/* User (Petugas) */}
                    <div>
                        <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Petugas</label>
                        <select
                            id="user_id"
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded border ${errors.user_id ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                        >
                            <option value={0}>Pilih Petugas</option>
                            {userOptions.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                        {errors.user_id && <p className="mt-1 text-xs text-red-500">{errors.user_id}</p>}
                    </div>

                    {/* Peraturan */}
                    <div>
                        <label htmlFor="peraturan_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Peraturan</label>
                        <select
                            id="peraturan_id"
                            name="peraturan_id"
                            value={formData.peraturan_id}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded border ${errors.peraturan_id ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                        >
                            <option value={0}>Pilih Peraturan</option>
                            {peraturanOptions.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.jenis}
                                </option>
                            ))}
                        </select>
                        {errors.peraturan_id && <p className="mt-1 text-xs text-red-500">{errors.peraturan_id}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            {statusOptions.map((s) => (
                                <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Keterangan */}
                    <div>
                        <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Keterangan</label>
                        <textarea
                            id="keterangan"
                            name="keterangan"
                            value={formData.keterangan}
                            onChange={handleChange}
                            rows={3}
                            className={`mt-1 block w-full rounded border ${errors.keterangan ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.keterangan && <p className="mt-1 text-xs text-red-500">{errors.keterangan}</p>}
                    </div>

                    {/* Waktu Terjadi */}
                    <div>
                        <label htmlFor="waktu_terjadi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Waktu Terjadi</label>
                        <input
                            id="waktu_terjadi"
                            name="waktu_terjadi"
                            type="datetime-local"
                            value={formData.waktu_terjadi}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded border ${errors.waktu_terjadi ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.waktu_terjadi && <p className="mt-1 text-xs text-red-500">{errors.waktu_terjadi}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}