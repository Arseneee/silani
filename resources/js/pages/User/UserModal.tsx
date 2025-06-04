import React, { useEffect, useState } from 'react';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; email: string; role: string; no_hp: string }) => void;
    initialData?: {
        id?: number;
        name: string;
        email: string;
        role: string;
        no_hp: string;
    };
    title: string;
}

const roleOptions = ['Admin', 'Wali Kelas', 'Guru BK'];

export default function UserModal({ isOpen, onClose, onSubmit, initialData, title }: UserModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Admin');
    const [noHp, setNoHp] = useState('');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setEmail(initialData.email);
            setRole(initialData.role);
            setNoHp(initialData.no_hp);
        } else {
            setName('');
            setEmail('');
            setRole('Admin');
            setNoHp('');
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = 'Nama wajib diisi';
        if (!email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Format email tidak valid';
        }
        if (!noHp.trim()) {
            newErrors.no_hp = 'Nomor HP wajib diisi';
        } else if (!/^[0-9]+$/.test(noHp)) {
            newErrors.no_hp = 'Nomor HP hanya boleh angka';
        }
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        onSubmit({ name, email, role, no_hp: noHp });
    };

    if (!isOpen) return null;

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black" onClick={onClose}>
            <div className="w-full max-w-md rounded bg-white p-6 dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nama
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded border px-3 py-2 text-sm 
                            border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded border px-3 py-2 text-sm 
                            border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 block w-full rounded border px-3 py-2 text-sm 
                            border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            {roleOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nomor HP
                        </label>
                        <input
                            id="no_hp"
                            type="text"
                            value={noHp}
                            onChange={(e) => setNoHp(e.target.value)}
                            className="mt-1 block w-full rounded border px-3 py-2 text-sm 
                            border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSubmit(e);
                            }}
                        />
                        {errors.no_hp && <p className="text-sm text-red-500">{errors.no_hp}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 
                            dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
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