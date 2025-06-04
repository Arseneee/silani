import React, { useEffect, useRef, useState } from 'react';

interface Kelas {
    id?: number;
    nama: string;
    user_id: number;
    jumlah_siswa: number;
}

interface User {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Kelas, 'id'>) => void;
    initialData?: Kelas | null;
    users: User[];
    title: string;
}

export default function KelasModal({ isOpen, onClose, onSubmit, initialData, users, title }: Props) {
    const [nama, setNama] = useState('');
    const [userId, setUserId] = useState<number>(0);
    const [jumlahSiswa, setJumlahSiswa] = useState(0);

    const [errors, setErrors] = useState<{ nama?: string; user_id?: string }>({});

    const namaInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setNama(initialData.nama);
            setUserId(initialData.user_id);
            setJumlahSiswa(initialData.jumlah_siswa);
            setErrors({});
        } else {
            setNama('');
            setUserId(0);
            setJumlahSiswa(0);
            setErrors({});
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                namaInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: typeof errors = {};

        if (!nama.trim()) {
            newErrors.nama = 'Nama kelas wajib diisi';
        }
        if (userId === 0) {
            newErrors.user_id = 'Wali kelas harus dipilih';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onSubmit({ nama, user_id: userId, jumlah_siswa: jumlahSiswa });
        }
    };

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-black"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="w-96 rounded-lg bg-white p-6 dark:bg-gray-800">
                <h2 id="modal-title" className="mb-4 text-lg font-semibold">
                    {title}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label htmlFor="nama" className="mb-1 block">
                            Nama Kelas
                        </label>
                        <input
                            id="nama"
                            type="text"
                            ref={namaInputRef}
                            className={`w-full rounded border px-3 py-2 ${errors.nama ? 'border-red-500' : 'border-gray-300'}`}
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            aria-invalid={!!errors.nama}
                            aria-describedby={errors.nama ? 'nama-error' : undefined}
                        />
                        {errors.nama && (
                            <p id="nama-error" className="mt-1 text-sm text-red-600">
                                {errors.nama}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="wali-kelas" className="mb-1 block">
                            Wali Kelas
                        </label>
                        <select
                            id="wali-kelas"
                            className={`w-full rounded border bg-white px-3 py-2 text-gray-900 dark:bg-gray-700 dark:text-gray-100 ${errors.user_id ? 'border-red-500' : 'border-gray-300'}`}
                            value={userId}
                            onChange={(e) => setUserId(Number(e.target.value))}
                            aria-invalid={!!errors.user_id}
                            aria-describedby={errors.user_id ? 'wali-kelas-error' : undefined}
                        >
                            <option value={0} className="text-gray-500 dark:text-gray-400">
                                Pilih Wali Kelas
                            </option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id} className="text-gray-900 dark:text-gray-100">
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        {errors.user_id && (
                            <p id="wali-kelas-error" className="mt-1 text-sm text-red-600">
                                {errors.user_id}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="jumlah-siswa" className="mb-1 block">
                            Jumlah Siswa
                        </label>
                        <input
                            id="jumlah-siswa"
                            type="number"
                            className="w-full rounded border border-gray-300 px-3 py-2"
                            value={jumlahSiswa}
                            onChange={(e) => setJumlahSiswa(Number(e.target.value))}
                            min={0}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100">
                            Batal
                        </button>
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
