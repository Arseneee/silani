import React, { useEffect, useState } from 'react';

interface PeraturanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { jenis: string; kategori: 'Ringan' | 'Sedang' | 'Berat'; poin: number }) => void;
  initialData?: {
    id?: number;
    jenis: string;
    kategori: 'Ringan' | 'Sedang' | 'Berat';
    poin: number;
  };
  title: string;
}

const kategoriOptions = ['Ringan', 'Sedang', 'Berat'] as const;

export default function PeraturanModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: PeraturanModalProps) {
  const [jenis, setJenis] = useState('');
  const [kategori, setKategori] = useState<'Ringan' | 'Sedang' | 'Berat'>('Ringan');
  const [poin, setPoin] = useState<number>(0);

  const [errors, setErrors] = useState<{ jenis?: string; poin?: string }>({});

  useEffect(() => {
    if (initialData) {
      setJenis(initialData.jenis);
      setKategori(initialData.kategori);
      setPoin(initialData.poin);
    } else {
      setJenis('');
      setKategori('Ringan');
      setPoin(0);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!jenis.trim()) {
      newErrors.jenis = 'Jenis peraturan tidak boleh kosong.';
    }

    if (poin <= 0) {
      newErrors.poin = 'Poin harus lebih dari 0.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({ jenis, kategori, poin });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded bg-white p-6 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="jenis" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Jenis Peraturan
            </label>
            <input
              id="jenis"
              type="text"
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className={`mt-1 block w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white ${
                errors.jenis
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.jenis && <p className="mt-1 text-sm text-red-600">{errors.jenis}</p>}
          </div>

          <div>
            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kategori
            </label>
            <select
              id="kategori"
              value={kategori}
              onChange={(e) => setKategori(e.target.value as 'Ringan' | 'Sedang' | 'Berat')}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {kategoriOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="poin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Poin
            </label>
            <input
              id="poin"
              type="number"
              min={0}
              value={poin}
              onChange={(e) => setPoin(Number(e.target.value))}
              className={`mt-1 block w-full rounded border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white ${
                errors.poin
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.poin && <p className="mt-1 text-sm text-red-600">{errors.poin}</p>}
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